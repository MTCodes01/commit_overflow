# The GitLab Guide

GitLab is a powerful platform for hosting Git repositories and collaborating on software projects. While very similar to GitHub, it has a few distinct terms and workflows. This guide covers the basics of navigating GitLab for open-source contributions.

## Table of Contents
- [What is GitLab?](#what-is-gitlab)
- [GitLab "Projects" vs Repositories](#gitlab-projects-vs-repositories)
- [What is an Issue?](#what-is-an-issue)
- [How to Find and Raise an Issue](#how-to-find-and-raise-an-issue)
- [Understanding Issue Labels](#understanding-issue-labels)
- [What is a Merge Request?](#what-is-a-merge-request)
- [Creating a Merge Request](#creating-a-merge-request)

---

## What is GitLab?
GitLab is an alternative platform to GitHub for hosting Git repositories.

Because both platforms run on **Git**, all of your terminal commands (`git clone`, `git push`, `git commit`) remain exactly the same! 

The main difference you need to know for Commit Overflow is the terminology:
*   On GitHub, you submit a **Pull Request (PR)**.
*   On GitLab, you submit a **Merge Request (MR)**.

*(They mean the exact same thing!)*

---

## GitLab "Projects" vs Repositories
On GitLab, you will often hear the word **Project** used instead of Repository.

A GitLab Project is more than just code. It can contain:
*   **Source code** (the Git repository).
*   **README** files and documentation.
*   **Issues** (tasks and bugs).
*   **Merge Requests** (proposed code changes).
*   **CI/CD pipelines** (automated testing and deployment workflows).

> [!NOTE]
> When someone says "Check the GitLab Project", they just mean look at the repository on the GitLab website.

---

## What is an Issue?
GitLab Issues work identically to GitHub Issues. They are used to track ideas, enhancements, tasks, or bugs.

An issue may describe:
*   🐛 A bug that needs fixing.
*   ✨ A new feature to add.
*   📚 Documentation work.
*   🧪 Testing tasks.

---

## How to Find and Raise an Issue
Commit Overflow focuses on real-world open source, which means you have to find the problems yourself!

### Steps to raise an issue:
1. **Explore the Project:** Run the project locally or test out its live website. Dig into the codebase.
2. **Find a Problem:** Look for bugs, layout issues, missing documentation, or features that could be improved.
3. **Open the Issues tab** (on the left sidebar) to ensure the problem hasn't already been reported by someone else.
4. **Click "New issue"** and write a detailed description. Include steps to reproduce the bug, screenshots (if applicable), and your proposed solution.
5. **Ask to work on it:** Add a polite note at the bottom stating you would like to be assigned to fix it.

> [!WARNING]
> Never start coding until an issue has been officially reviewed and assigned to you by a maintainer!

---

## Understanding Issue Labels
When a maintainer reviews the issue you just raised, they will evaluate it and add labels.

If your issue is valid, they will add a **Difficulty Label** (e.g., `easy`, `medium`, `hard`).
*   Adding this label officially marks your issue as **Approved**.
*   The automated Commit Overflow system will start your countdown timer based on this difficulty.
*   The maintainer will then assign the issue to you. **Now you can start coding!**

If your issue is invalid (spam or a duplicate), the maintainer will label it as `invalid` or `duplicate` and close it.

---

## What is a Merge Request?
A **Merge Request (MR)** is GitLab's equivalent of a GitHub Pull Request.

It is how you submit your changes for review. When you create an MR, you are asking the maintainers to *merge* your feature branch into the project's main branch.

---

## Creating a Merge Request
After you have written your code, committed it, and pushed it to your forked repository (`git push origin <branch-name>`), you are ready to create an MR.

**Step 1:** Open your forked project on GitLab.
**Step 2:** GitLab usually displays a blue banner at the top saying you pushed to a branch. Click **Create Merge Request**.
*(If you don't see it, click on **Merge requests** in the left sidebar, then click **New merge request**).*
**Step 3:** Select your source branch (the one you pushed) and the target branch (the original project's `main` branch).
**Step 4:** Add a clear, descriptive title.
**Step 5:** Fill out the description thoroughly:
   - Explain your changes.
   - **CRITICAL:** Link the relevant issue (e.g., `Closes #42`). This is required for Commit Overflow to track your points automatically!
   - Add screenshots or testing information if required by the maintainers.
**Step 6:** Click **Create merge request**.

Your mentor or maintainer will then review your code. If they request changes, just commit and push to the *same branch*, and the MR will update automatically!
