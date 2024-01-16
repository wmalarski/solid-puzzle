import { useSubmission } from "@solidjs/router";
import { type Component, Show } from "solid-js";

import { Button, LinkButton } from "~/components/Button";
import { PuzzleIcon } from "~/components/Icons/PuzzleIcon";
import { Link } from "~/components/Link";
import { Navbar, NavbarEnd, NavbarStart } from "~/components/Navbar";
import { useI18n } from "~/contexts/I18nContext";
import { useSessionContext } from "~/contexts/SessionContext";
import { signOutAction } from "~/server/auth/client";
import { paths } from "~/utils/paths";

const SignOutButton: Component = () => {
  const { t } = useI18n();

  const submission = useSubmission(signOutAction);

  return (
    <form action={signOutAction} method="post">
      <Button disabled={submission.pending} size="sm">
        {t("auth.signOut")}
      </Button>
    </form>
  );
};

export const TopNavbar: Component = () => {
  const { t } = useI18n();

  const session = useSessionContext();

  return (
    <Navbar>
      <NavbarStart>
        <Link class="flex gap-2 text-3xl uppercase" hover href={paths.home}>
          <PuzzleIcon class="h-8 w-8" />
          {t("home.title")}
        </Link>
      </NavbarStart>
      <NavbarEnd>
        <Show
          fallback={
            <>
              <LinkButton href={paths.signUp} size="sm" variant="ghost">
                {t("home.signUp")}
              </LinkButton>
              <LinkButton href={paths.signIn} size="sm">
                {t("home.signIn")}
              </LinkButton>
            </>
          }
          when={session()}
        >
          <Link class="flex text-sm uppercase" hover href={paths.boards}>
            {t("home.boards")}
          </Link>
          <SignOutButton />
        </Show>
      </NavbarEnd>
    </Navbar>
  );
};
