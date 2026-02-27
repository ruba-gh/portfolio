// =====================================
// PROJECT FILTER
// =====================================

const filterButtons = document.querySelectorAll(".pill");
const cards = document.querySelectorAll(".projectCard");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("isActive"));
    button.classList.add("isActive");

    const filter = button.dataset.filter;

    cards.forEach(card => {
      const category = card.dataset.cat;
      const shouldShow = filter === "all" || category === filter;
      card.style.display = shouldShow ? "block" : "none";
    });
  });
});


// =====================================
// THEME TOGGLE (Smooth fade overlay)
// =====================================

const lamp = document.getElementById("themeLamp");
const toggleWrap = document.getElementById("themeToggle");

// Use ONE toggle element (avoid double toggle)
const themeToggleEl = lamp || toggleWrap;

function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Load saved theme on page load
(function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme === "dark");
})();

// Create a single overlay once (for smooth transition)
const themeOverlay = document.createElement("div");
themeOverlay.className = "themeOverlay";
document.body.appendChild(themeOverlay);

function smoothToggleTheme() {
  const goingDark = !document.body.classList.contains("dark");

  // Start fade in
  themeOverlay.classList.add("isOn");

  // Switch theme at peak fade (so eyes don't catch the flash)
  window.setTimeout(() => {
    setTheme(goingDark);

    // Fade out
    themeOverlay.classList.remove("isOn");
  }, 180);
}

// Click / keyboard toggle
themeToggleEl?.addEventListener("click", smoothToggleTheme);

themeToggleEl?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    smoothToggleTheme();
  }
});


// =====================================
// SCROLL REVEAL + STAGGER
// =====================================
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.18 });

revealElements.forEach((el) => revealObserver.observe(el));


// =====================================
// ABOUT SKILLS: fill bars when About enters view
// =====================================
const aboutSection = document.querySelector("#about");
const skillFills = document.querySelectorAll("#about .bar .fill");

function fillSkillBars() {
  // add class to enable shine animation (optional)
  document.body.classList.add("skillBarsOn");

  skillFills.forEach((fill) => {
    const level = Number(fill.dataset.level || 0); // 0-100
    fill.style.width = `${level}%`;
  });
}

if (aboutSection) {
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      fillSkillBars();
      aboutObserver.disconnect();
    });
  }, { threshold: 0.35 });

  aboutObserver.observe(aboutSection);
}

document.querySelectorAll(".projectsGrid .reveal").forEach((el, i) => {
  el.style.transitionDelay = `${i * 90}ms`;
});