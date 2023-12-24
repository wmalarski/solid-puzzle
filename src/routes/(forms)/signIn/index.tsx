import type { RouteDefinition } from "@solidjs/router";
import { SignIn } from "~/modules/auth/SignIn";
import { getServerAnonGuard } from "~/server/auth/actions";

export const route = {
  load: async () => {
    await getServerAnonGuard();
  },
} satisfies RouteDefinition;

export default function SignInPage() {
  return <SignIn />;
}
