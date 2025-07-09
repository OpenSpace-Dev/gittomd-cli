#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import ora from "ora";
import chalk from "chalk";
import { writeFile } from "fs/promises";
import { parseGitHubUrl } from "./utils";
import { cloneRepo, cleanup } from "./git";
import { generateMarkdown } from "./markdown";

/**
 * The main function of the gittomd CLI.
 * It parses command-line arguments, clones a GitHub repository,
 * generates Markdown from its content, and outputs the result
 * to a file or stdout.
 */
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .scriptName("gittomd")
    .usage("Usage: $0 <repo> [options]")
    .command("$0 <repo>", "Convert GitHub repository to Markdown", (yargs) => {
      return yargs
        .positional("repo", {
          describe: "GitHub repository URL or 'owner/repo' string",
          type: "string",
          demandOption: true,
        });
    })
    .option("output", {
      alias: "o",
      type: "string",
      description: "Output file path. If not provided, prints to stdout.",
    })
    .example("$0 microsoft/typescript", "Convert TypeScript repo to Markdown")
    .example("$0 https://github.com/microsoft/typescript -o output.md", "Save to file")
    .help()
    .alias("h", "help")
    .version()
    .alias("v", "version")
    .strict()
    .demandCommand(1, "Please specify a repository")
    .parse();

  const repoIdentifier = argv.repo as string;
  const outputPath = argv.output as string | undefined;

  console.log(chalk.gray(`Repository: ${repoIdentifier}`));
  if (outputPath) {
    console.log(chalk.gray(`Output: ${outputPath}`));
  }

  const repoInfo = parseGitHubUrl(repoIdentifier);

  if (!repoInfo) {
    console.error(chalk.red("Error: Invalid GitHub repository URL or format."));
    console.error(chalk.yellow("Please use a valid URL (e.g., https://github.com/owner/repo) or 'owner/repo'."));
    process.exit(1);
  }

  const repoUrl = `https://github.com/${repoInfo.owner}/${repoInfo.repo}.git`;
  const spinner = ora(chalk.cyan(`Starting process for ${repoInfo.owner}/${repoInfo.repo}`)).start();
  let tempDir: string | null = null;

  try {
    spinner.text = chalk.blue("Cloning repository...");
    tempDir = await cloneRepo(repoUrl);

    spinner.text = chalk.magenta("Analyzing files and generating Markdown...");
    const markdownContent = await generateMarkdown(tempDir, repoInfo.repo);

    spinner.succeed(chalk.green("Markdown generated successfully!"));

    if (outputPath) {
      await writeFile(outputPath, markdownContent);
      console.log(chalk.green(`\n✅ Output saved to ${outputPath}`));
    } else {
      console.log("\n--- Generated Markdown ---\n");
      console.log(markdownContent);
    }
  } catch (error) {
    spinner.fail(chalk.red("An error occurred."));
    if (error instanceof Error) {
        console.error(chalk.red(error.message));
    } else {
        console.error(chalk.red("An unknown error occurred."));
    }
    process.exit(1);
  } finally {
    if (tempDir) {
      await cleanup(tempDir);
    }
  }
}

main().catch(err => {
    console.error(chalk.red('A critical error occurred:'), err);
    process.exit(1);
});