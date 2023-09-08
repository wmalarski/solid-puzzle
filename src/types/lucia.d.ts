/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import("../server/auth/lucia").Auth;

  type DatabaseUserAttributes = {
    username: string;
  };

  type DatabaseSessionAttributes = Record<string, never>;
}
