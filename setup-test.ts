import dotenv from "dotenv";

dotenv.config({ path: ".env" });

Object.assign(global, require("jest-chrome"));

interface Store {
  [key: string]: string;
}
const localStorageMock = (function() {
  let store:Store = {};
  return {
    getItem: function(key: string) {
      return store[key];
    },
    setItem: function(key:string, value:string) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key:string) {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });