const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public/ path with the deploy base path (needed on GitHub Pages project sites). */
export function asset(path: string) {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}
