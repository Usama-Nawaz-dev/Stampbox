import axios from "axios";
import Helpers from "../src/Helper";
// const httpClient = axios.create();
// httpClient.defaults.timeout = 5000;

// import Helpers from '../Screens/Helper';

let config = async () => {
  let token = await Helpers.getData("supportToken");
  // console.log("token", token);
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
};
let formdataConfig = async () => {
  let token = await Helpers.getData("supportToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  };
};

export default {
  config,
  formdataConfig,
  get: async (url) => {
    console.log("url", url);
    try {
      return await axios.get(url, await config());
    } catch (e) {
      return { e };
    }
  },
  delete: async (url) => {
    console.log("url", url);
    try {
      return await axios.delete(url, await config());
    } catch (e) {
      return { e };
    }
  },
  post: async (url, data) => {
    console.log("url", url);
    try {
      let res = await axios.post(url, data, await config());
      return res;
    } catch (e) {
      // console.log("error-->", {e})
      return { e };
    }
  },
  postFormData: async (url, data) => {
    // console.log('url', data)
    try {
      let res = await axios.post(url, data, await formdataConfig());
      return res;
    } catch (e) {
      return { e };
    }
  },
};
