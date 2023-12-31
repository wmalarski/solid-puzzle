import { useSearchParams } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import { Show, type Component, type JSX } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";
import type { BoardModel } from "~/server/board/types";
import { acceptBoardInviteServerAction } from "~/server/share/rpc";

type AcceptInviteFormProps = {
  board: BoardModel;
};

export const AcceptInviteForm: Component<AcceptInviteFormProps> = (props) => {
  const { t } = useI18n();

  const [searchParams] = useSearchParams();

  const mutation = createMutation(() => ({
    mutationFn: acceptBoardInviteServerAction,
  }));

  const onSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    mutation.mutate(data);
  };

  return (
    <Card variant="bordered" class="w-full max-w-md">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>
            {t("invite.title", { name: props.board.name })}
          </h2>
        </header>
        <form onSubmit={onSubmit} class="flex flex-col gap-4" method="post">
          <input type="hidden" name="token" value={searchParams.token} />
          <Show when={mutation.data && !mutation.data.ok}>
            <Alert variant="error">
              <AlertIcon variant="error" />
              Error
            </Alert>
          </Show>
          <TextFieldRoot>
            <TextFieldLabel for="name">
              <TextFieldLabelText>
                {t("invite.username.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="name"
              name="name"
              variant="bordered"
              placeholder={t("invite.username.placeholder")}
            />
          </TextFieldRoot>
          <Button
            disabled={mutation.isPending}
            isLoading={mutation.isPending}
            type="submit"
          >
            {t("invite.button")}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
