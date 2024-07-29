import { OPEN_IN_WEB, STORAGE } from "../theme/constants";
import { RootState as BackgroundRootState } from "background-related";
import Emittery from "emittery";
import _ from "lodash";

/**
 * This function will store the key and values in local storage in development mode.
 * If it is in extension mode then the data will be stored in chrome storage.
 *
 */
export const setStorageSyncValue = async (keyName: string, value: any) => {
  try {
    if (OPEN_IN_WEB) {
      return await new Promise<void>((resolve) => {
        localStorage.setItem(keyName, JSON.stringify(value));
        resolve();
      });
    }

    return await new Promise<void>((resolve) => {
      STORAGE?.set({ [keyName]: JSON.stringify(value) }, function () {
        resolve();
      });
    });
  } catch (error) {
    console.log("error setting the sync storage ", error);
  }
};

/**
 * From the given keyName.
 * This function will retrieve the values from local storage in development mode.
 * If it is in extension mode then the data will be retrieve from chrome storage.
 *
 */
export const getStorageSyncValue = async (keyName: string) => {
  try {
    if (OPEN_IN_WEB) {
      return await new Promise((resolve) => {
        const item = localStorage.getItem(keyName);
        if (item) resolve(JSON.parse(item));
        else resolve({});
      });
    }
    return await new Promise((resolve) => {
      STORAGE?.get([keyName], function (extractedValue) {
        if (extractedValue[keyName])
          resolve(JSON.parse(extractedValue[keyName]));
        else resolve({});
      });
    });
  } catch (error) {
    console.log("error getting the sync storage ", error);
  }
};

export const getStateFromStorage = async () => {
  let reduxState = {} as BackgroundRootState;
  await new Promise((resolve) => {
    chrome.storage.local.get("state", (state) => {
      reduxState = JSON.parse(state.state);
      resolve("");
    });
  });
  return reduxState;
};

export const dispatchWithEmitter = async (
  emitter: Emittery<any>,
  eventName: string,
  payload: unknown
) => {
  return new Promise((resolve, reject) => {
    emitter.emit(eventName, {
      payload: payload,
      resolver: resolve,
      rejecter: reject,
    });
  });
};

/**
 * fetch the session storage value based on the session storage
 * of v3 extension or web
 * @param key the key's value to be fetched in the session storage
 * @returns fetched value or null
 */
export const getSessionStorageValue = async (key: string) => {
  const isProduction = process.env.NODE_ENV === "production";
  const isWebProduction = process.env.web === "true";

  // if condition means it's an extension build otherwise
  // it's either development or web production
  if (isProduction && !isWebProduction) {
    const value = await chrome.storage.session.get(key);
    return !_.isEmpty(value) ? value : null;
  } else {
    const value = await window.sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
};

/**
 * save to the session storage based on the session storage
 * of v3 extension or web
 * @param key type string
 * @param value type string
 */
export const setSessionStorageValue = async (key: string, value: string) => {
  const isProduction = process.env.NODE_ENV === "production";
  const isWebProduction = process.env.web === "true";

  // IF condition means it's an extension build otherwise
  // it's either development or web production
  if (isProduction && !isWebProduction) {
    await chrome.storage.session.set({ [key]: value });
  } else {
    await window.sessionStorage.setItem(key, JSON.stringify(value));
  }
};
