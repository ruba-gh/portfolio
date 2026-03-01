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

// =====================================
// LANGUAGE TOGGLE (EN ↔ AR)
// =====================================
const translations = {
  en: {
    // meta
    "meta.title": "Ruba's Portfolio",

    // nav
    "nav.home": "Home",
    "nav.about": "About",
    "nav.projects": "Projects",

    // hero
    "hero.hi": "Hi I am",
    "hero.name": "Ruba Alghamdi",
    "hero.titleTop": "UI & UX",
    "hero.titleBottom": "Designer",
    "hero.desc":
      "I design clean, friendly digital experiences and bring them to life with front-end code. I care about accessibility, smooth interactions, and modern web/app UI.",
    "hero.toggleHint": "Tap to switch theme",

    // about
    "about.title": "About Me",
    "about.text":
      "I’m Ruba, a Computer Science graduate based in Saudi Arabia. I work across UI/UX, prototyping, and front-end implementation. I enjoy building calm, clear experiences.",
    "about.cv": "Download CV",

    // skills
    "skills.uiux": "UX / UI",
    "skills.web": "Web Developer",
    "skills.app": "App Design",
    "skills.graphic": "Graphic Design",

    // projects
    "projects.title": "My Projects",
    "projects.sub": "Selected work across UI/UX, app concepts, and visual systems.",
    "projects.filter.all": "All",
    "projects.filter.web": "Web",
    "projects.filter.app": "App",

    "projects.cards.p1.title": "Login/Signup",
    "projects.cards.p1.desc": "Login screens + onboarding concept.",
    "projects.cards.p2.title": "Card Match Game",
    "projects.cards.p2.desc": "Minimal card matching game UI.",
    "projects.cards.p3.title": "Bakery App",
    "projects.cards.p3.desc": "Creative Bakery app UX/UI.",

    // footer
    "footer.name": "Ruba Alghamdi"
  },

  ar: {
    // meta
    "meta.title": "ملف أعمال ربى",

    // nav
    "nav.home": "الرئيسية",
    "nav.about": "نبذة عني",
    "nav.projects": "المشاريع",

    // hero
    "hero.hi": "مرحباً، أنا",
    "hero.name": "ربى الغامدي",     // إذا تبين الاسم يبقى إنجليزي: خليها "Ruba Alghamdi"
    "hero.titleTop": "UI & UX",
    "hero.titleBottom": "مصممة",
    "hero.desc":
      "أصمم تجارب رقمية بسيطة وودية وأحولها إلى واقع باستخدام الواجهة الأمامية. أهتم بسهولة الاستخدام، والحركات السلسة، وتصميم واجهات حديثة.",
    "hero.toggleHint": "اضغط",

    // about
    "about.title": "عنّي ",
    "about.text":
      "أنا ربى، خريجة علوم حاسب من المملكة العربية السعودية. أعمل في تصميم تجربة وواجهة المستخدم بالإضافة إلى تنفيذ الواجهات الأمامية. أحب بناء تجارب هادئة وواضحة.",
    "about.cv": "تحميل السيرة الذاتية",

    // skills
    "skills.uiux": "تجربة وواجهة المستخدم",
    "skills.web": "تطوير الويب",
    "skills.app": "تصميم التطبيقات",
    "skills.graphic": "تصميم جرافيك",

    // projects
    "projects.title": "أعمالي",
    "projects.sub": "مختارات من أعمالي في UI/UX، أفكار التطبيقات، والأنظمة البصرية.",
    "projects.filter.all": "الكل",
    "projects.filter.web": "ويب",
    "projects.filter.app": "تطبيقات",

    "projects.cards.p1.title": "تسجيل الدخول / إنشاء حساب",
    "projects.cards.p1.desc": "شاشات تسجيل دخول + فكرة تعريفيّة.",
    "projects.cards.p2.title": "لعبة مطابقة البطاقات",
    "projects.cards.p2.desc": "واجهة لعبة مطابقة بسيطة.",
    "projects.cards.p3.title": "تطبيق مخبز",
    "projects.cards.p3.desc": "تجربة وتصميم واجهات لتطبيق مخبز.",

    // footer
    "footer.name": "ربى الغامدي"
  }
};



const langToggle = document.getElementById("langToggle");

function setLanguage(lang) {
  document.documentElement.lang = lang;

  // direction switch
  if (lang === "ar") {
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.dir = "ltr";
  }

  // translate text
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // change button text
  langToggle.textContent = lang === "ar" ? "EN" : "AR";

  localStorage.setItem("lang", lang);
}

// Load saved language
(function initLanguage() {
  const savedLang = localStorage.getItem("lang") || "en";
  setLanguage(savedLang);
})();

// Toggle click
langToggle.addEventListener("click", () => {
  const current = document.documentElement.lang;
  const newLang = current === "en" ? "ar" : "en";
  setLanguage(newLang);
});