import { SignUp } from "~/modules/auth/SignUp";
import { getServerAnonGuard } from "~/server/auth/actions";

export const route = {
  load: () => {
    getServerAnonGuard();
  },
};

export default function SignUpPage() {
  return <SignUp />;
}
