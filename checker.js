// Before You Bid - rules that decide whether a freelance job post is worth one of your applications.
// Pure functions, no network: the post never leaves the browser.

const SEVERITY = { apply: 0, think: 1, skip: 2 };

// Each rule: id, severity, label shown to the user, pattern (case-insensitive).
export const RULES = [
  {
    id: "meetings",
    severity: "skip",
    label: "Regular calls or meetings required",
    pattern: /(jour[- ]?fixe?s?|regelm(?:ä|ae)(?:ß|ss)ige?n? (?:calls?|meetings?|termine?|telefonate?)|daily[- ]?stand[- ]?ups?|t(?:ä|ae)gliche[sn]? (?:calls?|meetings?)|weekly (?:calls?|meetings?|syncs?)|w(?:ö|oe)chentliche[sn]? (?:calls?|meetings?|termine?)|video[- ]?calls?|zoom calls?|phone (?:calls?|interview)|telefonisch)/i,
  },
  {
    id: "occasional",
    severity: "think",
    label: "Occasional meetings mentioned - offer written updates instead",
    pattern: /(gelegentlich\w* (?:kurze\w* )?(?:termine?n?|calls?|meetings?|abstimmungen?)|occasional (?:short )?(?:calls?|meetings?|syncs?)|kick-?off call)/i,
  },
  {
    id: "onsite",
    severity: "skip",
    label: "On-site work required",
    pattern: /(vor ort|on[- ]site|onsite|in[- ]office|präsenz|praesenz|hybrid \d+ ?tage)/i,
  },
  {
    id: "unpaid",
    severity: "skip",
    label: "Unpaid test work",
    pattern: /(unpaid (?:test|trial|task|sample)|unbezahlte\w* (?:test|probe)\w*|free (?:test|sample) (?:task|work))/i,
  },
  {
    id: "recruiter",
    severity: "think",
    label: "Recruiter or agency - you may never talk to the real client",
    pattern: /(für unseren kunden|fuer unseren kunden|for our client|on behalf of our client|personalvermittl\w*|recruit(?:er|ing agency)|staffing agency|arbeitnehmerüberlassung)/i,
  },
];

export function sentences(text) {
  return (String(text || "").replace(/\s+/g, " ").match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
    .map((s) => s.trim())
    .filter(Boolean);
}

// The question a client hides at the end of a post ("So bewirbst du dich: ...?", "In your application, ...?").
const QUESTION_LEAD = /(so bewirbst du dich|so bewerben sie sich|to apply|in your (?:application|proposal)|please (?:answer|tell us|include)|beantworte\w*|bitte (?:beschreibe|nenne|erkläre))\s*[:,-]?\s*/i;

export function findQuestion(text) {
  const t = String(text || "").replace(/\s+/g, " ");
  const m = QUESTION_LEAD.exec(t);
  if (!m) return "";
  const rest = t.slice(m.index + m[0].length);
  const q = rest.match(/^[^?]{10,600}\?/);
  if (!q) return "";
  return q[0].replace(/^(please|bitte)\s+/i, "").trim().replace(/^\w/, (c) => c.toUpperCase());
}

const RATE = /(?:[$€]|eur|usd)\s?(\d{1,4}(?:[.,]\d{1,2})?)\s?(?:\/|per|pro|je)\s?(?:h\b|hr|hour|stunde)|(\d{1,4}(?:[.,]\d{1,2})?)\s?(?:[$€]|eur|usd)\s?(?:\/|per|pro|je)\s?(?:h\b|hr|hour|stunde)/i;

function hourlyRate(text) {
  const m = RATE.exec(String(text || ""));
  if (!m) return null;
  return Number(String(m[1] || m[2]).replace(",", "."));
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function analyse(text, settings = {}) {
  const skills = (settings.skills || []).map((s) => String(s).trim()).filter(Boolean);
  const minRate = Number(settings.minRate) || 0;
  const parts = sentences(text);
  const findings = [];

  for (const rule of RULES) {
    const hit = parts.find((s) => rule.pattern.test(s));
    if (hit) findings.push({ id: rule.id, severity: rule.severity, label: rule.label, quote: hit });
  }
  // "Occasional" only matters when no hard meeting rule already fired.
  if (findings.some((f) => f.id === "meetings")) {
    const i = findings.findIndex((f) => f.id === "occasional");
    if (i >= 0) findings.splice(i, 1);
  }

  const rate = hourlyRate(text);
  if (rate !== null && minRate && rate < minRate) {
    findings.push({
      id: "rate",
      severity: "think",
      label: "Hourly rate below your minimum",
      detail: `Post offers ${rate}/h, your minimum is ${minRate}/h`,
      quote: parts.find((s) => RATE.test(s)) || "",
    });
  }

  const lower = String(text || "").toLowerCase();
  const matched = skills.filter((s) => new RegExp(`(^|[^a-z0-9])${escapeRe(s.toLowerCase())}([^a-z0-9]|$)`).test(lower));
  const missing = skills.filter((s) => !matched.includes(s));

  const worst = findings.reduce((w, f) => (SEVERITY[f.severity] > SEVERITY[w] ? f.severity : w), "apply");
  return { verdict: worst, question: findQuestion(text), findings, skills: { matched, missing } };
}
