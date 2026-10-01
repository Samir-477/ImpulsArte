export function hasSupabaseApiConfig(
  url: string | undefined,
  key: string | undefined,
) {
  if (!url || !key) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" ||
      (parsed.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(parsed.hostname))
    );
  } catch {
    return false;
  }
}
