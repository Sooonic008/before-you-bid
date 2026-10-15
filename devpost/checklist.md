---
doc: checklist
status: approved
---
# Build Checklist

Build mode: fast (owner's standing brief)

## Slices

- [x] **1. Paste a post and see a verdict with quoted findings**
  Becomes usable: rules for meetings, on-site, unpaid tests, recruiters; verdict card; findings with quotes.
  PRD ref: `prd.md > The Core Journey` · Spec ref: `spec.md > Components`
  Verify (mechanical): `node --test` - 10/10 pass.
  Commit: `Checker rules and one-page UI`
- [x] **2. Rate check, skills and the hidden application question**
  Becomes usable: minimum rate and skills saved in the browser; "Answer this first" card.
  Verify (mechanical): tests for rate, skills, question; demo run with three posts -> Skip, Think twice (+question), Apply.

## Hands-on Checkpoints
- [x] Early usable behavior explored - browser run recorded on 15.10.2026 (demo video)
- [x] Final kick-the-tires exploration - three posts, verdicts as expected

## Final Review
- [x] Final review complete

## Code Tour and App Map
`index.html` (layout, styles) -> `app.js` (settings in localStorage, render on input) -> `checker.js` (`analyse()`: sentences -> rules -> rate -> skills -> question) -> `test/checker.test.js`.
