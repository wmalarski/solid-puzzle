import { useRouteData } from "solid-start";
import { SignIn } from "~/modules/auth/SignIn";
import { FormLayout, PageFooter, PageTitle } from "~/modules/common/Layout";
import { createAnonGuardServerData } from "~/server/auth";

export const routeData = () => {
  return createAnonGuardServerData();
};

export default function SignInPage() {
  useRouteData<typeof routeData>();

  return (
    <FormLayout>
      <PageTitle />
      <SignIn />
      <PageFooter />
    </FormLayout>
  );
}
