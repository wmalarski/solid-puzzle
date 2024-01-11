import { revalidate, useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import { type Component, type ComponentProps, Show } from "solid-js";

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
import { useI18n } from "~/contexts/I18nContext";
import { SESSION_CACHE_NAME } from "~/server/auth/client";
import { signUpServerAction } from "~/server/auth/rpc";
import { paths } from "~/utils/paths";

export const SignUp: Component = () => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const mutation = createMutation(() => ({
    mutationFn: signUpServerAction,
    async onSuccess() {
      await revalidate(SESSION_CACHE_NAME);
      navigate(paths.home);
    },
  }));

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    mutation.mutate(data);
  };

  return (
    <Card class="w-full max-w-md" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("signUp.title")}</h2>
        </header>
        <form class="flex flex-col gap-4" method="post" onSubmit={onSubmit}>
          <Show when={mutation.error}>
            <Alert variant="error">
              <AlertIcon variant="error" />
              {mutation.error?.message}
            </Alert>
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
              placeholder={t("auth.username.placeholder")}
              variant="bordered"
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
              placeholder={t("auth.password.placeholder")}
              type="password"
              variant="bordered"
            />
          </TextFieldRoot>
          <Button
            disabled={mutation.isPending}
            isLoading={mutation.isPending}
            type="submit"
          >
            {t("signUp.button")}
          </Button>
          <div class="flex justify-center">
            <Link class="text-xs" href={paths.signIn}>
              {t("signUp.signIn")}
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
