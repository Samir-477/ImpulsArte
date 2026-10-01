import pg from "pg";
import { resolve } from "node:path";
import { content, serviceKeys } from "../src/lib/content.ts";

for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(resolve(file));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
});
await client.connect();
try {
  await client.query("BEGIN");
  let inserted = 0;
  for (const locale of ["es", "en"]) {
    for (const key of serviceKeys) {
      const item = content[locale].services[key];
      const result = await client.query(
        "insert into public.service_localizations(service_key,locale,name,eyebrow,summary,description,features) values($1,$2,$3,$4,$5,$6,$7) on conflict (service_key,locale) do nothing",
        [
          key,
          locale,
          item.name,
          item.eyebrow,
          item.short,
          item.detail,
          [...item.items],
        ],
      );
      inserted += result.rowCount;
    }
  }
  await client.query("COMMIT");
  console.log(
    JSON.stringify({ translationsInserted: inserted, locales: ["es", "en"] }),
  );
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
