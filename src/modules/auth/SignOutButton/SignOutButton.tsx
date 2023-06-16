import { useI18n } from "@solid-primitives/i18n";
import type { Component } from "solid-js";
import { Button } from "~/components/Button";
import { createSignOutServerAction } from "~/server/auth";

export const SignOutButton: Component = () => {
  const [t] = useI18n();

  const [signOut, { Form }] = createSignOutServerAction();

  return (
    <Form>
      <Button disabled={signOut.pending}>{t("auth.signOut")}</Button>
    </Form>
  );
};
