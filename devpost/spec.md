---
doc: spec
status: approved
---
# Before You Bid — Technical Spec

## How This Works, In Plain Language
A single web page. A small JavaScript file (`checker.js`) holds the rules: each rule is a pattern plus a severity. When the text box changes, the page runs every rule over the post, collects findings with the sentence that matched, and picks the worst severity as the verdict. Nothing leaves the browser. A second small file renders the result.

## The Core Journey Through the System
User pastes text -> `input` event -> `analyse(text, settings)` in `checker.js` splits the post into sentences, runs rules, extracts the application question, matches skills -> returns `{verdict, question, findings[], skills}` -> `render()` fills the cards. PRD ref: `prd.md > The Core Journey`.

## Stack
Plain HTML, CSS and JavaScript (ES modules), no framework, no build step. Tests with Node's built-in test runner (`node --test`, Node 18+). Docs: https://nodejs.org/api/test.html

## Where It Runs and How Someone Tries It
Open `index.html` via any static server (`npx serve .` or GitHub Pages). Tests: `node --test`. Demo video: screen recording of the page with three real-style posts.

## Look and Feel
System font stack, max width 1100px, verdict colours green #1f7a4d, amber #b7791f, red #b42318; quotes in grey blocks.

## Components
### checker.js
`analyse(text, {skills, minRate})`, `sentences(text)`, `findQuestion(text)`, `RULES`. PRD ref: `prd.md > Features and Behavior`.
### app.js
Reads/writes settings in localStorage, listens to input, renders. PRD ref: `prd.md > Screens and Layout`.

## Data Model
Settings `{skills: string[], minRate: number}` in localStorage key `byb-settings`. The post is kept only in memory.

## File Structure
```
job-fit-checker/
├── index.html      # page and styles
├── app.js          # UI: settings, rendering
├── checker.js      # rules and analysis (pure functions)
├── test/checker.test.js
├── devpost/        # scope, prd, spec, checklist
└── README.md
```

## External Services and Dependencies
None.

## Important Failure Modes
- **Post in a language without rules** -> no findings; the page says only German and English are checked.
- **Rate given as a fixed budget, not per hour** -> no rate finding; shown as "budget: fixed price, compare yourself".

## What Was Simplified and Why
- **Pattern rules** instead of an LLM — free, instant, explainable.

## Decisions and Open Issues
Agent decisions under the owner's brief: no LLM, no backend, German+English. Genuine uncertainty: recruiter detection by wording only - mitigated by quoting the trigger so the user can judge.
