import { useSearchParams } from "@solidjs/router";
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
import { acceptBoardInviteAction } from "~/server/share/actions";

type AcceptInviteFormProps = {
  board: BoardModel;
};

export const AcceptInviteForm: Component<AcceptInviteFormProps> = (props) => {
  const { t } = useI18n();

  const [searchParams] = useSearchParams();

  const [acceptBoardInvite, { Form }] = acceptBoardInviteAction();

  return (
    <Card variant="bordered" class="w-full max-w-md">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>
            {t("invite.title", { name: props.board.name })}
          </h2>
        </header>
        <Form class="flex flex-col gap-4">
          <input type="hidden" name="token" value={searchParams.token} />
          <Show when={acceptBoardInvite.error}>
            {(error) => (
              <Alert variant="error">
                <AlertIcon variant="error" />
                {error().message}
              </Alert>
            )}
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
            disabled={acceptBoardInvite.pending}
            isLoading={acceptBoardInvite.pending}
            type="submit"
          >
            {t("invite.button")}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};
