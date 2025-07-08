import { readdir, readFile } from "fs/promises";
import { join, relative } from "path";
import { formatFileContent, isTextFile, isTrashFileOrDir } from "./files";

interface FileInfo {
  path: string;
  relativePath: string;
}

/**
 * Recursively walks through a directory, creating a file tree structure and collecting file information.
 * @param dir The directory to start walking from.
 * @param rootPath The root path of the repository, used to determine relative paths.
 * @param prefix The prefix to use for the tree structure, used for indentation.
 * @returns A promise that resolves to an object containing the file tree string and an array of file information objects.
 */
async function walk(
  dir: string,
  rootPath: string,
  prefix = ""
): Promise<{ tree: string; files: FileInfo[] }> {
  let tree = "";
  const files: FileInfo[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  const visibleEntries = entries.filter(entry => {
    const relativePath = relative(rootPath, join(dir, entry.name));
    return !isTrashFileOrDir(relativePath);
  });
  
  for (let i = 0; i < visibleEntries.length; i++) {
    const entry = visibleEntries[i];
    const fullPath = join(dir, entry.name);
    const relativePath = relative(rootPath, fullPath);
    const isLast = i === visibleEntries.length - 1;
    const connector = isLast ? "└── " : "├── ";

    tree += `${prefix}${connector}${entry.name}\n`;

    if (entry.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      const result = await walk(fullPath, rootPath, newPrefix);
      tree += result.tree;
      files.push(...result.files);
    } else if (entry.isFile() && isTextFile(entry.name)) {
      files.push({ path: fullPath, relativePath });
    }
  }

  return { tree, files };
}

/**
 * Generates a Markdown string from a repository's files.
 * @param repoPath The local path to the cloned repository.
 * @param repoName The name of the repository.
 * @returns A promise that resolves to the complete Markdown string.
 */
export async function generateMarkdown(repoPath: string, repoName: string): Promise<string> {
  const markdownParts: string[] = [];
  markdownParts.push(`# Repository: ${repoName}`);

  const { tree, files } = await walk(repoPath, repoPath);
  
  markdownParts.push("\n## File Structure\n");
  markdownParts.push("```text");
  markdownParts.push(`${repoName}/`);
  markdownParts.push(tree.trim());
  markdownParts.push("```");

  files.sort((a, b) => {
    if (a.relativePath.toLowerCase() === 'readme.md') return -1;
    if (b.relativePath.toLowerCase() === 'readme.md') return 1;
    return a.relativePath.localeCompare(b.relativePath);
  });

  for (const file of files) {
    try {
      const content = await readFile(file.path, "utf-8");
      markdownParts.push(formatFileContent(file.relativePath, content));
    } catch (err) {
      console.warn(`\nWarning: Could not read file ${file.relativePath}. Skipping.`);
    }
  }

  return markdownParts.join("\n");
}