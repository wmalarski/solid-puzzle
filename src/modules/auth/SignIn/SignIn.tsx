import { useI18n } from "@solid-primitives/i18n";
import { Show, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import {
  TextFieldDescription,
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "~/components/TextField";
import { createSignInServerAction } from "~/server/auth";

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
                {t("signIn.username.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="username"
              name="username"
              variant="bordered"
              placeholder={t("signIn.username.placeholder")}
            />
            <TextFieldDescription>
              {t("signIn.username.description")}
            </TextFieldDescription>
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="password">
              <TextFieldLabelText>
                {t("signIn.password.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="password"
              name="password"
              type="password"
              variant="bordered"
              placeholder={t("signIn.password.placeholder")}
            />
            <TextFieldDescription>
              {t("signIn.password.description")}
            </TextFieldDescription>
          </TextFieldRoot>
          <Button
            disabled={signOut.pending}
            isLoading={signOut.pending}
            type="submit"
          >
            {t("signIn.button")}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};
