export function visiblePath(path: string) {
  return path.replace(/^\/(es|en)(?=\/|$)/, "") || "/";
}

export function safeAccountPath(
  candidate: string | undefined,
  fallback = "/dashboard",
) {
  const path = visiblePath(candidate || fallback);
  return /^\/(dashboard|admin|developer|start|onboarding|notifications)(\/|\?|$)/.test(
    path,
  ) &&
    !path.startsWith("//") &&
    !path.includes("\\")
    ? path
    : fallback;
}
