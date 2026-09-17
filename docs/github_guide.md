# The GitHub Guide

GitHub is the world's largest platform for open-source software. This guide covers how to navigate GitHub, understand repositories, raise issues, and successfully submit your work through Pull Requests.

## Table of Contents
- [What is GitHub?](#what-is-github)
- [Creating a GitHub Account](#creating-a-github-account)
- [Understanding a GitHub Repository](#understanding-a-github-repository)
- [What is an Issue?](#what-is-an-issue)
- [How to Find and Raise an Issue](#how-to-find-and-raise-an-issue)
- [Understanding Issue Labels](#understanding-issue-labels)
- [What is a Pull Request?](#what-is-a-pull-request)
- [How to Create a Pull Request](#how-to-create-a-pull-request)
- [Pull Request Review](#pull-request-review)

---

## What is GitHub?
GitHub is a cloud-based platform that hosts Git repositories and provides tools for collaboration, code review, and project management. 

While **Git** is the underlying tool running on your computer that tracks your changes, **GitHub** is the website where those repositories are stored so that people from all over the world can collaborate on them.

On GitHub, you will primarily work with:
*   **Repositories:** The projects themselves.
*   **Issues:** Bug reports, feature requests, and tasks.
*   **Forks:** Your personal copies of projects.
*   **Branches:** Parallel versions of the code.
*   **Pull Requests (PRs):** Your proposals to merge your changes into the main project.

---

## Creating a GitHub Account
If you don't already have one, go to [GitHub.com](https://github.com/) and create a free account.

After creating your account, set up your profile:
*   Add your real name (optional, but helpful for networking).
*   Add a professional or fun profile picture.
*   Add a short bio.

> [!IMPORTANT]
> Keep note of your exact GitHub username, as you will need it to register for Commit Overflow and track your points on the leaderboard!

---

## Understanding a GitHub Repository
When you open a repository, you will see a dashboard with several tabs.

### `README.md`
The README is the front page of the project. It explains what the project is, how to install it, how to use it, and how to contribute. **Always read the README before doing anything else.**

### Code
This tab contains all the project's source files, folders, and commit history.

### Issues
This is the "to-do list" of the project. It contains bugs that need fixing, features that need building, and discussions about the project's direction. During Commit Overflow, you will be creating issues here!

### Pull Requests
This tab shows all the proposed changes currently submitted by contributors that are waiting to be reviewed and merged.

### Actions
This contains automated workflows (CI/CD), such as automated tests that run every time someone submits a PR to ensure they didn't break the code.

---

## What is an Issue?
An Issue is a recorded task, problem, suggestion, or piece of work.

**Examples of issues:**
*   `Fix login button not responding on mobile`
*   `Add dark mode toggle`
*   `Typo in installation documentation`
*   `Write unit tests for the authentication module`

An issue usually contains a descriptive **Title**, a detailed **Description**, identifying **Labels**, and an **Assignee** (the person officially working on it).

---

## How to Find and Raise an Issue
Commit Overflow is about real-world open source! Maintainers will not hand you a pre-made list of tasks. You must explore the software, test it, and find areas for improvement.

Follow these steps to find and raise an issue:

1. **Explore the Project:** Clone the repository, read the codebase, run the project locally, or visit its live website.
2. **Find a Problem:** Look for a bug, a missing feature, bad UI layout, or confusing documentation.
3. **Open the Issues tab** and check if someone else has already reported it.
4. **Create a New Issue:** Click the green **New issue** button.
5. **Write a clear report:**
   - **Title:** Be specific (e.g., "Nav menu text overlaps on mobile screens" instead of "Menu is broken").
   - **Description:** Explain exactly how to reproduce the bug, what the expected behavior is, and how you plan to fix it. Include screenshots if it is a visual bug!
6. **Ask for Assignment:** Politely end your issue by stating you would like to work on it.

> [!WARNING]
> Do not start writing code yet! You must wait for a mentor to review your issue, approve it, and assign you.

---

## Understanding Issue Labels
Once a mentor reviews the issue you raised, they will apply labels to it.

Common labels include:
*   `bug`: Something isn't working correctly.
*   `enhancement`: A new feature or request.
*   `invalid` or `duplicate`: The issue is not valid (e.g. spam) or has already been reported.

**Difficulty Labels:**
Most importantly, the mentor will assign a difficulty label (`easy`, `medium`, or `hard`). 
*   Once this label is applied, your issue is **Approved**.
*   The Commit Overflow automated system will start a countdown timer based on the difficulty. You must submit your fix before the deadline!

---

## What is a Pull Request?
A Pull Request (often called a PR) is the mechanism you use to submit your work. 

When you create a PR, you are essentially telling the project maintainers: *"I have made these changes on my copy of the project. Please review them and consider pulling them into your main project."*

A PR allows maintainers to:
*   See exactly which lines of code you added or deleted.
*   Discuss your work and leave line-by-line comments.
*   Request modifications.
*   Approve and merge the contribution.

---

## How to Create a Pull Request

**Step 1:** Push your branch from your local terminal (`git push origin <branch-name>`).

**Step 2:** Open your forked repository on GitHub. You should see a green banner saying your branch had recent pushes. Click **Compare & pull request**.
*(If you don't see the banner, go to the Pull Requests tab and click **New Pull Request**, then select your branch).*

**Step 3:** Ensure the branches are correct. You want to merge *from* your fork/branch *into* the original repository's `main` branch.

**Step 4:** Write a clear title (e.g., `Fix mobile navigation menu`).

**Step 5:** Fill out the description thoroughly. Explain what you changed, why, and how you tested it.

**Step 6:** **LINK YOUR ISSUE!** You must link the issue you solved by typing `Closes #123` (replace 123 with your actual issue number). This tells GitHub to automatically close the issue when your PR is merged, and it is how Commit Overflow knows to award you points!

**Step 7:** Click **Create Pull Request**.

---

## Pull Request Review
After submitting your PR, a maintainer or mentor will review it. 

They may:
*   **Approve it:** Your code is perfect and ready to merge!
*   **Request changes:** They might ask you to fix a bug, change a variable name, or write a test.

This is a completely normal part of software engineering! If changes are requested:
1. Do **not** close the PR and open a new one.
2. Go back to your code editor, make the requested changes.
3. Commit and push the changes to the *same branch*.
4. Your existing PR on GitHub will automatically update with the new code!
