import { exec } from "child_process";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);
/**
 * Clones a GitHub repository into a temporary directory.
 * @param repoUrl The URL of the repository to clone.
 * @returns A promise that resolves to the path of the temporary directory where the repository was cloned.
 * @throws An error if the repository cloning fails.
 */
export async function cloneRepo(repoUrl: string): Promise<string> {
  const tempDir = await mkdtemp(join(tmpdir(), "gittomd-"));
  
  try {
    await execAsync(`git clone --depth 1 ${repoUrl} .`, { cwd: tempDir });
    return tempDir;
  } catch (error) {
    await cleanup(tempDir);
    throw new Error(`Failed to clone repository: ${repoUrl}\n${error}`);
  }
}

/**
 * Removes a directory and its contents.
 * @param dirPath The path to the directory to remove.
 * @returns A promise that resolves when the directory has been removed.
 */
export async function cleanup(dirPath: string): Promise<void> {
  await rm(dirPath, { recursive: true, force: true });
}