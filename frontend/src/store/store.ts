import { atom } from "nanostores";

export const $isLoggedIn = atom(false);

export function setIsLoggedIn(value: boolean) {
  $isLoggedIn.set(value);
}