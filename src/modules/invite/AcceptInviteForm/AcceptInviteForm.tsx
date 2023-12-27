import { useSearchParams, useSubmission } from "@solidjs/router";
import { Show, type Component } from "solid-js";
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
import { acceptBoardInviteAction } from "~/server/share/client";

type AcceptInviteFormProps = {
  board: BoardModel;
};

export const AcceptInviteForm: Component<AcceptInviteFormProps> = (props) => {
  const { t } = useI18n();

  const [searchParams] = useSearchParams();

  const submission = useSubmission(acceptBoardInviteAction);

  return (
    <Card variant="bordered" class="w-full max-w-md">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>
            {t("invite.title", { name: props.board.name })}
          </h2>
        </header>
        <form
          action={acceptBoardInviteAction}
          class="flex flex-col gap-4"
          method="post"
        >
          <input type="hidden" name="token" value={searchParams.token} />
          <Show when={submission.result && !submission.result.ok}>
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
            disabled={submission.pending}
            isLoading={submission.pending}
            type="submit"
          >
            {t("invite.button")}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
