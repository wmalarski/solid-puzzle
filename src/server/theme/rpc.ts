"use server";

import type { Output } from "valibot";

import { literal, safeParseAsync, union } from "valibot";
import { getCookie, setCookie } from "vinxi/http";

import {
  type CookieSerializeOptions,
  getRequestEventOrThrow,
  rpcParseIssueResult,
  rpcSuccessResult
} from "../utils";

const appThemeSchema = () => {
  return union([literal("dracula"), literal("fantasy")]);
};

export type AppTheme = Output<ReturnType<typeof appThemeSchema>>;

const APP_THEME_COOKIE_NAME = "AppTheme";

const APP_THEME_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: 1000000,
  sameSite: "lax"
};

export const setAppThemeServerAction = async (theme: AppTheme) => {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(appThemeSchema(), theme);

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  setCookie(
    event,
    APP_THEME_COOKIE_NAME,
    parsed.output,
    APP_THEME_COOKIE_OPTIONS
  );

  return rpcSuccessResult();
};

export const getAppThemeCookie = () => {
  const event = getRequestEventOrThrow();
  return getCookie(event, APP_THEME_COOKIE_NAME) as AppTheme;
};

export const getAppThemeServerLoader = () => {
  return Promise.resolve(getAppThemeCookie());
};
