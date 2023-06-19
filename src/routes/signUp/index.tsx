import { useRouteData } from "solid-start";
import { SignUp } from "~/modules/auth/SignUp";
import { FormLayout, PageFooter, PageTitle } from "~/modules/common/Layout";
import { createAnonGuardServerData } from "~/server/auth";

export const routeData = () => {
  return createAnonGuardServerData();
};

export default function SignUpPage() {
  useRouteData<typeof routeData>();

  return (
    <FormLayout>
      <PageTitle />
      <SignUp />
      <PageFooter />
    </FormLayout>
  );
}
