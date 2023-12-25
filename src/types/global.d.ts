/// <reference types="@solidjs/start/env" />
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Env {
    DATABASE_URL: string;
    NODE_ENV: string;
    SESSION_SECRET: string;
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type __Placeholder = number;
