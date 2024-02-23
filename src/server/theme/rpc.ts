"use server";

import type { Output } from "valibot";

import { literal, union } from "valibot";
import { getCookie } from "vinxi/http";

import { getRequestEventOrThrow } from "../utils";
import { APP_THEME_COOKIE_NAME } from "./const";

const appThemeSchema = () => {
  return union([literal("dracula"), literal("fantasy")]);
};

export type AppTheme = Output<ReturnType<typeof appThemeSchema>>;

export const getAppThemeCookie = () => {
  const event = getRequestEventOrThrow();
  return getCookie(event, APP_THEME_COOKIE_NAME) as AppTheme;
};

export const getAppThemeServerLoader = () => {
  return Promise.resolve(getAppThemeCookie() || "dracula");
};
