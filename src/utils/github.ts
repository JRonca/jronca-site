import fs from 'node:fs/promises';
import path from 'node:path';

export interface GitHubRepoData {
  stars: number;
  language: string | null;
  lastCommit: string;
}

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'repos.json');

async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err) {
  }
}

async function readCache(): Promise<Record<string, GitHubRepoData>> {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeCache(data: Record<string, GitHubRepoData>) {
  try {
    await ensureCacheDir();
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write GitHub cache:', err);
  }
}

async function fetchSingleRepo(repo: string, token?: string): Promise<GitHubRepoData | null> {
  const headers: Record<string, string> = {
    'User-Agent': 'JRonca-Portfolio-Builder',
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!response.ok) {
      console.warn(`GitHub API returned status ${response.status} for ${repo}`);
      return null;
    }
    const data = await response.json();
    return {
      stars: data.stargazers_count ?? 0,
      language: data.language ?? null,
      lastCommit: data.pushed_at ?? new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`Failed to fetch repo ${repo} from GitHub API:`, err);
    return null;
  }
}

export async function getReposData(repos: string[]): Promise<Record<string, GitHubRepoData>> {
  const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  
  const cachedData = await readCache();
  const result: Record<string, GitHubRepoData> = { ...cachedData };
  let hasNewData = false;

  for (const repo of repos) {
    if (!repo) continue;
    const fresh = await fetchSingleRepo(repo, token);
    if (fresh) {
      result[repo] = fresh;
      hasNewData = true;
    } else {
      console.info(`Using cache/fallback for repo: ${repo}`);
      if (!result[repo]) {
        result[repo] = {
          stars: 0,
          language: null,
          lastCommit: new Date().toISOString(),
        };
      }
    }
  }

  if (hasNewData) {
    await writeCache(result);
  }

  return result;
}
