const CATEGORIES = ["Salary", "Freelance", "Business", "Gift", "Other"];

const $ = id => document.getElementById(id);
const esc = t => t.replace(/[&<>"]/g, c => "&#" + c.charCodeAt(0) + ";");
const peso = n => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

let items = JSON.parse(localStorage.incomeItems || "[]");
let dark = localStorage.incomeDark === "1";

const save = () => localStorage.incomeItems = JSON.stringify(items);

// Build the form
$("form").innerHTML =
  '<input id="source" placeholder="Source (e.g. Client A)" required>' +
  '<input id="amount" type="number" min="0.01" step="0.01" placeholder="Amount" required>' +
  '<select id="category">' + CATEGORIES.map(c => `<option>${c}</option>`).join("") + "</select>" +
  '<input id="date" type="date" required>' +
  "<button>Add</button>";
$("date").value = today();

// Add income
$("form").onsubmit = e => {
  e.preventDefault();
  items.push({
    id: Date.now(),
    source: $("source").value.trim(),
    amount: Number($("amount").value),
    category: $("category").value,
    date: $("date").value
  });
  save();
  e.target.reset();
  $("date").value = today();
  render();
};

// Delete one
$("body").onclick = e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;
  items = items.filter(i => i.id !== id);
  save();
  render();
};

// Clear all
$("clear").onclick = () => {
  if (items.length && confirm("Delete all income?")) {
    items = [];
    save();
    render();
  }
};

function render() {
  const q = $("search").value.toLowerCase();
  const sort = $("sort").value;
  const list = items.filter(i => i.source.toLowerCase().includes(q));

  if (sort === "high") list.sort((a, b) => b.amount - a.amount);
  else if (sort === "low") list.sort((a, b) => a.amount - b.amount);
  else list.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  $("body").innerHTML = list.map(i =>
    `<tr><td>${esc(i.source)}</td><td>${i.category}</td><td>${i.date}</td>` +
    `<td>${peso(i.amount)}</td><td><button data-id="${i.id}">🗑</button></td></tr>`
  ).join("");

  $("empty").hidden = list.length > 0;

  // Summary cards
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const month = items.filter(i => i.date.slice(0, 7) === today().slice(0, 7))
                     .reduce((sum, i) => sum + i.amount, 0);

  const byCategory = {};
  items.forEach(i => byCategory[i.category] = (byCategory[i.category] || 0) + i.amount);
  const top = Object.keys(byCategory).sort((a, b) => byCategory[b] - byCategory[a])[0] || "-";

  $("stats").innerHTML = [
    ["Total Income", peso(total)],
    ["This Month", peso(month)],
    ["Average", peso(items.length ? total / items.length : 0)],
    ["Top Category", top]
  ].map(([label, value]) => `<div><small>${label}</small><b>${value}</b></div>`).join("");
}

// Dark mode
function theme() {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("theme").textContent = dark ? "☀️" : "🌙";
}

$("theme").onclick = () => {
  dark = !dark;
  localStorage.incomeDark = dark ? 1 : 0;
  theme();
};

$("search").oninput = render;
$("sort").onchange = render;

theme();
render();