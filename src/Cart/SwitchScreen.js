import React from "react";
import { Cart, Ship, Rates, Billing } from "./index";

const SwitchScreens = (props) => {
  switch (props?.screen) {
    case 0:
      return <Cart {...props} />;
    case 1:
      return <Ship {...props} />;
    case 2:
      return <Rates {...props} />;
    case 3:
      return <Billing {...props} />;
  }
};
export { SwitchScreens };
