import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

for (const file of [".env", ".env.local"]) {
  try { process.loadEnvFile(resolve(file)); } catch (error) { if (error.code !== "ENOENT") throw error; }
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key || !url.startsWith("https://")) {
  console.error("Set the Supabase HTTPS project URL and publishable/anon key."); process.exit(1);
}
try {
  const response = await fetch(new URL("/auth/v1/settings", url), { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error("Auth settings HTTP " + response.status);
  const settings = await response.json();
  console.log(JSON.stringify({ auth: "connected", googleEnabled: !!settings.external?.google, emailEnabled: !!settings.external?.email, signupDisabled: !!settings.disable_signup }));
  if (process.argv.includes("--database")) {
    const { default: pg } = await import("pg");
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
    try {
      await client.connect();
      await client.query("BEGIN READ ONLY");
      const tables = await client.query("select tablename from pg_tables where schemaname = 'public' order by tablename");
      const migration = await readFile(resolve("supabase/migrations/20260930000000_init.sql"), "utf8");
      const expected = Array.from(migration.matchAll(/create table public\.([a-z_]+)/g), match => match[1]);
      const existing = tables.rows.map(row => row.tablename);
      console.log(JSON.stringify({ database: "connected", publicTableCount: existing.length, appTableCollisions: expected.filter(name => existing.includes(name)), unrelatedTableCount: existing.filter(name => !expected.includes(name)).length }));
      await client.query("ROLLBACK");
    } finally { await client.end(); }
  }
} catch (error) {
  console.error("Supabase check failed: " + (error.cause?.code || error.code || error.message)); process.exitCode = 1;
}
