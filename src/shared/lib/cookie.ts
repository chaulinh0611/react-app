import Cookies from "js-cookie";


export const cookie = Cookies;


export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key);
};

export const setCookie = (key: string, value: string, days = 1) => {
  Cookies.set(key, value, { expires: days });
};

export const deleteCookie = (key: string) => {
  Cookies.remove(key);
};