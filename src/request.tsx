import axios, { AxiosResponse } from "axios";
import { TENANT_ID, SERVER_REQ_HOST_PATH, API_KEY } from "./globals";

export const baseReqService = axios;

export const engageBayAPI = baseReqService.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: API_KEY,
  },
});

export const engageBayTicketingAPI = baseReqService.create({
  headers: {
    "Content-Type": "application/json",
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

engageBayTicketingAPI.interceptors.request.use(
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
      (window.parent as any).EhAccount?.version
    )
      return (window.parent as any)?.EhAccount.getAppURL() + "/" + path;
    else if (
      path &&
      (path.indexOf("/hc/") > -1 || path.indexOf("/help-center/") > -1)
    )
      return "http://localhost:8888/" + path;
  } catch (error) {}

  return SERVER_REQ_HOST_PATH + path;
};

export const getReq = async (
  path: string,
  data: object
): Promise<AxiosResponse> => {
  if (path && (path.indexOf("/hc/") > -1 || path.indexOf("/help-center/") > -1))
    return engageBayAPI.get<AxiosResponse>(
      getServerHost(path) + "?apiKey=" + API_KEY,
      { params: data }
    );
  return engageBayTicketingAPI.get<AxiosResponse>(getServerHost(path), {
    params: data,
  });
};

export const postReq = async (path: string, data: object, headers?: object) => {
  if (path && (path.indexOf("/hc/") > -1 || path.indexOf("/help-center/") > -1))
    return engageBayAPI.post(
      getServerHost(path),
      data,
      headers
        ? headers
        : {
            "Content-Type": "application/json",
            Authorization: API_KEY,
          }
    );
  return engageBayTicketingAPI.post(
    getServerHost(path),
    data,
    headers
      ? headers
      : {
          "Content-Type": "application/json",
          "X-JS-Client-Key": TENANT_ID,
        }
  );
};

export default fetch;
