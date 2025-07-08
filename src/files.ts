const KNOWN_TEXT_FILES: Set<string> = new Set([
  ".md", ".markdown", ".txt", ".log", ".json", ".yaml", ".yml", ".xml", ".html", ".htm",
  ".css", ".js", ".jsx", ".ts", ".tsx", ".py", ".rb", ".php", ".java", ".c", ".h", ".cpp",
  ".hpp", ".cs", ".go", ".rs", ".swift", ".kt", ".kts", ".pl", ".sh", ".bash", ".zsh", ".fish",
  ".ps1", ".bat", ".cmd", ".r", ".sql", ".ini", ".cfg", ".conf", ".toml", ".editorconfig",
  ".gitignore", ".gitattributes", ".gitmodules", ".csv", ".tsv", ".rst", ".adoc", ".asciidoc",
  ".tex", ".Makefile", ".dockerfile", ".env", ".properties", ".graphql", ".gql", ".tf", ".tfvars",
  ".hcl", ".vue", ".svelte", ".sum", ".mod", "readme", "license", "contributing", "code_of_conduct",
  "changelog", "makefile", "dockerfile", "jenkinsfile", "gemfile", "pipfile", "requirements", "procfile",
  "version", "authors", "copying", "notice", "patents", "todo"]);

const KNOWN_TRASH_FILES: Set<string> = new Set([
    ".DS_Store", "Thumbs.db", ".git", ".gitignore",
    ".gitattributes", ".gitmodules", "package-lock.json",
    "yarn.lock", "pnpm-lock.yaml", "node_modules", "dist",
    ".next", ".nuxt", ".cache", ".vscode", ".idea", ".history", '.github'
]);

/**
 * Checks if a file is a known text file based on its extension or name.
 * @param fileName The name of the file to check.
 * @returns True if the file is a text file, false otherwise.
 */
export function isTextFile(fileName: string): boolean {
  const lowerFileName = fileName.toLowerCase();
  const ext = lowerFileName.split(".").pop() || "";
  return KNOWN_TEXT_FILES.has(`.${ext}`) || KNOWN_TEXT_FILES.has(lowerFileName);
}

/**
 * Checks if a file or directory is a known trash file or directory.
 * @param relativePath The relative path of the file or directory to check.
 * @returns True if the file or directory should be ignored, false otherwise.
 */
export function isTrashFileOrDir(relativePath: string): boolean {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  
  if (KNOWN_TRASH_FILES.has(normalizedPath)) {
    return true;
  }
  
  const parts = normalizedPath.split('/');
  for (const part of parts) {
    if (KNOWN_TRASH_FILES.has(part)) {
      return true;
    }
  }

  return false;
}

/**
 * Formats the content of a file into a Markdown code block.
 * @param relativePath The relative path of the file.
 * @param content The content of the file.
 * @returns A formatted string containing the file path and its content in a Markdown code block.
 */
export function formatFileContent(relativePath: string, content: string): string {
  const language = relativePath.split('.').pop() || 'text';
  return `\n## \`${relativePath}\`\n\n\`\`\`${language}\n${content}\n\`\`\``;
}