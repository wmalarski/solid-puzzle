import { createI18nContext } from "@solid-primitives/i18n";

const dict = {
  en: {
    auth: {
      password: {
        label: "Password",
        placeholder: "Password",
      },
      signOut: "Sign Out",
      username: {
        label: "Username",
        placeholder: "Username",
      },
    },
    board: {
      menu: "Menu",
      newGame: "New game",
      share: {
        button: "Share link",
        link: "Link",
        loading: "Loading",
        regenerate: "Regenerate",
        title: "Share link",
      },
    },
    createBoard: {
      button: "Save",
      columns: {
        label: "Columns",
        placeholder: "Enter number of columns",
      },
      name: {
        label: "Name",
        placeholder: "Enter board name",
      },
      rows: {
        label: "Rows",
        placeholder: "Enter number of rows",
      },
      title: "Create board",
    },
    footer: {
      madeBy: "Made by wmalarski",
    },
    home: {
      addBoard: "Add board",
      error: "Error",
      signIn: "Sign In",
      signUp: "Sign Up",
      solve: "Solve",
      title: "Puzzle",
    },
    info: {
      madeBy: "Made by wmalarski",
      title: "Solid Puzzle",
    },
    invite: {
      button: "Accept",
      title: "Invitation to {{name}}",
      username: {
        label: "Name",
        placeholder: "Your name",
      },
    },
    signIn: {
      button: "Sign In",
      signUp: "Sign Up",
      title: "Sign In",
    },
    signUp: {
      button: "Sign Up",
      signIn: "Sign In",
      title: "Sign Up",
    },
  },
};

export const i18n = createI18nContext(dict, "en");
