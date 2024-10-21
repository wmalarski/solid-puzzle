import { useSubmission } from "@solidjs/router";
import { Component, Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { useUserContext } from "~/contexts/UserContext";
import { insertBoardAction } from "~/server/board/client";

import { type BoardConfigFields, ConfigFields } from "../ConfigFields";

type CreateBoardFormProps = {
  initialValues?: BoardConfigFields | null;
};

export const CreateBoardForm: Component<CreateBoardFormProps> = (props) => {
  const { t } = useI18n();

  const user = useUserContext();

  const submission = useSubmission(insertBoardAction);

  return (
    <form action={insertBoardAction} class="flex flex-col gap-4" method="post">
      <Show when={submission.result?.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {submission.result?.error}
        </Alert>
      </Show>
      <ConfigFields
        disabled={submission.pending}
        errors={submission.result?.errors}
        initialValues={props.initialValues}
        scrollableImageGrid
        showName
      />
      <Button
        color="secondary"
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        <Show fallback={t("createBoard.link")} when={user()}>
          {t("createBoard.button")}
        </Show>
      </Button>
    </form>
  );
};
