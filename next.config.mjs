const isGithubActions = Boolean(process.env.GITHUB_ACTIONS);
const [repoOwner = "", repoName = ""] = process.env.GITHUB_REPOSITORY?.split("/") || [];
const isUserSite = repoName.toLowerCase() === `${repoOwner.toLowerCase()}.github.io`;
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || (isGithubActions && repoName && !isUserSite ? `/${repoName}` : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath: configuredBasePath,
  assetPrefix: configuredBasePath || undefined
};

export default nextConfig;
