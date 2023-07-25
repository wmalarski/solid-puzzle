// src/lucia.d.ts
/// <reference types="lucia-auth" />
import type { Auth as LuciaAuth } from "../server/auth/lucia";

declare namespace Lucia {
  type Auth = LuciaAuth;

  type UserAttributes = {
    lastNames: string;
    names: string;
    username: string;
  };
}
