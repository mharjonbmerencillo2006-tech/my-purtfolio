const PASSING = 75; // lowest passing average

// ---------- Elements ----------
const form = document.getElementById("form");
const errorText = document.getElementById("error");
const tbody = document.getElementById("tbody");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const clearBtn = document.getElementById("clear-btn");
const themeBtn = document.getElementById("theme-btn");

// ---------- Saving data in the browser ----------
function load(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Saving failed, everything still works until you refresh
  }
}

let students = load("students", []);
let theme = load("theme", null);

// ---------- Grade calculations ----------
function getAverage(student) {
  const total = student.math + student.science + student.english + student.programming;
  return Math.round((total / 4) * 100) / 100;
}

function getLetter(average) {
  if (average >= 90) return "A";
  if (average >= 85) return "B";
  if (average >= 80) return "C";
  if (average >= 75) return "D";
  return "F";
}

// ---------- Dark mode ----------
if (!theme) {
  theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

themeBtn.addEventListener("click", function () {
  theme = theme === "dark" ? "light" : "dark";
  save("theme", theme);
  applyTheme();
});

// ---------- Add a student ----------
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const student = {
    id: Date.now(),
    name: document.getElementById("name").value.trim(),
    math: Number(document.getElementById("math").value),
    science: Number(document.getElementById("science").value),
    english: Number(document.getElementById("english").value),
    programming: Number(document.getElementById("programming").value)
  };

  // Check the grades are between 0 and 100
  const grades = [student.math, student.science, student.english, student.programming];
  const invalid = grades.some(function (grade) {
    return grade < 0 || grade > 100;
  });

  if (student.name === "") {
    errorText.textContent = "Please enter a name.";
    return;
  }

  if (invalid) {
    errorText.textContent = "Grades must be from 0 to 100.";
    return;
  }

  errorText.textContent = "";
  students.push(student);
  save("students", students);
  form.reset();
  render();
});

// ---------- Delete and clear ----------
function deleteStudent(id) {
  students = students.filter(function (student) {
    return student.id !== id;
  });
  save("students", students);
  render();
}

clearBtn.addEventListener("click", function () {
  if (students.length === 0) return;

  if (confirm("Delete all students?")) {
    students = [];
    save("students", students);
    render();
  }
});

// ---------- Table ----------
function makeCell(text, className) {
  const td = document.createElement("td");
  td.textContent = text; // textContent keeps names safe
  if (className) td.className = className;
  return td;
}

function render() {
  // Search
  const text = searchInput.value.toLowerCase();
  const list = students.filter(function (student) {
    return student.name.toLowerCase().includes(text);
  });

  // Sort
  const sort = sortSelect.value;
  if (sort === "name") {
    list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  } else if (sort === "high") {
    list.sort(function (a, b) { return getAverage(b) - getAverage(a); });
  } else if (sort === "low") {
    list.sort(function (a, b) { return getAverage(a) - getAverage(b); });
  } else {
    list.reverse(); // newest first
  }

  // Draw rows
  tbody.innerHTML = "";

  list.forEach(function (student) {
    const average = getAverage(student);
    const passed = average >= PASSING;
    const row = document.createElement("tr");

    row.appendChild(makeCell(student.name));

    ["math", "science", "english", "programming"].forEach(function (subject) {
      const grade = student[subject];
      row.appendChild(makeCell(grade, grade < PASSING ? "low" : ""));
    });

    row.appendChild(makeCell(average.toFixed(2), "avg"));
    row.appendChild(makeCell(getLetter(average)));

    const remarkCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + (passed ? "passed" : "failed");
    badge.textContent = passed ? "Passed" : "Failed";
    remarkCell.appendChild(badge);
    row.appendChild(remarkCell);

    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "🗑";
    deleteBtn.title = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteStudent(student.id);
    });
    deleteCell.appendChild(deleteBtn);
    row.appendChild(deleteCell);

    tbody.appendChild(row);
  });

  empty.style.display = list.length === 0 ? "block" : "none";
  updateSummary();
}

// ---------- Summary cards ----------
function updateSummary() {
  document.getElementById("total").textContent = students.length;

  if (students.length === 0) {
    document.getElementById("class-avg").textContent = "0";
    document.getElementById("top").textContent = "-";
    document.getElementById("pass-fail").textContent = "0 / 0";
    return;
  }

  let sum = 0;
  let passed = 0;
  let best = students[0];

  students.forEach(function (student) {
    const average = getAverage(student);
    sum += average;
    if (average >= PASSING) passed++;
    if (average > getAverage(best)) best = student;
  });

  document.getElementById("class-avg").textContent = (sum / students.length).toFixed(2);
  document.getElementById("top").textContent = best.name;
  document.getElementById("pass-fail").textContent = passed + " / " + (students.length - passed);
}

// ---------- Start ----------
searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);

applyTheme();
render();