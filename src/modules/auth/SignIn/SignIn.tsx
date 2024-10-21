import { useSubmission } from "@solidjs/router";
import { Component, Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import { Link } from "~/components/Link";
import {
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";
import { ThemeToggle } from "~/modules/common/ThemeToggle";
import { signInAction } from "~/server/auth/client";
import { paths } from "~/utils/paths";

export const SignIn: Component = () => {
  const { t } = useI18n();

  const submission = useSubmission(signInAction);

  return (
    <Card bg="base-200" class="w-full max-w-md" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("auth.signIn.title")}</h2>
          <ThemeToggle />
        </header>
        <form action={signInAction} class="flex flex-col gap-4" method="post">
          <Show when={submission.result?.error}>
            <Alert variant="error">
              <AlertIcon variant="error" />
              {submission.result?.error}
            </Alert>
          </Show>
          <TextFieldRoot>
            <TextFieldLabel for="email">
              <TextFieldLabelText>{t("auth.email.label")}</TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              disabled={submission.pending}
              id="email"
              inputMode="email"
              name="email"
              placeholder={t("auth.email.placeholder")}
              type="email"
              variant="bordered"
            />
            <Show when={submission.result?.errors?.email}>
              <TextFieldErrorMessage>
                {submission.result?.errors?.email}
              </TextFieldErrorMessage>
            </Show>
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="password">
              <TextFieldLabelText>
                {t("auth.password.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              disabled={submission.pending}
              id="password"
              name="password"
              placeholder={t("auth.password.placeholder")}
              type="password"
              variant="bordered"
            />
            <Show when={submission.result?.errors?.password}>
              <TextFieldErrorMessage>
                {submission.result?.errors?.password}
              </TextFieldErrorMessage>
            </Show>
          </TextFieldRoot>
          <Button
            disabled={submission.pending}
            isLoading={submission.pending}
            type="submit"
          >
            {t("auth.signIn.button")}
          </Button>
          <div class="flex justify-center">
            <Link class="text-xs" href={paths.signUp}>
              {t("auth.signIn.signUp")}
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
