const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(assetPath) {
  if (!assetPath) return assetPath;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  const normalized = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${basePath}${normalized}`;
}
