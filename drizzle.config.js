import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_5MJQwop0YzLr@ep-silent-cake-a1u0uj7s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});
