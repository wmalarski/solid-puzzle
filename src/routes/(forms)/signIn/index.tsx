import { SignIn } from "~/modules/auth/SignIn";
import { getServerAnonGuard } from "~/server/auth/actions";

export const route = {
  load: () => {
    getServerAnonGuard();
  },
};

export default function SignInPage() {
  return <SignIn />;
}
