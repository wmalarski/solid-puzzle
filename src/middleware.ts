import { createMiddleware } from "@solidjs/start/server";

import { drizzleMiddleware } from "./server/db";
import { serverEnvMiddleware } from "./server/env";
import { supabaseMiddleware } from "./server/supabase";

export default createMiddleware({
  onRequest: [serverEnvMiddleware, drizzleMiddleware, supabaseMiddleware],
});
