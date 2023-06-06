// development url:
const baseUrl = "https://devapi.stampbox.com/";
export const appUrl = "https://development.stampbox.com/";

// live url:
// const baseUrl = "https://api.stampbox.com/";
// export const appUrl = "https://app.stampbox.com/";

export default {
  server_url: baseUrl,
  server_api: baseUrl + "api/",
  createUrl: (value) => baseUrl + "api/" + value,
  paramUrl: (value, param) => baseUrl + "api/" + value + "/" + param,
  notifyparamUrl: (value1, value2, param, query) =>
    baseUrl + "api/" + value1 + "/" + value2 + "/" + param + "/" + query,
  paramQueryUrl: (value, param, query) =>
    baseUrl + "api/" + value + "/" + param + "/" + query,
  resourceUrl: (value) => baseUrl + value,
  mediaResource: (value) => baseUrl + "storage/" + value,
};
//-- --reset-cache
// https://app.thepopupapp.com/api/notification/quantum/:messageID/setup
