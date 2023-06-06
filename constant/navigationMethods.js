import { StackActions } from "@react-navigation/native";
import { navigationRef } from "../App";

const pushNavigation = (screenName, props) => {
  console.log("props--->", props);
  if (navigationRef.isReady()) {
    console.log("navigationRef.current", navigationRef.current.getState());
    navigationRef.navigate(screenName, props);
  }
};
const popNavigation = () => {
  if (navigationRef.isReady()) {
    const pop = StackActions.pop();
    navigationRef.dispatch(pop);
  }
};
const popTotop = () => {
  if (navigationRef.isReady()) {
    const pop = StackActions.popToTop();
    navigationRef.dispatch(pop);
  }
};
const resetNavigation = (screenName) => {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name: screenName }] });
  }
};
export { pushNavigation, popNavigation, popTotop, resetNavigation };
