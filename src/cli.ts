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
    .usage("$0 <repo> [options]")
    .positional("repo", {
      describe: "GitHub repository URL or 'owner/repo' string",
      type: "string",
    })
    .option("o", {
      alias: "output",
      type: "string",
      description: "Output file path. If not provided, prints to stdout.",
    })
    .help()
    .alias("h", "help")
    .parse();
  
    console.log(argv);

  const repoIdentifier = argv._[0] as string;
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

    if (argv.output) {
      await writeFile(argv.output as string, markdownContent);
      console.log(chalk.green(`\n✅ Output saved to ${argv.output}`));
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