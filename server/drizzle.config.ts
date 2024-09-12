import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./.migrations",
  //   migrations: {
  //     prefix: "supabase",
  //   },
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
