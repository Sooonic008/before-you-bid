import { analyse } from "./checker.js";

const KEY = "byb-settings";
const $ = (id) => document.getElementById(id);

const TEXT = {
  apply: ["Apply", "No deal-breakers found."],
  think: ["Think twice", "Something here needs a decision before you spend an application."],
  skip: ["Skip", "This post conflicts with how you work."],
};

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function saveSettings(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode: settings just won't persist */
  }
}

function settings() {
  return {
    skills: $("skills").value.split(",").map((s) => s.trim()).filter(Boolean),
    minRate: Number($("rate").value) || 0,
  };
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function render() {
  const post = $("post").value.trim();
  const cards = ["question", "findings", "skills-card"];
  if (!post) {
    $("verdict").className = "verdict v-empty";
    $("verdict").textContent = "Paste a job post to see the verdict.";
    cards.forEach((id) => $(id).classList.add("hidden"));
    return;
  }
  const r = analyse(post, settings());
  const [title, sub] = TEXT[r.verdict];
  $("verdict").className = `verdict v-${r.verdict}`;
  $("verdict").replaceChildren(document.createTextNode(title), el("small", "", sub));

  $("question").classList.toggle("hidden", !r.question);
  $("question-text").textContent = r.question;

  const list = $("findings-list");
  list.replaceChildren();
  for (const f of r.findings) {
    const li = el("li");
    li.append(el("span", `dot s-${f.severity}`), el("strong", "", f.label));
    if (f.detail) li.append(el("div", "", f.detail));
    if (f.quote) li.append(el("blockquote", "", f.quote));
    list.append(li);
  }
  if (!r.findings.length) list.append(el("li", "", "No calls, on-site work, recruiters, unpaid tests or low rates found."));
  $("findings").classList.remove("hidden");

  const tags = $("skill-tags");
  tags.replaceChildren();
  r.skills.matched.forEach((s) => tags.append(el("span", "hit", `✓ ${s}`)));
  r.skills.missing.forEach((s) => tags.append(el("span", "", s)));
  $("skills-card").classList.toggle("hidden", !(r.skills.matched.length + r.skills.missing.length));
}

const saved = loadSettings();
$("skills").value = (saved.skills || []).join(", ");
$("rate").value = saved.minRate || "";
for (const id of ["skills", "rate"]) {
  $(id).addEventListener("input", () => {
    saveSettings(settings());
    render();
  });
}
$("post").addEventListener("input", render);
render();
