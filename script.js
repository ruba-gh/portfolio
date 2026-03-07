/* =========================================================
   PORTFOLIO SCRIPT (clean + data-driven)
   Requires:
   - i18n-data.js  -> window.TRANSLATIONS
   - projects-data.js -> window.PROJECTS
   HTML:
   - <div class="projectsGrid" id="projectsGrid"></div>
========================================================= */

/* =========================
   PROJECTS: RENDER FROM DATA
========================= */
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  const projects = window.PROJECTS || [];
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (p) => `
    <a class="projectCard reveal projectCardLink"
       href="project.html?id=${p.id}"
       data-delay="${p.delay ?? 1}"
       data-cat="${p.cat ?? "all"}">
      <div class="cardTop">
        <img class="projectImg"
             src="${p.img}"
             data-i18n-attr="alt:${p.altKey}" />
      </div>

      <div class="cardBar">
        <div class="cardInfo">
          <h3 class="cardTitle" data-i18n="${p.titleKey}"></h3>
          <p class="cardDesc" data-i18n="${p.descKey}"></p>
        </div>
      </div>
    </a>
  `
    )
    .join("");
}

/* =========================
   PROJECT FILTER
========================= */
function initProjectFilter() {
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
        card.hidden = !shouldShow;
      });
    });
  });
}

/* =========================
   THEME TOGGLE (Smooth fade overlay)
========================= */
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

/* =========================
   SCROLL REVEAL
   (Run AFTER projects are rendered)
========================= */
function initScrollReveal() {
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
}

/* =========================
   ABOUT SKILLS: fill bars when About enters view
========================= */
function initSkillBars() {
  const aboutSection = document.querySelector("#about");
  const skillFills = document.querySelectorAll("#about .bar .fill");

  function fillSkillBars() {
    document.body.classList.add("skillBarsOn");
    skillFills.forEach((fill) => {
      const level = Number(fill.dataset.level || 0);
      fill.style.width = `${level}%`;
    });
  }

  if (!aboutSection) return;

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

/* =========================
   PROJECT STAGGER (CSS delay)
   (Run AFTER projects are rendered)
========================= */
function initProjectStagger() {
  document.querySelectorAll(".projectsGrid .reveal").forEach((el, i) => {
    el.style.transitionDelay = `${i * 90}ms`;
  });
}

/* =========================
   LANGUAGE TOGGLE (EN ↔ AR)
   Uses: window.TRANSLATIONS
========================= */
const langToggle = document.getElementById("langToggle");
const translations = window.TRANSLATIONS || {};

function applyTranslations(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  // Text translation
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = translations?.[lang]?.[key];
    if (!value) return;

    if (el.tagName === "TITLE") {
      document.title = value;
    } else {
      el.textContent = value;
    }
  });

  // Attribute translation
  // Usage: data-i18n-attr="alt:some.key" OR "alt:key1 | aria-label:key2"
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const raw = el.dataset.i18nAttr;
    if (!raw) return;

    const pairs = raw.split("|").map((s) => s.trim());
    pairs.forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (!attr || !key) return;

      const value = translations?.[lang]?.[key];
      if (!value) return;

      el.setAttribute(attr, value);
    });
  });

  if (langToggle) langToggle.textContent = lang === "ar" ? "EN" : "AR";
  localStorage.setItem("lang", lang);
}

function initLanguage() {
  const saved = localStorage.getItem("lang") || "en";
  applyTranslations(saved);

  langToggle?.addEventListener("click", () => {
    const next = document.documentElement.lang === "en" ? "ar" : "en";
    applyTranslations(next);
  });
}

/* =========================
   BOOTSTRAP (order matters)
========================= */
(function initApp() {
  // 1) Render projects first (creates .projectCard + i18n attrs)
  renderProjects();

  // 2) Then translate (so newly created DOM gets text/alt)
  initLanguage();

  // 3) Now that cards exist, attach filter handlers
  initProjectFilter();

  // 4) Stagger delays for reveal animations
  initProjectStagger();

  // 5) Reveal observer after everything is in the DOM
  initScrollReveal();

  // 6) Skill bars observer
  initSkillBars();
})();