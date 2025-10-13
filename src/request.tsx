import axios, { AxiosResponse } from "axios";
import { TENANT_ID, SERVER_REQ_HOST_PATH, API_KEY } from "./globals";

// axios.defaults.headers.common["X-API-Key"] = TENANT_ID;

export const baseReqService = axios;

export const engageBayAPI = baseReqService.create({
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': TENANT_ID,
    "X-JS-Client-Key": TENANT_ID,
  },
});

engageBayAPI.interceptors.request.use(
  (config) => {
    // Log the request configuration for debugging
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getServerHost = (path: string) => {
  // if (path.indexOf("api/ecommerce/") > -1)
  //   return "http://localhost:8084/" + path;

  try {
    if (
      path &&
      (path.indexOf("/hc/") > -1 || path.indexOf("/help-center/") > -1) &&
      (window.parent as any).EhAccount.version
    ) {
      //if (path && path.indexOf("/hc/") > -1) {
      // return "https://engagebay-helpcenter-worker.peter-13d.workers.dev/" + path;
      return (
        "https://app-dot-ebreachoservice-dot-accountbox-154605.appspot.com/" +
        path +
        "?apiKey=" +
        (window.parent as any).EhAccount.getKey()
      );
    }
  } catch (error) {}

  return SERVER_REQ_HOST_PATH + path;
};

export const getReq = async (
  path: string,
  data: object
): Promise<AxiosResponse> => {
  return engageBayAPI.get<AxiosResponse>(getServerHost(path), { params: data });
};

export const getReqHc = async (
  path: string,
  data: object
): Promise<AxiosResponse> => {
  return await axios.get<AxiosResponse>(
    getServerHost(path) + "?apiKey=" + "220u1dk3mosp537c2jbcpdc2a2",
    { params: data }
  );
};

export const postReq = async (path: string, data: object, headers?: object) => {
  headers = headers
    ? headers
    : {
        "Content-Type": "application/json",
        // Authorization: API_KEY,
        "X-JS-Client-Key": TENANT_ID,
      };
  return engageBayAPI.post(getServerHost(path), data, {
    headers: headers,
  });
};

export default fetch;
