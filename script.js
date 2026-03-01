// =====================================
// PROJECT FILTER
// =====================================
const filterButtons = document.querySelectorAll(".pill");
const cards = document.querySelectorAll(".projectCard");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("isActive"));
    button.classList.add("isActive");

    const filter = button.dataset.filter;

    cards.forEach((card) => {
      const category = card.dataset.cat;
      const shouldShow = filter === "all" || category === filter;

      // better than display for accessibility/layout
      card.hidden = !shouldShow;
    });
  });
});


// =====================================
// THEME TOGGLE (Smooth fade overlay)
// =====================================
const themeToggleEl = document.getElementById("themeToggle");

function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (themeToggleEl) {
    themeToggleEl.setAttribute("aria-checked", String(isDark));
  }
}

// Load saved theme on page load
(function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme === "dark");
})();

// Create overlay once
const themeOverlay = document.createElement("div");
themeOverlay.className = "themeOverlay";
document.body.appendChild(themeOverlay);

function smoothToggleTheme() {
  const goingDark = !document.body.classList.contains("dark");

  themeOverlay.classList.add("isOn");

  window.setTimeout(() => {
    setTheme(goingDark);
    themeOverlay.classList.remove("isOn");
  }, 180);
}

// Click / keyboard
themeToggleEl?.addEventListener("click", smoothToggleTheme);
themeToggleEl?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    smoothToggleTheme();
  }
});


// =====================================
// SCROLL REVEAL
// =====================================
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((el) => revealObserver.observe(el));


// =====================================
// ABOUT SKILLS: fill bars when About enters view
// =====================================
const aboutSection = document.querySelector("#about");
const skillFills = document.querySelectorAll("#about .bar .fill");

function fillSkillBars() {
  document.body.classList.add("skillBarsOn");
  skillFills.forEach((fill) => {
    const level = Number(fill.dataset.level || 0);
    fill.style.width = `${level}%`;
  });
}

if (aboutSection) {
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        fillSkillBars();
        aboutObserver.disconnect();
      });
    },
    { threshold: 0.35 }
  );

  aboutObserver.observe(aboutSection);
}

// Stagger only projects
document.querySelectorAll(".projectsGrid .reveal").forEach((el, i) => {
  el.style.transitionDelay = `${i * 90}ms`;
});