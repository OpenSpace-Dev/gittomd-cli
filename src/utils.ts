/**
 * Parses a GitHub URL or a string in the format 'owner/repo' to extract the owner and repository name.
 * @param url The URL or string to parse.
 * @returns An object with the owner and repo, or null if the format is invalid.
 */
export function parseGitHubUrl(
  url: string
): { owner: string; repo: string } | null {
  try {
    const sshMatch = url.match(/git@github\.com:([\w.-]+)\/([\w.-]+)\.git/);
    if (sshMatch) {
      return { owner: sshMatch[1], repo: sshMatch[2] };
    }

    const urlObj = new URL(url);
    if (urlObj.hostname !== "github.com") {
      return null;
    }
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      return null;
    }
    const [owner, repo] = pathParts;
    return { owner, repo: repo.replace(".git", "") };
  } catch (error) {
    const simpleMatch = url.match(/^([\w.-]+)\/([\w.-]+)$/);
    if (simpleMatch) {
      return { owner: simpleMatch[1], repo: simpleMatch[2] };
    }
    return null;
  }
}