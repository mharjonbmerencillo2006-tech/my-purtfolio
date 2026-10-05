// Add your own projects here (swap the image links for your own)
const projects = [
  { img: "https://picsum.photos/id/10/600", caption: "Project 1" },
  { img: "https://picsum.photos/id/20/600", caption: "Project 2" },
  { img: "https://picsum.photos/id/30/600", caption: "Project 3" },
  { img: "https://picsum.photos/id/40/600", caption: "Project 4" },
  { img: "https://picsum.photos/id/50/600", caption: "Project 5" },
  { img: "https://picsum.photos/id/60/600", caption: "Project 6" },
  { img: "https://picsum.photos/id/70/600", caption: "Project 7" },
  { img: "https://picsum.photos/id/80/600", caption: "Project 8" },
  { img: "https://picsum.photos/id/90/600", caption: "Project 9" }
];

const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");

let current = 0;

// Liked projects are saved in the browser, so they stay after a refresh
let liked = [];
try {
  liked = JSON.parse(localStorage.getItem("liked")) || [];
} catch (error) {
  liked = [];
}

// Create the buttons inside the popup
function makeButton(className, text) {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = text;
  modal.appendChild(button);
  return button;
}

const closeBtn = makeButton("close", "✕");
const prevBtn = makeButton("prev", "‹");
const nextBtn = makeButton("next", "›");
const likeBtn = makeButton("like", "♡");

// Build the grid
projects.forEach(function (project, index) {
  const img = document.createElement("img");
  img.src = project.img;
  img.alt = project.caption;
  img.loading = "lazy";

  img.addEventListener("click", function () {
    openModal(index);
  });

  grid.appendChild(img);
});

// Show the popup for one project
function showProject(index) {
  // Loop around: after the last project comes the first
  current = (index + projects.length) % projects.length;

  modalImg.src = projects[current].img;
  modalImg.alt = projects[current].caption;
  modalCaption.textContent =
    projects[current].caption + "  (" + (current + 1) + "/" + projects.length + ")";

  const isLiked = liked.includes(current);
  likeBtn.textContent = isLiked ? "♥" : "♡";
  likeBtn.classList.toggle("liked", isLiked);
}

function openModal(index) {
  showProject(index);
  modal.classList.add("open");
  document.body.style.overflow = "hidden"; // stop the page from scrolling behind
}

function closeModal() {}
