export function asset(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const basePath = process.env.NODE_ENV === "production" ? "/awedding" : "";
  return `${basePath}${normalized}`;
}
