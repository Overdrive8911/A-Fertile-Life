type EnvironmentMode = "production" | "development";
export const mode =
  (Bun.env.NODE_ENV as EnvironmentMode | undefined) || "development";
