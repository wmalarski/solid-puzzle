import { useI18n } from "@solid-primitives/i18n";
import { Show, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import { Link } from "~/components/Link";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "~/components/TextField";
import { createSignInServerAction } from "~/server/auth/actions";
import { paths } from "~/utils/paths";

export const SignIn: Component = () => {
  const [t] = useI18n();

  const [signOut, { Form }] = createSignInServerAction();

  return (
    <Card variant="bordered" class="w-full max-w-md">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("signIn.title")}</h2>
        </header>
        <Form class="flex flex-col gap-4">
          <Show when={signOut.error}>
            {(error) => (
              <Alert variant="error">
                <AlertIcon variant="error" />
                {error().message}
              </Alert>
            )}
          </Show>
          <TextFieldRoot>
            <TextFieldLabel for="username">
              <TextFieldLabelText>
                {t("auth.username.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="username"
              name="username"
              variant="bordered"
              placeholder={t("auth.username.placeholder")}
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="password">
              <TextFieldLabelText>
                {t("auth.password.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="password"
              name="password"
              type="password"
              variant="bordered"
              placeholder={t("auth.password.placeholder")}
            />
          </TextFieldRoot>
          <Button
            disabled={signOut.pending}
            isLoading={signOut.pending}
            type="submit"
          >
            {t("signIn.button")}
          </Button>
          <div class="flex justify-center">
            <Link class="text-xs" href={paths.signUp}>
              {t("signIn.signUp")}
            </Link>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};
