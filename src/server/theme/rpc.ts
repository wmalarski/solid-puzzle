"use server";

import * as v from "valibot";
import { getCookie } from "vinxi/http";

import { getRequestEventOrThrow } from "../utils";
import { APP_THEME_COOKIE_NAME } from "./const";

const appThemeSchema = () => {
  return v.union([v.literal("dracula"), v.literal("fantasy")]);
};

export type AppTheme = v.InferOutput<ReturnType<typeof appThemeSchema>>;

export const getAppThemeCookie = () => {
  const event = getRequestEventOrThrow();
  return getCookie(event.nativeEvent, APP_THEME_COOKIE_NAME) as AppTheme;
};

export const getAppThemeServerLoader = () => {
  return Promise.resolve(
    v.parse(appThemeSchema(), getAppThemeCookie() || "dracula")
  );
};
