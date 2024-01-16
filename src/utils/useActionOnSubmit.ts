import { Action, useAction, useSubmission } from "@solidjs/router";
import { useQueryClient } from "@tanstack/solid-query";
import { type Component, type ComponentProps, Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { useSessionContext } from "~/contexts/SessionContext";
import {
  insertBoardAction,
  invalidateSelectBoardsQueries
} from "~/server/board/client";

import { type BoardConfigFields, ConfigFields } from "../ConfigFields";

type UseActionOnSubmitArgs = {
  action: Action;
  onError?: () => void;
  onSuccess?: () => void;
};

export const useActionOnSubmit = ({
  action,
  onError,
  onSuccess
}: UseActionOnSubmitArgs) => {
  const queryClient = useQueryClient();

  const submit = useAction(insertBoardAction);

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    try {
      await submit(data);
      onSuccess?.();
      await queryClient.invalidateQueries(invalidateSelectBoardsQueries());
    } catch {
      onError?.();
    }
  };

  return onSubmit;
};
