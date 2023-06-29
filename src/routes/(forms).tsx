import { Outlet } from "solid-start";
import { FormLayout, PageFooter, PageTitle } from "~/modules/common/Layout";

export default function FormsLayout() {
  return (
    <FormLayout>
      <PageTitle />
      <Outlet />
      <PageFooter />
    </FormLayout>
  );
}
