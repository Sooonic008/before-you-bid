---
doc: prd
status: approved
---
# Before You Bid — Product Requirements

A one-page checker for solo freelancers who work in writing: paste a job post, see whether it is worth one of your limited applications. Source: `scope.md > The Unique Kernel`.

## The Core Journey
1. Open `index.html` in a browser (or the hosted page).
2. First use: enter your skills (comma separated) and your minimum hourly rate; they are remembered in the browser.
3. Paste a job post into the big text box.
4. Within a second, without clicking, the verdict appears: **Apply** (green), **Think twice** (amber) or **Skip** (red).
5. Below the verdict: "Answer this first" (the client's application question, if any), then each finding with the quoted sentence that triggered it, then matching and missing skills.
6. Copy the question, write the proposal, paste the next post.

## Screens and Layout
One screen, two columns on desktop, stacked on mobile: left = settings (skills, rate) and the post text box; right = verdict card, question card, findings list, skills.

## Look and Feel
Quiet and readable: system font, off-white background, one accent colour per verdict, findings as a list with the quoted trigger in a grey quote block. No animations.

## Features and Behavior
- As a freelancer who only works in writing, I want posts that require regular calls or meetings flagged, so that I don't waste an application.
  - [ ] "regelmäßiger Jour-Fixe", "weekly calls", "daily stand-up", "video call" -> Skip, with the sentence quoted.
  - [ ] "occasional short meetings" / "gelegentliche Termine" -> Think twice, not Skip.
- As a freelancer, I want recruiters and unpaid tests flagged.
  - [ ] Recruiter/agency wording or a known agency name -> Think twice; "unpaid test task" -> Skip.
- As a freelancer, I want a budget below my rate flagged.
  - [ ] Hourly rate in the post below my minimum -> Think twice, with both numbers shown.
- As a freelancer, I want the client's question surfaced.
  - [ ] Text after "So bewirbst du dich", "To apply", "In your application", "Please answer" ending in "?" -> shown under "Answer this first".
- As a freelancer, I want to see which of my skills the post asks for.
  - [ ] Each of my skills found in the post is listed as a match.

## States and Boundaries
- **Empty** — prompt to paste a post; settings visible.
- **No findings** — verdict Apply, with "no deal-breakers found" and the skill matches.
- **Persistence** — skills and rate in localStorage only; the post text is never stored or sent anywhere.

## Product Decisions (made by the agent under the owner's standing brief)
- Rules instead of an LLM — instant, free, offline, and every finding can quote its trigger.
- Quote the exact sentence — trust comes from seeing why.

## What We're Building
The single page with the rules above, German and English, tests for every rule.

## Deferred From the POC
Browser extension on job boards; saved history of checked posts.

## Non-Goals
No scraping, no account, no server, no AI-written proposals.

## Open Questions
None blocking.
