import { useSubmission } from "@solidjs/router";
import { Component, Show } from "solid-js";

import { Button, LinkButton } from "~/components/Button/Button";
import { ExitIcon } from "~/components/Icons/ExitIcon";
import { PuzzleIcon } from "~/components/Icons/PuzzleIcon";
import { Link } from "~/components/Link/Link";
import { Navbar, NavbarEnd, NavbarStart } from "~/components/Navbar/Navbar";
import { useI18n } from "~/contexts/I18nContext";
import { useUserContext } from "~/contexts/UserContext";
import { signOutAction } from "~/server/auth/client";
import { paths } from "~/utils/paths";

import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

const SignOutButton: Component = () => {
  const { t } = useI18n();

  const submission = useSubmission(signOutAction);

  return (
    <form action={signOutAction} method="post">
      <Button disabled={submission.pending} size="sm">
        <ExitIcon class="size-4" />
        {t("auth.signOut")}
      </Button>
    </form>
  );
};

export const TopNavbar: Component = () => {
  const { t } = useI18n();

  const user = useUserContext();

  return (
    <Navbar>
      <NavbarStart>
        <Link class="flex gap-2 text-3xl uppercase" hover href={paths.home}>
          <PuzzleIcon class="size-8" />
          {t("home.title")}
        </Link>
      </NavbarStart>
      <NavbarEnd>
        <ThemeToggle />
        <Show
          fallback={
            <>
              <LinkButton href={paths.signUp} size="sm" variant="ghost">
                {t("home.signUp")}
              </LinkButton>
              <LinkButton href={paths.signIn} size="sm" variant="active">
                {t("home.signIn")}
              </LinkButton>
            </>
          }
          when={user()}
        >
          <LinkButton
            class="flex text-sm uppercase"
            href={paths.boards()}
            size="sm"
          >
            {t("home.boards")}
          </LinkButton>
          <SignOutButton />
        </Show>
      </NavbarEnd>
    </Navbar>
  );
};
