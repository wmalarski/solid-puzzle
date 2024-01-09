import { revalidate, useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import { Show, type Component, type ComponentProps } from "solid-js";
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
import { signInServerAction } from "~/server/auth/rpc";
import { paths } from "~/utils/paths";

export const SignIn: Component = () => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const mutation = createMutation(() => ({
    mutationFn: signInServerAction,
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
    <Card variant="bordered" class="w-full max-w-md">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("signIn.title")}</h2>
        </header>
        <form onSubmit={onSubmit} class="flex flex-col gap-4" method="post">
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
            disabled={mutation.isPending}
            isLoading={mutation.isPending}
            type="submit"
          >
            {t("signIn.button")}
          </Button>
          <div class="flex justify-center">
            <Link class="text-xs" href={paths.signUp}>
              {t("signIn.signUp")}
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
