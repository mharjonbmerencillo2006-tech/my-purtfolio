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

// Build the grid
projects.forEach(function (project) {
  const img = document.createElement("img");
  img.src = project.img;
  img.alt = project.caption;

  img.addEventListener("click", function () {
    modalImg.src = project.img;
    modalCaption.textContent = project.caption;
    modal.classList.add("open");
  });

  grid.appendChild(img);
});

// Click anywhere on the popup to close it
modal.addEventListener("click", function () {
  modal.classList.remove("open");
});