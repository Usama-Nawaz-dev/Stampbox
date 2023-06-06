import moment from "moment";
import { Keyboard } from "react-native";
import colors from "../constant/colors";
import Toast from "react-native-root-toast";
import analytics from "@react-native-firebase/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import PushNotification from "react-native-push-notification";

const fbEvent = async (title, body) => {
  const defaultBody = {
    ITEM_ID: Math.random().toString(),
    ITEM_NAME: title,
    CONTENT_TYPE: "button",
  };
  console.log(`${title} event triggered`);
  await analytics().logEvent(title, body ? body : defaultBody);
};
const INTERVAL = 1000;
const debounceCall = (callback) => {
  _.debounce(() => callback(), INTERVAL, {
    leading: true,
    trailing: false,
    maxWait: INTERVAL,
  });
};
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // console.log("store error is here", e);
    // saving error
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    // console.log("data get error", e);
    // error reading value
  }
};

const login = async (token, user) => {
  await storeData("token", token);
  await storeData("user", JSON.stringify(user));
};

const getUser = async () => {
  return JSON.parse(await getData("user"));
};

const setUser = async (user) => {
  await storeData("user", JSON.stringify(user));
};
const setObj = async (key, data) => {
  if (key == "cart") {
    let userID = await getData("userId");
    let cart_key = `cart_${userID}`;
    await storeData(cart_key, JSON.stringify(data));
  } else {
    await storeData(key, JSON.stringify(data));
  }
};
const getObj = async (key) => {
  if (key == "cart") {
    let userID = await getData("userId");
    let cart_key = `cart_${userID}`;
    return JSON.parse(await getData(cart_key));
  }
  return JSON.parse(await getData(key));
};
const removeLocal = async (key) => {
  try {
    if (key == "cart") {
      let userID = await getData("userId");
      let cart_key = `cart_${userID}`;
      await AsyncStorage.removeItem(cart_key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    alert("local starage error");
  }
};
const showToast = (toast) => {
  // When Calling this function
  // call it this way: Helpers.showToast({message: "hello", hide: ()=>{alert("hello")}})
  // If you only want to show message call Helpers.showToastMessage("my message")

  const message = toast.message;
  const position = toast.position || "BOTTOM";
  const duration = toast.duration || 2000;
  const show = toast.show || undefined;
  const shown = toast.shown || undefined;
  const hide = toast.hide || undefined;
  const hidden = toast.hidden || undefined;

  console.log("toast", toast);

  if (message !== undefined) {
    Toast.show(message, {
      containerStyle: { borderRadius: 10, flexDirection: "row", bottom: 60 },
      textStyle: { top: 2, fontSize: 14 },
      duration: duration,
      position: Toast.positions[position],
      animation: true,
      hideOnPress: true,
      backgroundColor: toast?.color ? toast?.color : "#000",
      delay: 0,
    });
  }
};

const showToastMessage = (message, color) => {
  showToast({ message, color });
};
const TimeDiffDaysMin = (from) => {
  // console.log('d1', from)
  // 2022-03-10 15:51:13
  const d = new Date();
  let month = Number(d.getMonth()) + 1;
  let day = d.getDate();
  let year = d.getFullYear();
  let hour = Number(d.getHours());
  var b = moment([year, month, day]);
  // console.log("month, year, day", month, year, day);
  let get_date = from;
  let break_date1 = get_date.split(" ");
  let date = break_date1[0];
  let time = break_date1[1];
  let break_date = date.split("-");
  let break_time = time.split(":");
  var a = moment([break_date[0], break_date[1], break_date[2]]);
  let hrs = Number(break_time[0]) - hour;
  let differ = a.diff(b) / 1000;
  let total = differ + hrs * 3600;
  // console.log("diff--->", hrs-hour);

  return total;
};

const convert = (from) => {
  // console.log('d1', d1_utc)
  // 2022-03-10 15:51:13
  let get_date = from;
  let break_date1 = get_date.split(" ");
  let date = break_date1[0];
  let time = break_date1[1];
  let break_date = date.split("-");
  let break_time = time.split(":");

  var d2_utc = new Date(
    break_date[0],
    break_date[1] - 1,
    break_date[2],

    break_time[0],
    break_time[1],
    break_time[2]
  );
  // console.log('hours', break_time[0]+5)
  return d2_utc;
};

const hoursTimeDiff = (startTime, endTime) => {
  // var todayDate = getCurrentDate(); // return in format YYYY-MM-DD
  var startDate = convert(startTime);
  var endDate = convert(endTime);

  // var startDate = new Date(`${startTime}`);
  // var endDate = new Date(`${endTime}`);
  var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
  // console.log('timeDiff', timeDiff);
  var hh = Math.floor(timeDiff / 1000 / 60 / 60);
  hh = ("0" + hh).slice(-2);
  // console.log('hh', hh);
  timeDiff -= hh * 1000 * 60 * 60;
  var mm = Math.floor(timeDiff / 1000 / 60);
  mm = ("0" + mm).slice(-2);

  timeDiff -= mm * 1000 * 60;
  var ss = Math.floor(timeDiff / 1000);
  ss = ("0" + ss).slice(-2);

  // console.log("Time Diff- " + hh + ":" + mm + ":" + ss);
  return { hh: hh, mm: mm, ss: ss };
};

const determineRatio = (intervalDiff, duration) => {
  let totalHours =
    intervalDiff.hh + " : " + intervalDiff.mm + " : " + intervalDiff.ss;

  var totalHoursArray = totalHours.split(":");

  var numerator =
    parseInt(totalHoursArray[0]) * 3600 +
    parseInt(totalHoursArray[1]) * 60 +
    parseInt(totalHoursArray[2]);

  var res = numerator / duration;
  return res / 3600;
};

const numbertoHours = (value) => {
  var hours = Math.floor(value);
  var minutes = Math.round((value % 1) * 100) / 100;

  return { hours: hours, minutes: minutes };
};
const charIsLetter = (char) => {
  if (typeof char !== "string") {
    return false;
  }
  return char.toLowerCase() !== char.toUpperCase();
};
const changeUrl = (string) => {
  const urlPattern = new RegExp(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  );
  // let string = e.target.value;

  if (urlPattern.test(string)) {
    //string is url

    ///clear http && https from string
    string = string.replace("https://", "").replace("http://", "");

    //add https to string
    string = `https://${string}`;
  }
  // console.log("string--->", string);
};
function capitalizeFirstLetter(string) {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}
function lowerFirstLetter(string) {
  return string?.charAt(0)?.toLowerCase() + string?.slice(1);
}
function deepCopy(array) {
  const dataArray = array ? JSON.stringify(array) : null;
  return JSON.parse(dataArray);
}
function removeCommon(Arr1, Arr2) {
  let result = Arr1.filter((k) => !Arr2.some((p) => p.id == k.id));
  return result;
}
const _request = (url, details, callback, onBlur, desc) => {
  let _results = [];
  let _requests = [];
  details && Keyboard.dismiss();
  const request = new XMLHttpRequest();
  _requests.push(request);
  request.timeout = 5000;
  // request.ontimeout = props.onTimeout;
  request.onreadystatechange = () => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      // console.log("request.status", request.status)
      const responseJSON = JSON.parse(request.responseText);
      // console.log("responseJSON", responseJSON)
      if (details) {
        if (responseJSON.status === "OK") {
          // if (_isMounted === true) {
          const getDetails = responseJSON.result;
          var postal = null;
          var city = null;
          var country = null;
          var province = null;
          // console.log("getDetails.address_components", getDetails.address_components)
          getDetails.address_components.map((item) => {
            if (item.types[0] === "locality") {
              city = item.long_name;
            } else if (item.types[0] === "country") {
              country = item.short_name;
            } else if (item.types[0] === "administrative_area_level_1") {
              province = item.long_name;
            } else if (item.types[0] === "postal_code") {
              postal = item.long_name;
            }
          });
          let address = {
            address: desc,
            city: city,
            state: province,
            zipcode: postal,
            country: country,
          };
          onBlur();
          console.log("address--->", address);
          callback(address);
          // _onBlur();
          // setStateText(_renderDescription(rowData));
        }
      } else {
        if (typeof responseJSON.predictions !== "undefined") {
          const results = responseJSON.predictions;
          // console.log("results-->", results);
          callback(results);
          // return results;
          // _results = results;
        }
        if (typeof responseJSON.error_message !== "undefined") {
          // console.warn(
          //   "google places autocomplete: " + responseJSON.error_message
          // );
          callback(responseJSON.error_message);
        }
      }
    } else {
      return "google places autocomplete: request could not be completed or has been aborted";
    }
  };
  request.open("GET", url);
  request.send();
};
const keyGenerator = () => Math.random().toString(36).substr(2, 10);
const randomHexColor = () => {
  return "#000000".replace(/0/g, () => {
    return (~~(Math.random() * 16)).toString(16);
  });
};

function getDummyArray(limit) {
  return new Array(limit).fill(0).map((_, index) => {
    const repetitions = Math.floor(Math.random() * 3) + 1;

    return {
      key: index.toString(),
      text: "Lorem ipsum dolor amet ".repeat(repetitions),
      author: "Arnaud",
      tag: "eveningkid",
    };
  });
}
// if an array contains objects with same ids take only of them javascript
const filteredArr = (array, obj) => {
  if (array) {
    let result = array.reduce((acc, current) => {
      const x = acc.find((item) => obj(item, current));
      if (!x) {
        // console.log('[...acc, current]', [...acc, current])
        return [...acc, current];
      } else {
        return acc.map((x) => x);
      }
    }, []);
    return result;
  } else {
    return null;
  }
};
// if an array contains objects with same ids, take unique items
const unique_array = (array, key) => {
  let unique = array.filter(
    (v, i, a) => a.findIndex((v2) => v2[key] === v[key]) === i
  );
  // console.log("unique", unique);
  return unique;
};

const changeDateTimeToUTCZero = (dateTime) => {
  const isoDateTime = new Date(dateTime).toISOString();
  const date = isoDateTime.split("T")[0];
  const time = isoDateTime.split("T")[1].split(".")[0];
  return date + " " + time;
};

const changeDateTimeLocalFormat = (date) => {
  console.log(typeof date);
  const UTC_DATE = new Date(date);
  console.log(`${date} UTC`);
  const localeDate = UTC_DATE.toLocaleDateString();
  const localeTime = UTC_DATE.toLocaleTimeString();
  console.log(localeDate);
  console.log(localeTime);
  const format = "yyyy-MM-DD HH:mm:ss";
  return moment(`${localeDate} ${localeTime}`, "MM/DD/YYYY hh:mm:ss A").format(
    format
  );
};

const formatTimeByOffset = (dateString, offset) => {
  // Params:
  // How the backend sends me a timestamp
  // dateString: on the form yyyy-mm-dd hh:mm:ss
  // offset: the amount of hours to add.
  // If we pass anything falsy return empty string
  if (!dateString) return "";
  if (dateString.length === 0) return "";
  // Step a: Parse the backend date string
  // Get Parameters needed to create a new date object
  const year = dateString.slice(0, 4);
  const month = dateString.slice(5, 7);
  const day = dateString.slice(8, 10);
  const hour = dateString.slice(11, 13);
  const minute = dateString.slice(14, 16);
  const second = dateString.slice(17, 19);
  // Step: bMake a JS date object with the data
  const dateObject = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}`
  );
  // Step c: Get the current hours from the object
  const currentHours = dateObject.getHours();
  // Step d: Add the offset to the date object
  dateObject.setHours(currentHours - 5);
  // Step e: stringify the date object, replace the T with a space and slice off the seconds.
  const newDateString = dateObject.toISOString().replace("T", " ").slice(0, 16);
  // Step f: Return the new formatted date string with the added offset
  return `${newDateString}`;
};

const utcToLocalTime = (utcDateStr) => {
  // utcDateStr = '2021-02-02 12:16:13';
  // for 12 hr format
  // const localDate = moment.utc(utcDateStr).local().format('YYYY-MM-DD hh:mm:ss A');
  // for 24 hr format
  const localDate = moment
    .utc(utcDateStr)
    .local()
    .format("YYYY-MM-DD HH:mm:ss");
  return localDate;
};
const scheduleReminder = (id, title, msg, mins) => {
  console.log("scheduleReminder");
  // one hour (1 hour = 60 minutes * 60 seconds * 1000 milliseconds)
  const options = {
    id: id,
    title: title,
    message: msg, // Notification message
    date: new Date(Date.now() + mins * 60 * 1000),
  };
  // Schedule the notification
  PushNotification.getScheduledLocalNotifications((notifications) => {
    if (notifications && notifications?.length > 0) {
      console.log("There are scheduled notifications:", notifications);
      // Do something with the scheduled notifications
    } else {
      console.log("There are no scheduled notifications.");
      // Do something when there are no scheduled notifications
      PushNotification.localNotificationSchedule(options);
    }
  });
};
// Cancel a scheduled notification by specifying the notification ID
const cancelScheduled = (notificationId) => {
  console.log("cancelScheduled");
  PushNotification.getScheduledLocalNotifications((notifications) => {
    if (notifications && notifications?.length > 0) {
      console.log("There are scheduled notifications:", notifications);
      // Do something with the scheduled notifications
      PushNotification.cancelLocalNotification({ id: String(notificationId) });
    } else {
      console.log("There are no scheduled notifications.");
      // Do something when there are no scheduled notifications
      // Helper.cancelScheduledNotification(1);
    }
  });
};

const extarctStringFromHtml = (text) => {
  let plaintext = text?.replace(/<[^>]+>/g, "");
  let words = plaintext?.split(" ");
  let filtered = words?.filter((item) => item !== "");
  // console.log("words", filtered);
  return filtered?.join(" ").trim();
};

export default {
  storeData,
  getData,
  login,
  getUser,
  setUser,
  showToast,
  showToastMessage,
  convert,
  hoursTimeDiff,
  numbertoHours,
  determineRatio,
  charIsLetter,
  changeUrl,
  capitalizeFirstLetter,
  TimeDiffDaysMin,
  deepCopy,
  removeCommon,
  _request,
  keyGenerator,
  randomHexColor,
  setObj,
  getObj,
  getDummyArray,
  removeLocal,
  fbEvent,
  filteredArr,
  debounceCall,
  changeDateTimeToUTCZero,
  changeDateTimeLocalFormat,
  formatTimeByOffset,
  extarctStringFromHtml,
  utcToLocalTime,
  unique_array,
  scheduleReminder,
  cancelScheduled,
  lowerFirstLetter,
};
