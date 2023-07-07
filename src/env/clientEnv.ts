type ClientEnv = {
  VITE_REPLICACHE_LICENSE_KEY: string;
};

export const clientEnv = (): ClientEnv => {
  const replicache = import.meta.env.VITE_REPLICACHE_LICENSE_KEY;

  if (!replicache) {
    throw new Error("Invalid client secrets");
  }

  return { VITE_REPLICACHE_LICENSE_KEY: replicache };
};
