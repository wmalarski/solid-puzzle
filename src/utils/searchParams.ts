export const buildSearchParams = (
  query?: Record<string, unknown>,
): URLSearchParams => {
  const entries = Object.entries(query || {});
  const pairs = entries.flatMap(([key, value]) =>
    value !== undefined ? [[key, `${value}`]] : [],
  );
  return new URLSearchParams(pairs);
};
