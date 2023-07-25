import { json } from "solid-start";

const resolver = () => {
  return json({
    cookie: null,
    // We will discuss these two fields in later steps.
    lastMutationID: 0,
    patch: [
      { op: "clear" },
      {
        key: "message/qpdgkvpb9ao",
        op: "put",
        value: {
          content: "Hey, what's for lunch?",
          from: "Jane",
          order: 1,
        },
      },
      {
        key: "message/5ahljadc408",
        op: "put",
        value: {
          content: "tacos?",
          from: "Fred",
          order: 2,
        },
      },
    ],
  });
};

export const POST = resolver;
export const GET = resolver;
