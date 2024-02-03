import { createMiddleware } from "@solidjs/start/middleware";

import { serverEnvMiddleware } from "./server/env";
import { supabaseMiddleware } from "./server/supabase";

export default createMiddleware({
  onRequest: [serverEnvMiddleware, supabaseMiddleware]
});
