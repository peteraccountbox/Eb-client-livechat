import axios, { AxiosResponse } from "axios";
import { TENANT_ID, SERVER_REQ_HOST_PATH } from "./globals";

axios.defaults.headers.common["Authorization"] = TENANT_ID;

axios.interceptors.request.use(
  function (config) {

    // Add a parameter to the request
    try {
      config.params = {
        ...config.params,
        tenantId: (window.parent as any).EhAccount.getTenantId()
      };
    } catch (error) {
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);


const getServerHost = (path: string) => {

  try {
    if (path && path.indexOf("/hc/") > -1 && !(window.parent as any).EhAccount.version) {
      //if (path && path.indexOf("/hc/") > -1) {
      return "https://engagebay-helpcenter-worker.peter-13d.workers.dev/" + path;
    }
  } catch (error) {
  }

  return SERVER_REQ_HOST_PATH + path;
}

export const getReq = async (
  path: string,
  data: object
): Promise<AxiosResponse> => {

  return await axios.get<AxiosResponse>(
    getServerHost(path) + "?apiKey=" + TENANT_ID,
    { params: data }
  );

};

export const postReq = async (path: string, data: object) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: TENANT_ID,
  };
  return await axios
    .post(getServerHost(path), data, {
      headers: headers,
    })
    .then(function (response) {
      return response;
    })
    .catch(function (err) {
      console.log(err);
    });
};

export default fetch;
