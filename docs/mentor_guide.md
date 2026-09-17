# Commit Overflow — Mentor Guide

Welcome to the Commit Overflow Mentor Team! 🚀

As a mentor, your role is to help participants understand open-source contribution, guide them through the workflow, and support them when they face technical difficulties. You are not expected to solve every problem for the participant; your goal is to guide them towards solving problems independently while ensuring they have the support they need.

**Crucially, in Commit Overflow, participants are expected to find and propose their own issues.** Your main job is to evaluate their proposals, approve valid issues by setting a difficulty label, and guide them through the Pull Request process.

## Table of Contents
- [1. Understanding Your Role](#1-understanding-your-role)
- [2. Before the Event](#2-before-the-event)
- [3. Evaluating Participant-Raised Issues](#3-evaluating-participant-raised-issues)
- [4. Issue Difficulty & Approval](#4-issue-difficulty--approval)
- [5. Issue Assignment](#5-issue-assignment)
- [6. Mentor Communication Workflow](#6-mentor-communication-workflow)
- [7. Handling Technical Problems](#7-handling-technical-problems)
- [8. When to Contact Maintainers vs Organisers](#8-when-to-contact-maintainers-vs-organisers)
- [9. Reviewing Contributions](#9-reviewing-contributions)
- [10. Giving Feedback](#10-giving-feedback)
- [11. Handling Unresponsive Participants](#11-handling-unresponsive-participants)
- [12. Mentor Checklist](#12-mentor-checklist)
- [13. The Mentor's Main Goal](#13-the-mentors-main-goal)

---

## 1. Understanding Your Role
Each mentor will be assigned 1–2 participating repositories. You will be responsible for becoming familiar with your assigned repositories and helping participants who choose to contribute to them.

**Your responsibilities include:**
*   Understanding your assigned repository and its architecture.
*   **Evaluating incoming issues** raised by participants.
*   Assigning difficulty labels to approve issues.
*   Guiding participants while they work (Git/GitHub/GitLab workflows).
*   Reviewing PRs/MRs and providing constructive feedback.
*   Coordinating with repository maintainers when necessary.

---

## 2. Before the Event
Before participants begin contributing, mentors should become intimately familiar with their assigned repositories.

**Explore Your Repository:**
Go through the complete repository and understand:
*   What the project does and what problem it solves.
*   The technologies used.
*   How the project is set up and run locally.
*   How contributions are made (`CONTRIBUTING.md`).

> [!NOTE]
> You don't need to know every line of code, but you should have enough understanding to judge whether a participant's proposed bug fix or feature is valid and useful.

---

## 3. Evaluating Participant-Raised Issues
Unlike traditional hackathons, you do not need to prepare a list of "good first issues" before the event. Participants are instructed to explore the repository, find bugs or areas for improvement, and **raise the issue themselves.**

When a participant raises an issue, you must review it:
1.  **Is it a real problem?** Does the bug actually exist? Is the feature actually useful?
2.  **Is it well-documented?** Did the participant explain how to reproduce the bug? Did they propose a clear solution?
3.  **Is it spam or a duplicate?**

> [!WARNING]
> If the issue is low-effort spam or a duplicate of an existing issue, apply the `invalid` or `duplicate` label and close the issue.

---

## 4. Issue Difficulty & Approval
If a participant raises a valid, well-documented issue, it is time to **Approve** it.

You approve an issue by applying a **Difficulty Label**. Adding one of these labels triggers the Commit Overflow backend to officially approve the issue, start the deadline timer, and calculate the potential points.

🟢 **Easy (`easy`)**
Suitable for beginners. Usually involves small code changes, simple bug fixes, documentation improvements, or UI/text changes.

🟡 **Medium (`medium`)**
Requires some understanding of the project. May involve multiple files, moderate code changes, debugging, or writing tests.

🔴 **Hard (`hard`)**
Requires strong technical understanding. May involve major features, significant architectural changes, complex bugs, or API/Database modifications.

---

## 5. Issue Assignment
Once you have applied the difficulty label to approve the issue:
1. **Assign the issue** to the participant who raised it (or whoever claimed it).
2. Leave an encouraging comment letting them know they are approved to start coding!

> [!IMPORTANT]
> **Do not assign multiple contributors to the same issue.** Wait for the assignee's deadline to expire or for them to explicitly give up before reassigning it.

---

## 6. Mentor Communication Workflow

**Step 1 — Participant Identifies a Problem**
They should check the README, issues, and Google first. If stuck, they contact the mentor.

**Step 2 — Participant Contacts the Mentor**
Encourage them to provide enough information:
*   *What are they trying to do?*
*   *What did they try?*
*   *What happened (exact error messages)?*

**Step 3 — Mentor Responds (Understand → Ask → Guide → Verify)**
*   **Understand:** Read carefully.
*   **Ask:** If information is missing, ask for a screenshot or code snippet.
*   **Guide:** Give hints or instructions, not just the final answer.
*   **Verify:** Ask them to try the solution and confirm it worked.

---

## 7. Handling Technical Problems
If the problem is related to Git, GitHub, GitLab, or the development environment, follow this escalation chain:

`Participant → Assigned Mentor → Repository Maintainer → Organising Team`

*   **Git problem:** Mentor handles it.
*   **Repository setup problem:** Mentor handles it (consults Maintainer if necessary).
*   **Event-wide technical problem:** Mentor escalates to Organising Team.

---

## 8. When to Contact Maintainers vs Organisers

**Contact the Maintainer when:**
*   You are unsure if a participant's proposed feature aligns with the project's goals.
*   The participant needs access permissions.
*   The proposed solution could significantly change the project architecture.

**Contact the Organising Team when:**
*   There are participant registration or mentor assignment problems.
*   There are serious communication or Code of Conduct concerns.
*   There are problems with event-wide systems (like the Commit Overflow platform itself).

---

## 9. Reviewing Contributions
When reviewing a PR/MR, check:
*   **Functionality:** Does it solve the issue they originally raised?
*   **Quality:** Is the code clean? Are there unnecessary changes?
*   **Testing:** Did the participant test the changes? Do existing tests pass?
*   **Guidelines:** Does the contribution follow repository rules? Is the PR template completed?

---

## 10. Giving Feedback
Feedback should be: **Specific + Constructive + Respectful**

❌ **Instead of:** *"This isn't good."*
✅ **Say:** *"The functionality works, but this section doesn't handle the error case. Could you add error handling for that case and test it once more?"*

> [!IMPORTANT]
> Instead of fixing everything yourself, explain what needs improvement and allow the participant to make the changes on their branch. This is how they learn!

---

## 11. Handling Unresponsive Participants
If a participant stops responding or misses their automated deadline:
1. Send a polite follow-up on the issue.
2. If the issue remains inactive, you may unassign them so another participant can claim the issue.

*(Do not immediately assume they have abandoned the contribution—they might just be stuck! Always check in first.)*

---

## 12. Mentor Checklist

**Before the Event**
- [ ] Explore assigned repositories and read documentation.
- [ ] Test the repository setup locally.
- [ ] Familiarize yourself with the project's coding standards.

**During the Event**
- [ ] Evaluate incoming issues raised by participants.
- [ ] Label valid issues with `easy`, `medium`, or `hard` to approve them.
- [ ] Label spam/duplicates as `invalid` or `duplicate`.
- [ ] Assign issues.
- [ ] Guide participants through Git and setup.
- [ ] Review PRs/MRs and give constructive feedback.

**After the Event**
- [ ] Confirm the status of all assigned issues and PRs.
- [ ] Record notable participant achievements.

---

## 13. The Mentor's Main Goal

A successful mentor is **not** the person who solves the most problems for participants. A successful mentor is the person who **helps participants learn how to solve those problems themselves.**

Your role throughout Commit Overflow can be summarized as:
`Evaluate → Approve & Label → Guide → Review → Escalate When Necessary → Encourage`

Help participants make their first real-world contribution, understand the process behind it, and leave Commit Overflow with the confidence to contribute to open-source projects independently.

**Happy mentoring! 🚀**
