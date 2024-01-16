export const paths = {
  board: (boardId: string) => `/board/${boardId}`,
  boards: "/board",
  home: "/",
  invite: (boardId: string) => `/invite/${boardId}`,
  notFound: "/404",
  repository: "https://github.com/wmalarski/solid-puzzle",
  signIn: "/sign-in",
  signUp: "/sign-up",
  signUpSuccess: "/sign-up/success"
};
