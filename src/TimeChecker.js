import moment from "moment";

export default function timeHelper() {
  function timeStampFormat(timeStamp) {
    if (moment().diff(timeStamp, "days") >= 0) {
      return moment(timeStamp).fromNow();
    } else {
      return moment(timeStamp).format("DD MMMM YYYY, h:mm a");
    }
  }

  function changeDateTimeToLocalFormats(date) {
    const format = "yyyy-MM-DDTHH:mm";
    return moment(date).format(format);
  }

  function dateTimeFormat(timeStamp) {
    return dateFormat(timeStamp) + " " + timeFormat(timeStamp);
  }

  function formatDate(date, formatString) {
    try {
      if (!isInvalid(date)) {
        if (date?.includes("T")) {
          let d = date.split("T")[0];
          let t = null;
          if (date.split("T")[1].includes("Z")) {
            t = date.split("T")[1].split(".")[0];
          }
          date = `${d} ${t}`;
        }

        formatString = formatString ?? "MMM, DD YYYY [-] h:mm A";
        const UTC_DATE = date + " UTC";

        const localeDate = new Date(UTC_DATE);

        return moment(localeDate).format(formatString);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function dateFormat(timeStamp) {
    if (!isInvalid(timeStamp)) {
      return moment(timeStamp).format("DD-MM-YYYY");
    } else {
      return "N/A";
    }
  }

  function shortTitle(value) {
    if (!value) {
      return "N/A";
    } else if (value.length < 25) {
      return value;
    } else {
      return value.substr(0, 22) + "...";
    }
    // just an example
  }
  function shortDesc(value) {
    if (!value) {
      return "N/A";
    } else if (value.length < 50) {
      return value;
    } else {
      return value.substr(0, 60) + "...";
    }
    // just an example
  }

  function dateWithMonthString(timeStamp) {
    return moment(timeStamp).format("DD-MMM-YYYY");
  }

  function timeFormat(timeStamp, formatString) {
    formatString = formatString ?? "hh:mm a";

    if (!isInvalid(timeStamp)) {
      return moment(timeStamp).format(formatString);
    } else {
      return "N/A";
    }
  }

  function dateServerFormat(timeStamp) {
    return moment(timeStamp).format("YYYY-MM-DD");
  }

  function timeServerFormat(timeStamp) {
    return moment(timeStamp).format("HH:mm:ss");
  }

  //return the years difference between two dates
  function dateDiffInYears(a, b) {
    //a,b must be a Date instance
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const _MS_PER_Year = _MS_PER_DAY * 365;

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_Year);
  }

  /** Implementation
   * We can get counter value only by call back function
   *
   * dateCountdown(new Date(self.auction.expiry_time), function (x) {
   *    self.count_down = x;
   *  });
   **/
  function dateCountdown(expiry, callback) {
    let timer;

    let compareDate = new Date(expiry);

    timer = setInterval(function () {
      let currentCounter = timeBetweenDates(compareDate);
      callback(currentCounter, timer);
    }, 1000);

    function timeBetweenDates(toDate) {
      let dateEntered = toDate;
      let now = new Date();

      let difference = dateEntered.getTime() - now.getTime();

      if (difference <= 0) {
        // Timer done
        clearInterval(timer);

        return {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        };
      } else {
        let seconds = Math.floor(difference / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        hours %= 24;
        minutes %= 60;
        seconds %= 60;

        // let aa = days + ':' + hours + ':' + minutes + ':' + seconds;

        return {
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        };
      }
    }
  }

  function isInvalid(target) {
    if (target == null || target === "" || typeof target === "undefined") {
      return true;
    } else {
      return false;
    }
  }

  return {
    timeStampFormat,
    timeServerFormat,
    dateFormat,
    shortTitle,
    dateServerFormat,
    timeFormat,
    dateDiffInYears,
    dateCountdown,
    dateTimeFormat,
    dateWithMonthString,
    formatDate,
    changeDateTimeToLocalFormats,
    shortDesc,
  };
}
