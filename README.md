<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/OpenSpace-Dev/gittomd/main/public/icons/logo_black.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/OpenSpace-Dev/gittomd/main/public/icons/logo_white.png">
    <img alt="gittomd Logo" src="https://raw.githubusercontent.com/OpenSpace-Dev/gittomd/main/public/icons/logo_white.png" width="200">
  </picture>
  <h1>gittomd-cli</h1>
  <p><strong>The power of gittomd.com, right in your terminal.</strong></p>
  <p>Your entire GitHub repo, intelligently packaged into a single Markdown file. The perfect tool for feeding codebases to LLMs, creating technical documentation, or for offline code analysis.</p>
  
  <p>
    <a href="https://gittomd.com" target="_blank"><strong>Try the Web Version ↗</strong></a>
  </p>
  
  <p>
    <a href="https://www.npmjs.com/package/gittomd"><img src="https://img.shields.io/npm/v/gittomd.svg" alt="NPM Version"></a>
    <a href="https://www.npmjs.com/package/gittomd"><img src="https://img.shields.io/npm/dt/gittomd.svg" alt="NPM Downloads"></a>
    <a href="https://github.com/OpenSpace-Dev/gittomd-cli/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/gittomd.svg" alt="License"></a>
  </p>
</div>

## `gittomd` CLI vs. Web

This is the official command-line interface (CLI) for **gittomd**. It brings all the powerful features of our web version directly to your terminal, allowing for local processing, scripting, and integration into your development workflow.

| Feature               | **gittomd CLI (This project)** | [**gittomd.com**](https://gittomd.com) |
| --------------------- | :----------------------------: | :------------------------------------: |
| **Terminal Access**   |               ✅               |                   ❌                   |
| **Scripting/CI/CD**   |               ✅               |                   ❌                   |
| **Local Processing**  |               ✅               |                   ❌                   |
| **No Rate Limits**    |               ✅               |                   ⚠️                    |
| **Instant Access**    |               ❌               |                   ✅                   |
| **No Installation**   |               ❌               |                   ✅                   |
| **Caching**           |               ❌               |                   ✅                   |

Choose the CLI for power-user features and automation. Choose the [web version](https://gittomd.com) for quick, one-off conversions without any setup.

---

## ✨ Key Features

*   **⚡ Blazing Fast:** Optimized for performance with asynchronous file processing. Handles large repositories with ease.
*   **🧠 LLM-Optimized Formatting:** Outputs clean Markdown with language-annotated code blocks (e.g., `## `path/to/file.tsx``), a format that models like GPT-4 and Claude understand perfectly.
*   **🗑️ Intelligent Filtering:** Automatically ignores binary files and common clutter (`.git`, `node_modules`, `dist/`, `package-lock.json`, etc.) to keep the context clean and focused.
*   **🌲 Clear Structure:** Includes a file tree at the beginning of the Markdown file, giving a clear overview of the repository structure.
*   **💻 Purely Local:** Clones the repository to a temporary local directory. No reliance on GitHub API rate limits for fetching file content.

---

## 📦 Installation

To use the `gittomd` CLI, you need to have [Node.js](https://nodejs.org/) (v18 or newer) and [Git](https://git-scm.com/) installed on your system.

Install `gittomd` globally using npm:

```bash
npm install -g gittomd
```

---

## 🛠️ How to Use

The basic command structure is:

```bash
gittomd <repository> [options]
```

### Examples

**1. Print Markdown to the console:**

This will fetch the `expressjs/express` repository and print the combined Markdown directly to your terminal.

```bash
gittomd expressjs/express
```

**2. Save Markdown to a file:**

Use the `-o` or `--output` flag to specify a file path.

```bash
gittomd OpenSpace-Dev/gittomd-cli -o gittomd_project.md
```

This will create a file named `gittomd_project.md` in your current directory.

**You can use full GitHub URLs as well:**

```bash
gittomd https://github.com/vercel/next.js -o nextjs.md
```

### Options

| Option             | Alias | Description                                        | Default   |
| ------------------ | ----- | -------------------------------------------------- | --------- |
| `--output <path>`  | `-o`  | Output file path.                                  | `stdout`  |
| `--profile`        |       | Show performance metrics after execution.          | `false`   |
| `--help`           | `-h`  | Show help information.                             |           |

---

## 🚀 Performance Benchmarks

`gittomd` is designed to be fast. The main bottleneck is cloning the repository, which depends on your network speed. The file processing itself is highly optimized.

Here are some benchmarks run on a standard machine (Apple M1, 16GB RAM) to demonstrate the processing speed after the repository is cloned:

| Repository        | Total Files (approx.) | Time to Clone | **Time to Process Files** |
| ----------------- | --------------------- | ------------- | ------------------------- |
| **`expressjs/express`** | ~100                  | ~16s          | **~70ms**                 |
| **`facebook/react`**    | ~2,500                | ~6s           | **~890ms**                |
| **`vercel/next.js`**    | ~15,000+              | ~28s          | **~2.6s**                 |

---

## 🤝 Contributing

We welcome contributions of all kinds! Whether it's reporting a bug, suggesting a feature, or submitting a pull request, your help is appreciated.

### Running the CLI Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/OpenSpace-Dev/gittomd-cli.git
    cd gittomd
    ```

2.  **Install Dependencies & Build:**
    ```bash
    npm install
    npm run build
    ```

3.  **Link for local development:**
    Use `npm link` to make the `gittomd` command available globally, pointing to your local code.
    ```bash
    npm link
    ```
    Now you can run `gittomd` from any directory.

---

## ❤️ Show Your Support

If you find `gittomd` useful, please give the [repository](https://github.com/OpenSpace-Dev/gittomd-cli) a ⭐️ on GitHub! It helps the project gain visibility and encourages further development.

---

<div align="center">
  <p>A project by <a href="https://t.me/openspaceteam">OpenSpace Dev</a></p>
</div>