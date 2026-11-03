import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const resumeContentPath = path.join(repoRoot, "data", "resumeContent.js");
const outputPath = path.join(repoRoot, "data", "githubSnapshot.json");

function parseUsername(source) {
  const match = source.match(/githubProfile\s*=\s*\{[\s\S]*?username:\s*"([^"]+)"/);
  return match?.[1]?.trim() || "";
}

async function readUsername() {
  const explicit = process.env.GITHUB_PROFILE_USERNAME?.trim();
  if (explicit) return explicit;

  const source = await fs.readFile(resumeContentPath, "utf8");
  return parseUsername(source);
}

function compactRepo(node) {
  return {
    name: node.name,
    description: node.description || "Pinned repository.",
    language: node.primaryLanguage?.name || "Mixed",
    stars: node.stargazerCount || 0,
    url: node.url
  };
}

async function fetchGraphqlSnapshot(username, token) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        login
        bio
        avatarUrl
        url
        followers { totalCount }
        following { totalCount }
        repositories(privacy: PUBLIC) { totalCount }
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              primaryLanguage { name }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables: { login: username }
    })
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message || "GraphQL error");
  }

  const user = payload.data?.user;
  if (!user) throw new Error("User not found in GraphQL response");

  return {
    updatedAt: new Date().toISOString(),
    username,
    profile: {
      login: user.login || username,
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
      url: user.url || `https://github.com/${username}`,
      followers: user.followers?.totalCount || 0,
      following: user.following?.totalCount || 0,
      publicRepos: user.repositories?.totalCount || 0
    },
    pinnedRepos: (user.pinnedItems?.nodes || []).map(compactRepo)
  };
}

async function fetchRestFallback(username) {
  const [profileRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=18&type=owner`)
  ]);

  if (!profileRes.ok || !reposRes.ok) {
    throw new Error(`REST fallback failed: ${profileRes.status}/${reposRes.status}`);
  }

  const profile = await profileRes.json();
  const repos = await reposRes.json();

  const pinnedLike = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      description: repo.description || "Repository snapshot.",
      language: repo.language || "Mixed",
      stars: repo.stargazers_count || 0,
      url: repo.html_url
    }));

  return {
    updatedAt: new Date().toISOString(),
    username,
    profile: {
      login: profile.login || username,
      bio: profile.bio || "",
      avatarUrl: profile.avatar_url || "",
      url: profile.html_url || `https://github.com/${username}`,
      followers: profile.followers || 0,
      following: profile.following || 0,
      publicRepos: profile.public_repos || 0
    },
    pinnedRepos: pinnedLike
  };
}

async function main() {
  const username = await readUsername();
  if (!username) {
    throw new Error("GitHub username not found. Set GITHUB_PROFILE_USERNAME or data.resumeContent.githubProfile.username");
  }

  const token = process.env.GITHUB_TOKEN?.trim();
  let snapshot;

  try {
    if (token) {
      snapshot = await fetchGraphqlSnapshot(username, token);
    } else {
      snapshot = await fetchRestFallback(username);
    }
  } catch (error) {
    console.warn(`[snapshot] primary fetch failed: ${error.message}`);
    snapshot = await fetchRestFallback(username);
  }

  await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`[snapshot] wrote ${snapshot.pinnedRepos.length} repos for @${username} -> data/githubSnapshot.json`);
}

main().catch((error) => {
  console.error(`[snapshot] failed: ${error.message}`);
  process.exit(1);
});
