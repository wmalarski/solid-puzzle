import { buildSearchParams } from "./searchParams";

export const paths = {
  board: (boardId: string) => `/board/${boardId}`,
  boards: (page = 1) => `/board?${buildSearchParams({ page })}`,
  home: "/",
  intro: "/introduction",
  invite: (boardId: string) => `/invite/${boardId}`,
  notFound: "/404",
  repository: "https://github.com/wmalarski/solid-puzzle",
  signIn: "/sign-in",
  signUp: "/sign-up",
  signUpSuccess: "/sign-up/success"
};
