import { useContext } from "react";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";
import AuthContext from "../../../../Context/AuthContext";

let initialVal = {
  userName: "",
  phone: "",
  email: "",
};
let initialAddress = {
  address: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
};
let initialNewValues = {
  weight: null,
  length: null,
  height: null,
  width: null,
};

const checkValidations = async (handleError, handleError2, dispatch, val) => {
  const {
    newValues,
    values,
    values2,
    address,
    address2,
    navigation,
    currentItem,
    phoneError,
    phoneError_2,
    media_url,
  } = val;
  const {
    myState: { language },
  } = useContext(AuthContext);
  // console.log("address", values.phone && values.phone?.length < 7);
  // console.log("address", values2.phone);
  // console.log("phoneError", phoneError);
  // console.log("address2", address2);
  let isValid = true;
  // let sendParam = { currentItem, rates: {} };
  // navigation.navigate("ShipRate", { sendParam });
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // console.log('newVal', newValues)
  if (
    !newValues.weight ||
    !newValues.length ||
    !newValues.height ||
    !newValues.width
  ) {
    // handleError("User name is Required.", "userNameErrMessage");
    isValid = false;
  }
  if (!values.userName) {
    handleError("User name is Required.", "userNameErrMessage");
    isValid = false;
  }
  if (!values.phone?.length) {
    handleError("", "", "phone");
    isValid = false;
  }
  if (values.phone?.length < 7 || phoneError) {
    handleError("", "", "phone");
    isValid = false;
  }

  if (!values.email) {
    handleError(language?.email_is_missing, "emailErrMessage");
    isValid = false;
  }
  if (reg.test(values.email) == false) {
    handleError(language?.please_enter_valid_email, "emailErrMessage");
    isValid = false;
  }
  if (!values2.phone?.length) {
    handleError2("", "", "phone");
    isValid = false;
  }
  if (values2.phone?.length < 7 || phoneError_2) {
    handleError2("", "", "phone");
    isValid = false;
  }

  if (!values2.userName) {
    handleError2("User name is Required.", "userNameErrMessage");
    isValid = false;
  }

  if (!values2.email) {
    handleError2(language?.email_is_missing, "emailErrMessage");
    isValid = false;
  }
  if (reg.test(values2.email) == false) {
    handleError2(language?.please_enter_valid_email, "emailErrMessage");
    isValid = false;
  }
  if (
    !newValues.weight ||
    !newValues?.length ||
    !newValues?.height ||
    !newValues?.width
  ) {
    handleError("All Parcel detail fields are required.", "parcelErrMessage");
    isValid = false;
  }

  if (isValid) {
    dispatch(allActions.DataAction.ActivityModal(true));
    //   setLoading(false);
    // console.log("valid", address);
    // let address_1 = address.address;
    // let address_2 = address2.address;
    // address_1.country = "US";
    // address_2.country = "US";

    let body = {
      from_address: {
        name: values.userName,
        email: values.email,
        // phone: '+18563368371',
        phone: values.phone,
        address: address?.address,
        city: address?.city,
        state: address?.state,
        zipcode: (address?.zipcode).toString(),
        country: address?.country,
      },
      to_address: {
        name: values2.userName,
        email: values2.email,
        phone: values2.phone,
        address: address2?.address,
        city: address2?.city,
        state: address2?.state,
        zipcode: (address2?.zipcode).toString(),
        country: address2?.country,
      },
      parcels: [
        {
          parcel_details: {
            length: newValues?.length,
            width: newValues?.width,
            height: newValues?.height,
            weight: newValues?.weight,
          },
          quantity: 1,
        },
      ],
    };
    let {
      last_bid: { auction_id },
    } = currentItem;
    let bodyNext = {};
    bodyNext.auction_id = auction_id;
    bodyNext.shipping_address = body.from_address;
    bodyNext.billing_address = body.to_address;
    console.log("BODY-->", JSON.stringify(body));
    // console.log("trade-->", currentItem);
    const response = await MindAxios.post(
      Env.createUrl("shipments/generate-rates"),
      body
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    console.log("res-->", response);
    const { status } = response;
    if (status == 200) {
      const {
        data: {
          result: { rates },
        },
      } = response;
      // console.log(rates);
      let sendParam = { currentItem, rates, bodyNext, media_url };
      navigation.navigate("ShipRate", { sendParam });
    }
  }
};

export default {
  checkValidations,
  initialVal,
  initialAddress,
  initialNewValues,
};
