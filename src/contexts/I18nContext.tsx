import { flatten, resolveTemplate, translator } from "@solid-primitives/i18n";
import {
  type Accessor,
  type Component,
  type ParentProps,
  createContext,
  createMemo,
  createSignal,
  useContext
} from "solid-js";

const en_dict = {
  auth: {
    email: {
      label: "Username",
      placeholder: "Username"
    },
    password: {
      label: "Password",
      placeholder: "Password"
    },
    signIn: {
      button: "Sign In",
      signUp: "Sign Up",
      title: "Sign In"
    },
    signOut: "Sign Out",
    signUp: {
      button: "Sign Up",
      signIn: "Sign In",
      success: "Success",
      title: "Sign Up"
    },
    signUpSuccess: {
      description:
        "Congratulations! your account has been successfully created",
      label: "Success"
    }
  },
  board: {
    boards: "Boards",
    home: "Home",
    menu: "Menu",
    newBoard: "New board",
    reload: {
      description: "Do you want to play again?",
      error: "Error",
      startAgain: "Start Again",
      title: "Congratulations!"
    },
    settings: {
      delete: {
        button: "Delete",
        cancel: "Cancel",
        label: "Are you sure?",
        title: "Delete board"
      },
      error: "Error",
      label: "Settings",
      title: "Board settings",
      update: {
        button: "Save"
      }
    },
    share: {
      copy: "Link copied to your clipboard",
      title: "Share link"
    },
    topBar: {
      players: "Players"
    },
    zoom: {
      reset: "Reset zoom",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out"
    }
  },
  createBoard: {
    button: "Save",
    columns: {
      label: "Columns",
      placeholder: "Enter number of columns"
    },
    image: "Image",
    link: "Sign In to create board",
    name: {
      label: "Name",
      placeholder: "Enter board name"
    },
    rows: {
      label: "Rows",
      placeholder: "Enter number of rows"
    },
    title: "Create board"
  },
  error: {
    description: "Something went wrong: {{message}}",
    home: "Home",
    reload: "Reload",
    title: "Puzzle error"
  },
  footer: {
    madeBy: "Made by wmalarski"
  },
  home: {
    addBoard: "Add board",
    boards: "Boards",
    error: "Error",
    signIn: "Sign In",
    signUp: "Sign Up",
    solve: "Solve",
    title: "Puzzle"
  },
  info: {
    madeBy: "Made by wmalarski",
    title: "Solid Puzzle"
  },
  invite: {
    button: "Accept",
    title: "Invitation to {{name}}",
    username: {
      label: "Name",
      placeholder: "Your name"
    }
  },
  list: {
    empty: "Empty",
    error: "Loading list error",
    go: "Play",
    loading: "Loading"
  },
  notFound: {
    title: "Not Found"
  },
  pagination: {
    label: "Pagination",
    more: "More pages",
    next: "Next",
    nextLabel: "Go to next page",
    previous: "Previous",
    previousLabel: "Go to previous page"
  }
};

export type Locale = "en";

const dictionaries = { en: en_dict };

type Accessed<T> = T extends Accessor<infer A> ? A : never;

export const createI18nValue = () => {
  const [locale, setLocale] = createSignal<Locale>("en");

  const translate = createMemo(() => {
    const dict = flatten(dictionaries[locale()]);
    return translator(() => dict, resolveTemplate);
  });

  const t: Accessed<typeof translate> = (path, ...args) => {
    return translate()(path, ...args);
  };

  return { locale, setLocale, t };
};

type I18nContextValue = ReturnType<typeof createI18nValue>;

export const I18nContext = createContext<I18nContextValue>({
  locale: () => "en" as const,
  setLocale: () => void 0,
  t: () => {
    throw new Error("Not implemented");
  }
});

export const I18nContextProvider: Component<ParentProps> = (props) => {
  const value = createI18nValue();

  return (
    <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>
  );
};

export const useI18n = () => {
  return useContext(I18nContext);
};
