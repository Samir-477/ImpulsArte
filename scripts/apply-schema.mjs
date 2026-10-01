import pg from "pg";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(resolve(file));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
const migration = await readFile(
  resolve("supabase/migrations/20260930000000_init.sql"),
  "utf8",
);
const names = (pattern) =>
  [...migration.matchAll(pattern)].map((match) => match[1]);
const tables = names(/create table public\.([a-z_]+)/g);
const functions = names(/create or replace function public\.([a-z_]+)/g);
const triggers = names(/create trigger ([a-z_]+)/g);
const policies = names(/create policy ([a-z_]+) on storage\.objects/g);
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
});
await client.connect();
try {
  const tableRows = await client.query(
    "select tablename as name from pg_tables where schemaname = 'public'",
  );
  const functionRows = await client.query(
    "select p.proname as name from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'",
  );
  const triggerRows = await client.query(
    "select t.tgname as name from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'auth' and c.relname = 'users' and not t.tgisinternal",
  );
  const policyRows = await client.query(
    "select policyname as name from pg_policies where schemaname = 'storage' and tablename = 'objects'",
  );
  const bucketRows = await client.query(
    "select id as name from storage.buckets where id = 'brief-attachments'",
  );
  const overlap = (expected, rows) =>
    expected.filter((name) => rows.rows.some((row) => row.name === name));
  const conflicts = {
    tables: overlap(tables, tableRows),
    functions: overlap(functions, functionRows),
    triggers: overlap(triggers, triggerRows),
    storagePolicies: overlap(policies, policyRows),
    bucket: bucketRows.rows.length > 0,
  };
  console.log(
    JSON.stringify({
      existingPublicTables: tableRows.rows.length,
      appTableCount: tables.length,
      conflicts,
    }),
  );
  if (
    Object.values(conflicts).some((value) =>
      Array.isArray(value) ? value.length > 0 : value,
    )
  )
    throw new Error("Schema name conflicts; migration cancelled");
  await client.query("BEGIN");
  try {
    await client.query(migration);
    if (process.argv.includes("--apply")) {
      await client.query("COMMIT");
      console.log("ImpulsArte migration applied");
    } else {
      await client.query("ROLLBACK");
      console.log(
        "ImpulsArte migration dry run passed; no schema changes committed",
      );
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
} finally {
  await client.end();
}
