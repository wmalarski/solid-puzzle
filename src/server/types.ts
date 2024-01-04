import type { Issues } from "valibot";

export type RpcResponse =
  | {
      success: true;
    }
  | {
      error?: string;
      errors?: Record<string, string>;
      success: false;
    };

export const issuesToRpcResponse = (issues: Issues): RpcResponse => {
  return {
    errors: Object.fromEntries(
      issues.map((issue) => [
        issue.path?.map((path) => path.key).join("."),
        issue.message,
      ]),
    ),
    success: false,
  };
};

export const rpcParseIssueError = (issues: Issues) => {
  return new Error(issues[0].message);
};
