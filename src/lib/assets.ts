export function asset(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized;
}
