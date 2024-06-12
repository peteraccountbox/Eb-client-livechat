export const setLocalStoragePrefs: Function = (key: any, value: any) => {
  if (key === undefined || value === undefined) return null;

  localStorage.setItem("engagebay-" + key, value);
};

export const getLocalStoragePrefs: Function = (key: any) => {
  if (!key) return null;

  return localStorage.getItem("engagebay-" + key);
};

export const setSessionStoragePrefs: Function = (key: any, value: any) => {
  if (key === undefined || value === undefined) return null;

  sessionStorage.setItem("engagebay-" + key, value);
};

export const removeSessionStoragePrefs: Function = (key: any) => {
  try {
    sessionStorage.removeItem("engagebay-" + key);
  } catch (error) {}
};

export const getSessionStoragePrefs: Function = (key: any) => {
  if (!key) return null;

  return sessionStorage.getItem("engagebay-" + key);
};

// export const deleteStoragePrefs: Function = (key: any) => {
//     localStorage.removeItem('engagebay-' + key);
// }

export const getCookie: Function = (key: string) => {
  if (!key) return undefined;

  key = "engagebay-" + key;

  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(key) === 0) return c.substring(key.length, c.length);
  }

  return undefined;
};

export const setCookie: Function = (
  key: string,
  value: string,
  timeInDays: number
) => {
  if (!key || !value) return undefined;

  let expires = "";
  if (timeInDays) {
    let date = new Date();
    date.setTime(date.getTime() + timeInDays * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = "engagebay-" + key + "=" + value + expires + "; path=/";
};

export const deleteCookie: Function = (key: string) => {
  if (!key) return;

  setCookie(key, "", -1);
};
