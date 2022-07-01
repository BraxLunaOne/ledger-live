import React, { useEffect, useCallback, useState, useRef, memo } from "react";
import { FlatList } from "react-native";
import { concat, from } from "rxjs";
import { ignoreElements } from "rxjs/operators";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  CryptoCurrency,
  Account,
  Currency,
  AccountLike,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { getCurrencyBridge } from "@ledgerhq/live-common/lib/bridge";
import { Device } from "@ledgerhq/live-common/lib/hw/actions/types";

import { Flex, InfiniteLoader } from "@ledgerhq/native-ui";
import { replaceAccounts } from "../../actions/accounts";
import logger from "../../logger";
import { ScreenName } from "../../const";
import { TrackScreen } from "../../analytics";
import Button from "../../components/Button";
import PreventNativeBack from "../../components/PreventNativeBack";
import LText from "../../components/LText";
import RetryButton from "../../components/RetryButton";
import CancelButton from "../../components/CancelButton";
import GenericErrorBottomModal from "../../components/GenericErrorBottomModal";
import { prepareCurrency } from "../../bridge/cache";
import AccountCard from "../../components/AccountCard";

type RouteParams = {
  currency: CryptoCurrency | TokenCurrency;
  device: Device;
  onSuccess?: (params?: any) => void;
};

type Props = {
  navigation: any;
  route: { params: RouteParams };
  blacklistedTokenIds?: string[];
  colors: any;
};

function AddAccountsAccounts({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState(null);
  const [scannedAccounts, setScannedAccounts] = useState<Account[]>([]);
  const [cancelled, setCancelled] = useState(false);

  const scanSubscription = useRef<any>();

  const {
    currency,
    device: { deviceId },
  } = route.params || {};

  useEffect(() => {
    startSubscription();
    return () => stopSubscription(false);
  }, []);

  const startSubscription = useCallback(() => {
    const c =
      currency.type === "TokenCurrency" ? currency.parentCurrency : currency;
    const bridge = getCurrencyBridge(c);
    const syncConfig = {
      paginationConfig: {
        operation: 0,
      },
      blacklistedTokenIds: [],
    };
    // will be set to false if an existing account is found

    scanSubscription.current = concat(
      from(prepareCurrency(c)).pipe(ignoreElements()),
      bridge.scanAccounts({
        currency: c,
        deviceId,
        syncConfig,
      }),
    ).subscribe({
      next: ({ account }) => {
        setScannedAccounts((accs: Account[]) => [...accs, account]);
      },
      complete: () => setScanning(false),
      error: error => {
        logger.critical(error);
        setError(error);
      },
    });
  }, [currency, deviceId]);

  const restartSubscription = useCallback(() => {
    setScanning(true);
    setScannedAccounts([]);
    setError(null);
    setCancelled(false);
    startSubscription();
  }, []);

  const stopSubscription = useCallback((syncUI: boolean = true) => {
    if (scanSubscription.current) {
      scanSubscription.current.unsubscribe();
      scanSubscription.current = null;
      if (syncUI) {
        setScanning(false);
      }
    }
  }, []);

  const onCancel = useCallback(() => {
    setError(null);
    setCancelled(true);
  }, []);

  const onModalHide = useCallback(() => {
    if (cancelled) {
      navigation.getParent().pop();
    }
  }, [cancelled, navigation]);

  const selectAccount = useCallback(
    (account: Account) => {
      dispatch(
        replaceAccounts({
          scannedAccounts,
          selectedIds: [account.id],
          renamings: {},
        }),
      );
      navigation.navigate(ScreenName.ReceiveConfirmation, {
        ...route.params,
        accountId: account.id,
      });
    },
    [dispatch, navigation, route.params, scannedAccounts],
  );

  const renderItem = useCallback(
    ({ item: account }: { item: Account }) => (
      <Flex px={6}>
        <AccountCard account={account} onPress={() => selectAccount(account)} />
      </Flex>
    ),
    [selectAccount],
  );

  const renderHeader = useCallback(
    () => (
      <Flex p={6}>
        <LText fontSize="32px" fontFamily="InterMedium" semiBold>
          {t("transfer.receive.selectAccount.title")}
        </LText>
        <LText variant="body" color="colore.neutral.70">
          {t("transfer.receive.selectAccount.subtitle", {
            currencyTicker: currency.ticker,
          })}
        </LText>
      </Flex>
    ),
    [currency.ticker, t],
  );

  const keyExtractor = useCallback(item => item?.id, []);

  return (
    <>
      <TrackScreen
        category="AddAccounts"
        name="Accounts"
        currencyName={currency.name}
      />
      <PreventNativeBack />
      {scanning ? (
        <ScanLoading
          currency={currency}
          scannedAccounts={scannedAccounts}
          stopSubscription={stopSubscription}
        />
      ) : (
        <FlatList
          data={scannedAccounts}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
        />
      )}
      <GenericErrorBottomModal
        error={error}
        onModalHide={onModalHide}
        footerButtons={
          <>
            <CancelButton flex={1} mx={8} onPress={onCancel} />
            <RetryButton flex={1} mx={8} onPress={restartSubscription} />
          </>
        }
      />
    </>
  );
}

function ScanLoading({
  currency,
  scannedAccounts,
  stopSubscription,
}: {
  currency: Currency;
  scannedAccounts: Account[];
  stopSubscription: () => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <Flex flex={1} alignItems="center" justifyContent="center" m={6}>
        <InfiniteLoader size={48} />
        <LText mt={13} variant="h2">
          {t("transfer.receive.addAccount.title")}
        </LText>
        <LText p={6} textAlign="center" variant="body" color="neutral.c80">
          {t("transfer.receive.addAccount.subtitle", {
            currencyTicker: currency?.ticker,
          })}
        </LText>
      </Flex>
      <Flex
        minHeight={120}
        flexDirection="column"
        alignItems="stretch"
        m={6}
        justifyContent="flex-end"
      >
        {scannedAccounts?.length > 0 ? (
          <>
            <LText textAlign="center" mb={6} variant="body" color="neutral.c80">
              {t("transfer.receive.addAccount.foundAccounts", {
                count: scannedAccounts?.length,
              })}
            </LText>
            <Button type="secondary" onPress={stopSubscription}>
              {t("transfer.receive.addAccount.stopSynchronization")}
            </Button>
          </>
        ) : null}
      </Flex>
    </>
  );
}

export default memo(AddAccountsAccounts);