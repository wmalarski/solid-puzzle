import type { RouteDefinition } from "@solidjs/router";
import { SignUp } from "~/modules/auth/SignUp";
import { getServerAnonGuard } from "~/server/auth/actions";

export const route = {
  load: async () => {
    await getServerAnonGuard();
  },
} satisfies RouteDefinition;

export default function SignUpPage() {
  return <SignUp />;
}
