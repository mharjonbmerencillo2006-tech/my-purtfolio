// Add your own projects here (swap the image links for your own)
// category must be: Web, Design, or App
const projects = [
  { img: "https://picsum.photos/id/10/600", title: "Project 1", category: "Web", desc: "A responsive website built with HTML, CSS and JavaScript." },
  { img: "https://picsum.photos/id/20/600", title: "Project 2", category: "Design", desc: "A poster design for a school event." },
  { img: "https://picsum.photos/id/30/600", title: "Project 3", category: "App", desc: "A simple to-do list app." },
  { img: "https://picsum.photos/id/40/600", title: "Project 4", category: "Web", desc: "A landing page for a small business." },
  { img: "https://picsum.photos/id/50/600", title: "Project 5", category: "Design", desc: "A logo and brand colors for a coffee shop." },
  { img: "https://picsum.photos/id/60/600", title: "Project 6", category: "App", desc: "A budget tracker that saves data in the browser." },
  { img: "https://picsum.photos/id/70/600", title: "Project 7", category: "Web", desc: "My first personal blog." },
  { img: "https://picsum.photos/id/80/600", title: "Project 8", category: "Design", desc: "A mobile app mockup." },
  { img: "https://picsum.photos/id/90/600", title: "Project 9", category: "App", desc: "A quiz game with a score counter." }
];

// ---------- Elements ----------
const grid = document.getElementById("grid");
const tabs = document.getElementById("tabs");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalCount = document.getElementById("modal-count");
const likeBtn = document.getElementById("like-btn");
const bigHeart = document.getElementById("big-heart");
const followBtn = document.getElementById("follow-btn");
const followers = document.getElementById("followers");
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

// ---------- State ----------
let filter = "All";
let visible = projects; // the projects currently shown in the grid
let current = 0;        // position inside "visible"
let liked = load("liked", []); // list of liked project numbers
let following = load("following", false);
let theme = load("theme", null);

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

// ---------- Follow button ----------
function showFollow() {
  followBtn.textContent = following ? "Following" : "Follow";
  followBtn.classList.toggle("following", following);
  followers.textContent = following ? 1201 : 1200;
}

followBtn.addEventListener("click", function () {
  following = !following;
  save("following", following);
  showFollow();
});

// ---------- Grid ----------
function renderGrid() {
  visible = projects.filter(function (project) {
    return filter === "All" || project.category === filter;
  });

  grid.innerHTML = "";

  visible.forEach(function (project, index) {
    const number = projects.indexOf(project);

    const post = document.createElement("div");
    post.className = "post";
    post.dataset.number = number;
    post.classList.toggle("liked", liked.includes(number));
    post.style.animationDelay = index * 0.07 + "s";

    const img = document.createElement("img");
    img.src = project.img;
    img.alt = project.title;
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = "<span>" + project.title + "</span><small>" + project.category + "</small>";

    const heart = document.createElement("span");
    heart.className = "heart-badge";
    heart.textContent = "♥";

    post.appendChild(img);
    post.appendChild(overlay);
    post.appendChild(heart);

    post.addEventListener("click", function () {
      openModal(index);
    });

    grid.appendChild(post);
  });
}

// Tabs: filter the grid
tabs.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  tabs.querySelectorAll("button").forEach(function (item) {
    item.classList.remove("active");
  });
  button.classList.add("active");

  filter = button.dataset.filter;
  renderGrid();
});

// ---------- Popup ----------
function showProject(index) {
  // Loop around: after the last one comes the first
  current = (index + visible.length) % visible.length;

  const project = visible[current];
  const number = projects.indexOf(project);
  const isLiked = liked.includes(number);

  modalImg.src = project.img;
  modalImg.alt = project.title;
  modalTitle.textContent = project.title;
  modalDesc.textContent = project.desc;
  modalCount.textContent = project.category + " • " + (current + 1) + " of " + visible.length;

  likeBtn.textContent = isLiked ? "♥" : "♡";
  likeBtn.classList.toggle("liked", isLiked);
}

function openModal(index) {
  showProject(index);
  modal.classList.add("open");
  document.body.style.overflow = "hidden"; // stop the page from scrolling behind
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

function toggleLike() {
  const number = projects.indexOf(visible[current]);

  if (liked.includes(number)) {
    liked = liked.filter(function (item) {
      return item !== number;
    });
  } else {
    liked.push(number);
  }

  save("liked", liked);
  showProject(current);

  // Update the heart on the grid picture
  const post = grid.querySelector('[data-number="' + number + '"]');
  if (post) post.classList.toggle("liked", liked.includes(number));
}

// Double-click the picture: like it and show a big heart
modalImg.addEventListener("dblclick", function () {
  const number = projects.indexOf(visible[current]);
  if (!liked.includes(number)) toggleLike();

  bigHeart.classList.remove("pop");
  void bigHeart.offsetWidth; // restarts the animation
  bigHeart.classList.add("pop");
});

likeBtn.addEventListener("click", toggleLike);
document.getElementById("close-btn").addEventListener("click", closeModal);
document.getElementById("prev-btn").addEventListener("click", function () {
  showProject(current - 1);
});
document.getElementById("next-btn").addEventListener("click", function () {
  showProject(current + 1);
});

// Click the dark background to close
modal.addEventListener("click", function (event) {
  if (event.target === modal) closeModal();
});

// Keyboard controls
document.addEventListener("keydown", function (event) {
  if (!modal.classList.contains("open")) return;

  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") showProject(current - 1);
  if (event.key === "ArrowRight") showProject(current + 1);
});

// ---------- Start ----------
document.getElementById("project-count").textContent = projects.length;
document.getElementById("year").textContent = new Date().getFullYear();
applyTheme();
showFollow();
renderGrid();
