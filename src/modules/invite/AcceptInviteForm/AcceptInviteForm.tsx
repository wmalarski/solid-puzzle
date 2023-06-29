import { useI18n } from "@solid-primitives/i18n";
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
import type { BoardModel } from "~/db/types";
import { createSignInServerAction } from "~/server/auth";

type AcceptInviteFormProps = {
  board: BoardModel;
};

export const AcceptInviteForm: Component<AcceptInviteFormProps> = (props) => {
  const [t] = useI18n();

  const [signOut, { Form }] = createSignInServerAction();

  return (
    <Card variant="bordered" class="w-full max-w-md">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>
            {t("invite.title", { name: props.board.name })}
          </h2>
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
                {t("invite.username.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="username"
              name="username"
              variant="bordered"
              placeholder={t("invite.username.placeholder")}
            />
          </TextFieldRoot>
          <Button
            disabled={signOut.pending}
            isLoading={signOut.pending}
            type="submit"
          >
            {t("invite.button")}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};
