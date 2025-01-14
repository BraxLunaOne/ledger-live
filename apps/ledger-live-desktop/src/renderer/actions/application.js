// @flow
import { createAction } from "redux-actions";

export const unlock = createAction("APPLICATION_SET_DATA", () => ({
  isLocked: false,
  hasPassword: true,
}));
export const lock = createAction("APPLICATION_SET_DATA", () => ({
  isLocked: true,
  hasPassword: true,
}));
export const setHasPassword = createAction("APPLICATION_SET_DATA", hasPassword => ({
  hasPassword,
}));
export const setDismissedCarousel = createAction("APPLICATION_SET_DATA", dismissedCarousel => ({
  dismissedCarousel,
}));
export const setOSDarkMode = createAction("APPLICATION_SET_DATA", osDarkMode => ({ osDarkMode }));
export const setNotSeededDeviceRelaunch = createAction(
  "APPLICATION_SET_DATA",
  notSeededDeviceRelaunch => ({ notSeededDeviceRelaunch }),
);
export const setNavigationLock = createAction("APPLICATION_SET_DATA", navigationLocked => ({
  navigationLocked,
}));
export const toggleSkeletonVisibility = createAction(
  "APPLICATION_SET_DATA",
  alwaysShowSkeletons => ({ debug: { alwaysShowSkeletons } }),
);

export const relaunchOnboarding = createAction("RELAUNCH_ONBOARDING", onboardingRelaunched => ({
  onboardingRelaunched,
}));
