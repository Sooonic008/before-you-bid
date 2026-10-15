import { test } from "node:test";
import assert from "node:assert/strict";
import { analyse, findQuestion, sentences } from "../checker.js";

const S = { skills: ["n8n", "Python", "Clay", "Shopify"], minRate: 40 };

test("regular meetings are a deal-breaker and the sentence is quoted", () => {
  const r = analyse("Wir bauen ein Buchungsportal. Remote mit regelmäßigen Jour-Fixe. Du kennst n8n.", S);
  assert.equal(r.verdict, "skip");
  const f = r.findings.find((x) => x.id === "meetings");
  assert.ok(f && f.quote.includes("Jour-Fixe"));
});

test("occasional meetings only ask to think twice", () => {
  const r = analyse("Wir stimmen uns in gelegentlichen kurzen Terminen ab. n8n und Python.", S);
  assert.equal(r.verdict, "think");
});

test("weekly calls in English are caught", () => {
  assert.equal(analyse("You will join weekly calls with our team.", S).verdict, "skip");
});

test("recruiter wording asks to think twice", () => {
  const r = analyse("Für unseren Kunden suchen wir einen Python Entwickler.", S);
  assert.equal(r.verdict, "think");
  assert.ok(r.findings.some((x) => x.id === "recruiter"));
});

test("unpaid test work is a deal-breaker", () => {
  assert.equal(analyse("Please complete an unpaid test task first.", S).verdict, "skip");
});

test("hourly rate below own minimum is flagged with both numbers", () => {
  const r = analyse("Budget: $15/hour for n8n workflows.", S);
  const f = r.findings.find((x) => x.id === "rate");
  assert.ok(f && f.detail.includes("15") && f.detail.includes("40"));
  assert.equal(r.verdict, "think");
  assert.ok(!analyse("Rate up to 60 EUR per hour.", S).findings.some((x) => x.id === "rate"));
});

test("the application question at the end is surfaced", () => {
  const post = "Lange Beschreibung. Mehr Text. So bewirbst du dich: Wie würdest du für ein einzelnes Zielunternehmen herausfinden, wo unser Produkt hilft? Einloggen & bewerben.";
  assert.match(findQuestion(post), /^Wie würdest du für ein einzelnes Zielunternehmen/);
  assert.match(findQuestion("In your application, please tell us which CRM you used?"), /which CRM you used\?$/);
  assert.equal(findQuestion("We need an n8n expert."), "");
});

test("clean post is apply and lists skill matches", () => {
  const r = analyse("We need an n8n workflow that syncs Shopify orders. Fully remote, async.", S);
  assert.equal(r.verdict, "apply");
  assert.deepEqual(r.skills.matched.sort(), ["Shopify", "n8n"]);
});

test("on-site work is a deal-breaker", () => {
  assert.equal(analyse("Arbeit vor Ort in München, 100% Präsenz.", S).verdict, "skip");
});

test("sentences keep the quote readable", () => {
  assert.deepEqual(sentences("A b. C d? E!"), ["A b.", "C d?", "E!"]);
});
