import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
// import { useSelector } from "react-redux";
import { FlagAction } from "./FlagAction";
import AuthContext from "../../Context/AuthContext";

const BtnView = ({ data, flag_action, typeOfFlag, ownerCheck }) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  //   const typeOfFlag = useSelector((state) => state.SheetReducer.flagType);
  let len = data?.length;
  let checkCl = (obj) => obj?.activity == "clarification-requested";
  let checkAcc = (obj) => obj?.activity == "accepted";
  let checkRes = (obj) => obj?.activity == "resolved";
  let checkDec = (obj) => obj?.activity == "declined";
  let checkRej = (obj) => obj?.activity == "rejected";
  let checkRem = (obj) => obj?.activity == "flag-removal-request";
  let existsRem = data?.length ? data?.some(checkRem) : null;
  let existsDec = data?.length ? data?.some(checkDec) : null;
  let existsCl = len ? data?.some(checkCl) : null;
  let existsAcc = data?.length ? data?.some(checkAcc) : null;
  let existsRes = data?.length ? data?.some(checkRes) : null;

  let declined = len ? data?.filter(checkDec) : [];
  let rejected = len ? data?.filter(checkRej) : [];
  let decLen = declined?.length;
  let rejLen = rejected?.length;
  if (len) {
    if (typeOfFlag == "sent") {
      if (!existsCl && !existsAcc && !existsRes) {
        if (decLen !== rejLen) {
          // show both buttons
          return (
            <FlagAction
              title="Decline"
              otherTitle="Resolve"
              action={() => flag_action("Decline", "declined")}
              otherAction={() => flag_action("Resolve", "resolved")}
            />
          );
        } else {
          // show only resolve button
          return (
            <FlagAction
              single
              title="Decline"
              otherTitle="Resolve"
              action={() => flag_action("Decline", "declined")}
              otherAction={() => flag_action("Resolve", "resolved")}
            />
          );
        }
      } else if (existsAcc && !existsRem) {
        return (
          <FlagAction
            single
            otherTitle="Resolve"
            otherAction={() => flag_action("Resolve", "resolved")}
          />
        );
      } else if (existsRem && !existsCl) {
        // show both buttons
        return (
          <FlagAction
            title="Decline"
            otherTitle="Resolve"
            action={() => flag_action("Decline", "declined")}
            otherAction={() => flag_action("Resolve", "resolved")}
          />
        );
      } else {
        return null;
      }
    } else {
      // typeOfFlag == "received"
      if (!existsCl && !existsAcc && !existsRes) {
        if (decLen == rejLen) {
          // show both buttons
          console.log("here");
          if (ownerCheck) {
            return (
              <FlagAction
                title={language?.reject}
                otherTitle="Accept"
                action={() => flag_action("Reject", "rejected")}
                otherAction={() => flag_action("Accept", "accepted")}
              />
            );
          } else {
            return null;
          }
        } else {
          // show only accept button
          return (
            <FlagAction
              single
              otherTitle="Accept"
              otherAction={() => flag_action("Accept", "accepted")}
            />
          );
        }
      } else if (existsAcc && !existsRem) {
        return (
          <FlagAction
            single
            width={200}
            otherTitle="Request for flag removal"
            otherAction={() =>
              flag_action("Remove Flag", "flag-removal-request")
            }
          />
        );
      } else if (existsRem && !existsCl && !existsRes) {
        // show only accept button
        return (
          <FlagAction
            single
            otherTitle="Accept"
            otherAction={() => flag_action("Accept", "accepted")}
          />
        );
      } else {
        return null;
      }
    }
  } else {
    return null;
  }
};

export { BtnView };

const styles = StyleSheet.create({});
