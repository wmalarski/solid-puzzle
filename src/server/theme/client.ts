import { cache } from "@solidjs/router";

import { APP_THEME_CACHE_KEY } from "./const";
import { getAppThemeServerLoader } from "./rpc";

export const getAppThemeLoader = cache(
  getAppThemeServerLoader,
  APP_THEME_CACHE_KEY
);
