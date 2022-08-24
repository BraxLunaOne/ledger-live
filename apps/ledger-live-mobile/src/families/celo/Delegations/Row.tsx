import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import {
  CosmosMappedDelegation,
  CosmosMappedUnbonding,
} from "@ledgerhq/live-common/families/cosmos/types";
import { Currency } from "@ledgerhq/types-cryptoassets";
import { useTheme } from "@react-navigation/native";
import { Text } from "@ledgerhq/native-ui";
import CounterValue from "../../../components/CounterValue";
import ArrowRight from "../../../icons/ArrowRight";
import LText from "../../../components/LText";
import ValidatorImage from "../../cosmos/shared/ValidatorImage";
import { LEDGER_BY_FIGMENT_VALIDATOR_GROUP_ADDRESS, revokableVotes, voteStatus } from "@ledgerhq/live-common/families/celo/logic";
import { CeloAccount, CeloVote } from "@ledgerhq/live-common/lib/families/celo/types";
import { formatAmount } from "./utils";

type Props = {
  account: CeloAccount,
  vote: CeloVote;
  currency: Currency;
  onPress: (vote: CeloVote) => void;
  isLast?: boolean;
  getValidatorName: (vote: CeloVote) => string;
};

export default function DelegationRow({
  account,
  vote,
  currency,
  onPress,
  isLast = false,
  getValidatorName,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  // const { validator, validatorAddress, formattedAmount, amount } = delegation;
  const { validatorGroup, amount } = vote;
  const validatorName = getValidatorName(vote) ?? "";
  
  // const actions = voteActions(vote);
  const status = voteStatus(vote);

  return (
    <TouchableOpacity
      style={[
        styles.row,
        styles.wrapper,
        !isLast
          ? { ...styles.borderBottom, borderBottomColor: colors.lightGrey }
          : undefined,
      ]}
      onPress={() => onPress(vote)}
    >
      <View style={[styles.icon]}>
        <ValidatorImage
          size={42}
          isLedger={validatorGroup === LEDGER_BY_FIGMENT_VALIDATOR_GROUP_ADDRESS}
          name={validatorName}
        />
      </View>

      <View style={styles.nameWrapper}>
        <Text variant={"body"} fontWeight={"semiBold"} numberOfLines={1}>
          {validatorName}
        </Text>

        <View style={styles.row}>
          <LText style={styles.seeMore} color="live">
            {t("common.seeMore")}
          </LText>
          <ArrowRight color={colors.live} size={14} />
        </View>
      </View>

      <View style={styles.rightWrapper}>
        <Text variant={"body"} fontWeight={"semiBold"}>
          {formatAmount(account, vote.amount ?? 0)}
        </Text>

        <LText color="grey">
          <CounterValue
            currency={currency}
            showCode={true}
            value={amount}
            alwaysShowSign={false}
            withPlaceholder
          />
        </LText>
      </View>
    </TouchableOpacity>
  );
}

// const voteActions = (vote: CeloVote) => {
//   const actions = [];

//   if (vote.activatable)
//     actions.push({
//       key: "MODAL_CELO_ACTIVATE",
//       label: <Trans i18nKey="celo.delegation.actions.activate" />,
//     });

//   if (vote.revokable)
//     actions.push({
//       key: "MODAL_CELO_REVOKE",
//       label: <Trans i18nKey="celo.delegation.actions.revoke" />,
//     });

//   return actions;
// };

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMore: {
    fontSize: 14,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 5,

    marginRight: 12,
  },
  nameWrapper: {
    flex: 1,
    marginRight: 8,
  },
  rightWrapper: {
    alignItems: "flex-end",
  },
});

