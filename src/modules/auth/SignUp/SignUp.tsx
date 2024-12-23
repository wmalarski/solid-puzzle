import { useSubmission } from "@solidjs/router";
import { Component, Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert/Alert";
import { Button } from "~/components/Button/Button";
import { Card, CardBody } from "~/components/Card/Card";
import { cardTitleRecipe } from "~/components/Card/Card.recipe";
import { Link } from "~/components/Link/Link";
import {
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot
} from "~/components/TextField/TextField";
import { useI18n } from "~/contexts/I18nContext";
import { ThemeToggle } from "~/modules/common/ThemeToggle/ThemeToggle";
import { signUpAction } from "~/server/auth/client";
import { paths } from "~/utils/paths";

export const SignUp: Component = () => {
  const { t } = useI18n();

  const submission = useSubmission(signUpAction);

  return (
    <Card bg="base-200" class="w-full max-w-md" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleRecipe()}>{t("auth.signUp.title")}</h2>
          <ThemeToggle />
        </header>
        <form action={signUpAction} class="flex flex-col gap-4" method="post">
          <Show when={submission.result?.success}>
            <Alert variant="success">
              <AlertIcon variant="success" />
              {t("auth.signUp.success")}
            </Alert>
          </Show>
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
            {t("auth.signUp.button")}
          </Button>
          <div class="flex justify-center">
            <Link class="text-xs" href={paths.signIn}>
              {t("auth.signUp.signIn")}
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
