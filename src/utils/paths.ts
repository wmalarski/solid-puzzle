import { buildSearchParams } from "./searchParams";

export const paths = {
  board: (boardId: string) => `/board/${boardId}`,
  boards: (page = 0) => `/board?${buildSearchParams({ page })}`,
  home: "/",
  invite: (boardId: string) => `/invite/${boardId}`,
  notFound: "/404",
  repository: "https://github.com/wmalarski/solid-puzzle",
  signIn: "/sign-in",
  signUp: "/sign-up",
  signUpSuccess: "/sign-up/success"
};
