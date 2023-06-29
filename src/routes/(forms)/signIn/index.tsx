import { useRouteData } from "solid-start";
import { SignIn } from "~/modules/auth/SignIn";
import { createAnonGuardServerData } from "~/server/auth";

export const routeData = () => {
  return createAnonGuardServerData();
};

export default function SignInPage() {
  useRouteData<typeof routeData>();

  return <SignIn />;
}
