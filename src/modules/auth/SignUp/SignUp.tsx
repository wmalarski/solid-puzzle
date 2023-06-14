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
import { createSignUpServerAction } from "~/server/auth";

export const SignUp: Component = () => {
  const [t] = useI18n();

  const [signOut, { Form }] = createSignUpServerAction();

  return (
    <Card variant="bordered" class="w-full max-w-md">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("signUp.title")}</h2>
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
                {t("signUp.username.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="username"
              name="username"
              variant="bordered"
              placeholder={t("signUp.username.placeholder")}
            />
            <TextFieldDescription>
              {t("signUp.username.description")}
            </TextFieldDescription>
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="password">
              <TextFieldLabelText>
                {t("signUp.password.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="password"
              name="password"
              type="password"
              variant="bordered"
              placeholder={t("signUp.password.placeholder")}
            />
            <TextFieldDescription>
              {t("signUp.password.description")}
            </TextFieldDescription>
          </TextFieldRoot>
          <Button
            disabled={signOut.pending}
            isLoading={signOut.pending}
            type="submit"
          >
            {t("signUp.button")}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};
