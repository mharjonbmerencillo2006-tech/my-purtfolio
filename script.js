const SUBJECTS = ["Math", "Science", "English", "Programming"];
const PASSING = 75;

const $ = id => document.getElementById(id);
const esc = t => t.replace(/[&<>"]/g, c => "&#" + c.charCodeAt(0) + ";");
const avg = s => s.grades.reduce((a, b) => a + b, 0) / s.grades.length;
const letter = a => a >= 90 ? "A" : a >= 85 ? "B" : a >= 80 ? "C" : a >= 75 ? "D" : "F";

let students = JSON.parse(localStorage.gradingStudents || "[]");
let dark = localStorage.gradingDark === "1";

const save = () => localStorage.gradingStudents = JSON.stringify(students);

// Build the form and table header from the SUBJECTS list
$("form").innerHTML =
  '<input id="name" placeholder="Student name" required>' +
  SUBJECTS.map(s => `<input type="number" min="0" max="100" placeholder="${s}" required>`).join("") +
  "<button>Add</button>";

$("head").innerHTML =
  "<tr><th>Name</th>" + SUBJECTS.map(s => `<th>${s}</th>`).join("") +
  "<th>Average</th><th>Grade</th><th>Remark</th><th></th></tr>";

// Add a student
$("form").onsubmit = e => {
  e.preventDefault();
  const grades = [...$("form").querySelectorAll("input[type=number]")].map(i => Number(i.value));
  students.push({ id: Date.now(), name: $("name").value.trim(), grades });
  save();
  e.target.reset();
  render();
};

function remove(id) {
  students = students.filter(s => s.id !== id);
  save();
  render();
}

$("clear").onclick = () => {
  if (students.length && confirm("Delete all students?")) {
    students = [];
    save();
    render();
  }
};

function render() {
  const q = $("search").value.toLowerCase();
  const sort = $("sort").value;
  const list = students.filter(s => s.name.toLowerCase().includes(q));

  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "high") list.sort((a, b) => avg(b) - avg(a));
  else if (sort === "low") list.sort((a, b) => avg(a) - avg(b));
  else list.reverse();

  $("body").innerHTML = list.map(s => {
    const a = avg(s);
    const ok = a >= PASSING;
    return `<tr><td>${esc(s.name)}</td>` +
      s.grades.map(g => `<td class="${g < PASSING ? "low" : ""}">${g}</td>`).join("") +
      `<td><b>${a.toFixed(2)}</b></td><td>${letter(a)}</td>` +
      `<td><span class="badge ${ok ? "pass" : "fail"}">${ok ? "Passed" : "Failed"}</span></td>` +
      `<td><button onclick="remove(${s.id})">🗑</button></td></tr>`;
  }).join("");

  $("empty").hidden = list.length > 0;

  // Summary cards
  const n = students.length;
  const avgs = students.map(avg);
  const passed = avgs.filter(a => a >= PASSING).length;
  const top = n ? students[avgs.indexOf(Math.max(...avgs))].name : "-";
  const classAvg = n ? (avgs.reduce((a, b) => a + b, 0) / n).toFixed(2) : 0;

  $("stats").innerHTML = [
    ["Students", n],
    ["Class Average", classAvg],
    ["Top Student", esc(top)],
    ["Passed / Failed", passed + " / " + (n - passed)]
  ].map(([label, value]) => `<div><small>${label}</small><b>${value}</b></div>`).join("");
}

// Dark mode
function theme() {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("theme").textContent = dark ? "☀️" : "🌙";
}

$("theme").onclick = () => {
  dark = !dark;
  localStorage.gradingDark = dark ? 1 : 0;
  theme();
};

$("search").oninput = render;
$("sort").onchange = render;

theme();
render();