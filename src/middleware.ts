import { createMiddleware } from "@solidjs/start/server";

import { serverEnvMiddleware } from "./server/env";
import { supabaseMiddleware } from "./server/supabase";

export default createMiddleware({
  onRequest: [serverEnvMiddleware, supabaseMiddleware],
});
