# Nordljud Submission Readiness — Private Administrative Checklist

**Owner and sole student:** Ali Khalessi (`alikhalessi`). No student collaborators. This file is an **administrative to-do list, not part of the graded report body**.

## Private repository access (BLOCKER)

The GitHub repository `alikhalessi/nordljud-software-construction` is **private**. The available GitHub connector confirms that status, but it cannot certify whether a particular professor has granted access by organization, team or invitation. The reviewer reports **zero collaborators**. Treat the grader's lack of access as an **unresolved administrative blocker** until they confirm successful opening.

**Do not make the repo public automatically** (it also contains research process materials). The owner may authorize one of these, after confirming the instructor's identity:
- Invite the instructor's exact GitHub handle as a **read-only collaborator**, accept the invitation on their side, then verify they can open the code and CI evidence.
- If collaboration is prohibited or impractical, arrange an instructor-approved **read-only ZIP/release of source plus a PDF of the report and essential CI screenshots**, with stable evidence and no secrets.

**Teacher GitHub username and invitation approval:** not supplied. Neither collaborator access nor visibility has been changed.

## Individual submission approval (BLOCKER IF GROUP REQUIRED)

User confirmed: **Ali Khalessi is the only student**. There are no team members to invent and no grounds for assigning contribution percentages among imaginary students. The rubric summary mentions a team of three, and a separate reviewer states its table expects Student ID / Contribution %. The original full Moodle page was **not provided in the available evidence**.

- **Student ID:** not supplied; the report's 6.2 table uses “not supplied,” which is intentionally not a fabricated number.
- **Contribution %:** Ali = 100% of **student participation**; this is **not** a claim that 100% of code was hand-authored, because ChatGPT produced substantial technical artifacts.
- **Instructor's authorization for individual submission:** not verified. The report does not claim such an authorization or an exception.
- **Instructor confirmation date:** not available.

Once the instructor provides written approval, record the genuine date/route and, where permitted, attach a redacted note. Avoid repeating a “no approval” warning in the report header, README and every section.

## Evidence and missing details for full marking

- [x] Proper attribution of Ali Khalessi, with no invented student collaborators.
- [x] Seven graded sections, three-condition comparison and same-source A/B/C CI audit.
- [x] 21 original/post-release FRs, API and architecture sources in SDD branch.
- [x] Historic SDD exact CLI and generated artifacts recorded; Copilot slash commands not falsely claimed.
- [x] Source code verification, A/B/C Chromium results, reproducible RED/GREEN defects.
- [x] Prompt provenance ledger, separating exact user messages, true agent-facing artifacts, paraphrases and unavailable originals: [PROMPT_PROVENANCE_LEDGER_2026-10-14.md](./PROMPT_PROVENANCE_LEDGER_2026-10-14.md).
- [ ] **Most important content gap:** export/paste initial student-authored Vibe prompts and original SDD requests verbatim; presently not fully present in retrievable records. Do not backfill by invention.
- [ ] Obtain the **actual official Moodle report template**, including headings 2.5/2.6, 4.5 and 7.4, and confirm any exact word/table/diagram/AI-use requirements. The existing `COURSE_RUBRIC_ALIGNMENT.md` is explicitly a summary of earlier learner-shared instructions.
- [ ] Obtain student ID and instructor-approved individual submission rule/exception, if required.
- [ ] Grant and independently verify instructor read access to the private GitHub repo or use an instructor-approved evidence delivery alternative; user consent required.
- [x] **Screenshots durably archived:** workflow [38491787132](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38491787132) copied nine original guest Chromium PNGs from run 38485026386, validated PNG signatures and committed them to [evaluation/screenshots/](../evaluation/screenshots/). All nine files were subsequently verified in GitHub. **Image figures 1–6 are now embedded** in the revised Markdown report.
- [ ] Determine **historical** model identity for each experimental phase from a contemporaneous model-picker screenshot/export if it exists. ChatGPT as the assistant platform is evidenced; a specific historical backend model is not.
- [ ] Review first-person report claims, test matrix and consent/AI disclosure prior to final submission.
- [ ] If the instructor expects issue/PR lifecycle evidence, explain the actual historic use of direct branch commits and CI. Create genuine **prospective** issues/PRs for real unresolved work only, labeled with current date; never retrospectively impersonate 2026-10-12 feature planning or invent team discussion.
- [ ] If producing PDF/DOCX, render Mermaid diagrams as true images, not code fences; the report currently embeds six real PNG screenshots, but it has not been exported to PDF/DOCX.

## Performance timeline interpretation

Git commit metadata supplies objective ordering and timestamps. It does **not** establish keyboard time, meetings, AI runtime, human review duration, or total elapsed working hours. The preregistered timeboxes (A/B 120 minutes, C 180 minutes) were targets, not measured outcomes. Avoid a fictitious speed-up percentage in the report.

## Status

This checklist records what cannot responsibly be declared complete. It must not be quietly deleted to make an unverified submission appear eligible for full marks.
