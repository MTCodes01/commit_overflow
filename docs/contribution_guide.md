# Contribution Guide

Now that you understand the basics of open-source version control (Git, GitHub, and GitLab), you are ready to start contributing! Unlike traditional hackathons, **Commit Overflow** is about real-world open source. This means maintainers won't hand you a list of pre-made tasks. You act as both the QA tester and the developer: you must explore the software, find a problem, propose a solution, and then build it!

This guide walks you step-by-step through the standard workflow for making your first contribution.

## Table of Contents
- [Step 1: Choose a Repository](#step-1-choose-a-repository)
- [Step 2: Read the Repository Instructions](#step-2-read-the-repository-instructions)
- [Step 3: Explore and Test](#step-3-explore-and-test)
- [Step 4: Raise an Issue](#step-4-raise-an-issue)
- [Step 5: Get Approved & Assigned](#step-5-get-approved--assigned)
- [Step 6: Fork and Clone](#step-6-fork-and-clone)
- [Step 7: Create a Branch](#step-7-create-a-branch)
- [Step 8: Make Your Changes](#step-8-make-your-changes)
- [Step 9: Test Your Changes](#step-9-test-your-changes)
- [Step 10: Stage and Commit](#step-10-stage-and-commit)
- [Step 11: Push Your Branch](#step-11-push-your-branch)
- [Step 12: Create Your PR / MR](#step-12-create-your-pr--mr)
- [Step 13: Wait for Review](#step-13-wait-for-review)
- [Step 14: Make Requested Changes](#step-14-make-requested-changes)
- [Step 15: Contribution Gets Merged](#step-15-contribution-gets-merged)
- [Important Rules for Contributors](#important-rules-for-contributors)
- [Quick Reference Guides](#quick-reference-guides)

---

## Step 1: Choose a Repository
Explore the repositories participating in Commit Overflow on our [Repositories](#) page.

Choose one based on:
*   Your interests and passions.
*   Your existing skill set.
*   Programming languages you know (or want to learn).

## Step 2: Read the Repository Instructions
Before touching any code, it is vital to read the project's documentation:
*   `README.md`: Explains what the project does.
*   `CONTRIBUTING.md`: Explains how the maintainers want you to contribute.

> [!WARNING]
> Different repositories follow different rules. The repository's own instructions *always* take priority over general guidelines.

## Step 3: Explore and Test
This is where the real engineering starts! You are not just looking for a to-do list; you are looking for ways to improve the software.
*   Run the project locally or visit its hosted website (if applicable).
*   Test the features. Try to break it!
*   Look for bugs (e.g., a button that doesn't work, a page that crashes).
*   Look for UI/UX improvements (e.g., poor contrast, misaligned text).
*   Look for missing documentation or confusing instructions.

## Step 4: Raise an Issue
Once you find a bug or an area for improvement, go to the repository's **Issues** tab and click **New Issue**. 
Write a clear, descriptive report explaining:
1. What the problem is (include screenshots if it's a visual bug).
2. How to reproduce the bug.
3. How you plan to fix it.

> [!TIP]
> Do not start writing code yet! You must wait for the maintainers to confirm that your proposed fix is actually something they want.

## Step 5: Get Approved & Assigned
A mentor or maintainer will review your issue. If they agree it is a valid problem:
*   They will apply a difficulty label (e.g., `easy`, `medium`, `hard`).
*   They will officially **Assign** the issue to you.

> [!IMPORTANT]
> Once the difficulty label is added and you are assigned, **the clock starts!** Commit Overflow's automated system will track your issue and enforce a deadline based on the difficulty. You must submit your Pull Request before the timer runs out!

## Step 6: Fork and Clone
Now that you have the green light, fork the repository (if you haven't already).
Click the **Fork** button on GitHub/GitLab to create your own copy.

Copy the URL of your fork, open your terminal, and clone it to your computer:
```bash
git clone <your-fork-url>
cd <repository-name>
```

## Step 7: Create a Branch
> [!CAUTION]
> Never make your contribution directly on the `main` or `master` branch!

Always create a new branch for your specific feature or fix:
```bash
git switch -c fix-navbar
```

## Step 8: Make Your Changes
Open the code in your favorite editor and start coding!
*   **Keep it focused:** Only change files related to the issue you raised.
*   **Ask for help:** If you get stuck, leave a comment on your issue asking the mentor for guidance.

## Step 9: Test Your Changes
Before submitting your contribution:
*   Run the project locally and verify the issue is actually fixed.
*   Run any available automated tests (e.g., `npm test`).
*   Make sure no unrelated files were modified accidentally by checking `git status` and `git diff`.

## Step 10: Stage and Commit
Stage the files you want to include in your commit:
```bash
git add .
```
Write a clear, descriptive commit message:
```bash
git commit -m "Fix responsive layout for the navigation bar"
```

## Step 11: Push Your Branch
Push your newly created branch up to your forked repository:
```bash
git push origin fix-navbar
```

## Step 12: Create Your PR / MR
*   **GitHub:** Create a Pull Request (PR).
*   **GitLab:** Create a Merge Request (MR).

Go to the original repository. You should see a prompt to compare and create a PR/MR for your recently pushed branch.
**Crucial Step:** In your PR description, you must link to your assigned issue by typing `Closes #123` (where 123 is your issue number). The automated Commit Overflow system relies on this link to award you points!

## Step 13: Wait for Review
Your mentor or the project maintainer will review your code.
You may receive feedback such as:
*   *"Please add a test for this change."*
*   *"This doesn't handle the mobile edge case."*

> [!NOTE]
> Do not take feedback personally! Code review is a standard part of software engineering meant to improve the codebase.

## Step 14: Make Requested Changes
If changes are requested, do **not** create a completely new PR/MR!
Simply make the changes on your local computer on the exact same branch, and then commit and push them:
```bash
git add .
git commit -m "Address review feedback"
git push origin <branch-name>
```
Your existing PR/MR will automatically update with the new changes.

## Step 15: Contribution Gets Merged
Once your mentor/maintainer approves the changes and all tests pass, they will merge your code into the main project.

Commit Overflow's backend will automatically detect the merge, award your points, and update the live leaderboard!

🎉 **Congratulations! You have made a real open-source contribution.**

---

## Important Rules for Contributors

1. **Find Real Problems:** Don't raise spam issues or suggest trivial changes just to earn points. Mentors will mark spam as `invalid` or `duplicate`.
2. **Wait for Approval:** Never submit a Pull Request for an issue that hasn't been approved and assigned to you by a mentor.
3. **Keep Your Contribution Focused:** If you are fixing a button, don't simultaneously redesign the entire website. Create a separate issue for unrelated changes.
4. **Test Before Submitting:** Never submit changes without checking if they actually work.
5. **Ask for Help:** Getting stuck is normal! If you don't understand an error, ask your mentor on the issue thread.

---

## Quick Reference Guides

### Git Commands
```bash
git clone <url>             # Download repository
git status                  # Check modified files
git switch -c <branch>      # Create and switch to new branch
git add .                   # Stage all changes
git commit -m "message"     # Save changes with a message
git push origin <branch>    # Upload branch to remote
git pull                    # Download latest changes from remote
```

### The Commit Overflow Workflow
```text
Explore Repositories & Test Code
     ↓
Find a Bug / Improvement
     ↓
Raise an Issue
     ↓
Wait for Mentor Approval & Label (Clock Starts!)
     ↓
Fork & Clone
     ↓
Branch & Code
     ↓
Test, Commit & Push
     ↓
Create PR/MR (Link the Issue!)
     ↓
Get Review & Make Improvements
     ↓
Get Merged! (Points Awarded Automatically) 🎉
```
