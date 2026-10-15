# Before You Bid

Paste a freelance job post and see in one second whether it is worth one of your limited applications.

- **Verdict:** Apply / Think twice / Skip
- **Deal-breakers with the quoted sentence:** regular calls or meetings, on-site work, unpaid test tasks, recruiters, an hourly rate below your minimum
- **"Answer this first":** the question a client hides at the end of a post ("To apply: how would you ...?")
- **Your skills** found in the post

Runs entirely in the browser. No account, no server, no API key; the post is never stored or sent anywhere. Checks German and English posts.

## Run it

```bash
npx serve .          # or any static server, then open http://localhost:3000
```

## Test it

```bash
node --test          # Node 18+
```

## How it works

`checker.js` holds pattern rules (one per deal-breaker) and runs them sentence by sentence, so every finding can quote its trigger. `app.js` stores your skills and minimum rate in `localStorage` and renders the result on every keystroke.

## Planning documents

Built for Devpost's *Build With AI: Basics* with the Devpost Learn Skill Pack: `devpost/scope.md`, `devpost/prd.md`, `devpost/spec.md`, `devpost/checklist.md`. Built with Claude Code.

## License

MIT
