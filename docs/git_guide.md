# Understanding Git

Git is the foundation of modern software development. This guide will walk you through what Git is, essential terminology, and the fundamental commands you need to master version control.

## Table of Contents
- [What is Git?](#what-is-git)
- [Important Git Terms](#important-git-terms)
  - [Repository](#repository)
  - [Working Directory](#working-directory)
  - [Staging Area](#staging-area)
  - [Commit](#commit)
  - [Branch](#branch)
  - [Remote](#remote)
  - [Push & Pull](#push--pull)
  - [Clone & Fork](#clone--fork)
  - [Merge & Conflicts](#merge--conflicts)
- [Installing Git](#installing-git)
- [Configure Git](#configure-git)
- [The Basic Git Workflow](#the-basic-git-workflow)
- [Git Commands You Need](#git-commands-you-need)
  - [git clone](#git-clone)
  - [git status](#git-status)
  - [git branch & switch](#git-branch--switch)
  - [git add](#git-add)
  - [git commit](#git-commit)
  - [git push](#git-push)
  - [git pull](#git-pull)

---

## What is Git?
Git is a distributed version control system.

Imagine that you are working on a project and make changes every day. Instead of keeping messy backup files such as:
*   `project-final`
*   `project-final-new`
*   `project-final-really-final`

Git keeps track of the history of your project for you automatically.

With Git, you can:
*   **Track changes** over time.
*   **Save checkpoints** of your project.
*   **Create separate branches** to experiment safely.
*   **Work collaboratively** with other people.
*   **Go back** to previous versions if you make a mistake.
*   **Combine changes** made by different people seamlessly.

> [!NOTE]
> Git works locally on your computer. Services like **GitHub** and **GitLab** are online platforms that *host* your Git repositories so you can share them with the world.

---

## Important Git Terms
Before using Git, you must understand these core concepts.

### Repository
A repository (or "repo") is the project folder that Git is actively tracking. It contains all your project files, plus a hidden `.git` folder that holds the project's entire history.

### Working Directory
The working directory is the version of the project currently visible on your computer. When you open a file in your editor and make changes, you are modifying the working directory.

### Staging Area
The staging area is a "waiting room". It is where you select the specific changes that you want to include in your next saved checkpoint.

### Commit
A commit is a saved checkpoint in Git. It permanently records a set of changes along with a message explaining what was changed. Think of a commit as saying: *"Save this exact version of my changes."*

### Branch
A branch is a separate line of development. Instead of changing the main project directly, you create your own branch and work there. This allows several contributors to work on different tasks without interfering with each other.
```text
main
 │
 ├── fix-login
 │
 ├── add-navbar
 │
 └── update-documentation
```

### Remote
A remote is a connection between your local repository and a repository stored somewhere online (like GitHub or GitLab). The default remote name is usually `origin`.

### Push & Pull
*   **Push**: Sending your local commits up to the online remote repository.
*   **Pull**: Downloading the latest changes from the remote repository and merging them into your local repository.

### Clone & Fork
*   **Clone**: Downloading a complete Git repository from an online platform directly to your computer.
*   **Fork**: Creating your own personal copy of *someone else's* repository on GitHub/GitLab.

### Merge & Conflicts
*   **Merge**: Combining changes from one branch into another branch.
*   **Merge Conflict**: Happens when Git cannot automatically decide which changes to keep (e.g., if two people modify the exact same line of code). Git will pause and ask you to manually resolve the conflict.

---

## Installing Git
Before starting, you must install Git on your computer. You can download it from [git-scm.com](https://git-scm.com/).

After installation, open your terminal and verify it works:
```bash
git --version
```
*(You should see something like: `git version 2.x.x`)*

---

## Configure Git
Before making your first commit, you need to configure your name and email. This ensures your commits are properly attributed to you.

Open your terminal and run:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
> [!IMPORTANT]
> Make sure to use the exact same email address that is associated with your GitHub/GitLab account!

To check your configuration:
```bash
git config --global --list
```

---

## The Basic Git Workflow
A standard open-source contribution generally follows this exact process:

1. **Clone** the repository.
2. **Create a branch** for your feature.
3. **Make changes** to the code.
4. **Check status** to see what changed.
5. **Stage** the changes (`git add`).
6. **Commit** the changes (`git commit`).
7. **Push** the branch to the remote (`git push`).
8. **Create a Pull Request** (PR) or Merge Request (MR).

---

## Git Commands You Need

### `git clone`
**What does it do?** Downloads a repository to your computer.
```bash
git clone <repository-url>
cd <repository-name>
```

### `git status`
**What does it do?** Shows the current state of your repository. It tells you which files are modified, which are staged, and what branch you are on.
```bash
git status
```
> [!TIP]
> Run `git status` constantly. It is your best friend when figuring out what state your project is in.

### `git branch` & `switch`
**What does it do?** Manages branches.
To list branches:
```bash
git branch
```
To create a new branch and switch to it:
```bash
git switch -c <branch-name>
```

### `git add`
**What does it do?** Moves your changes to the staging area.
To add one specific file:
```bash
git add filename.js
```
To add **all** changed files in the directory:
```bash
git add .
```

### `git commit`
**What does it do?** Creates a checkpoint containing your staged changes.
```bash
git commit -m "Fix login validation"
```
> [!CAUTION]
> **Write Good Commit Messages!** A commit message should clearly describe the change. 
> * Good: `Fix login validation`, `Add mobile navigation`
> * Bad: `changes`, `update`, `fixed stuff`

### `git push`
**What does it do?** Uploads your commits to the remote repository.
```bash
git push origin <branch-name>
```

### `git pull`
**What does it do?** Gets the latest changes from the remote repository.
```bash
git pull origin main
```
