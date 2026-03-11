const detailState = {
  lang: localStorage.getItem("lang") || "en",
  currentIndex: 0,
  project: null
};

const detailParams = new URLSearchParams(window.location.search);
const detailProjectId = detailParams.get("id");

const detailTranslations = window.TRANSLATIONS || {};
const detailThemeToggleEl = document.getElementById("themeToggle");
const detailLangToggle = document.getElementById("langToggle");

function detailT(key) {
  return detailTranslations?.[detailState.lang]?.[key]
    || detailTranslations?.en?.[key]
    || key;
}

function detailApplyTranslations(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = detailTranslations?.[lang]?.[key];
    if (!value) return;

    if (el.tagName === "TITLE") {
      document.title = value;
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const raw = el.dataset.i18nAttr;
    if (!raw) return;

    const pairs = raw.split("|").map((s) => s.trim());
    pairs.forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      const value = detailTranslations?.[lang]?.[key];
      if (attr && key && value) el.setAttribute(attr, value);
    });
  });

  if (detailLangToggle) {
    detailLangToggle.textContent = lang === "ar" ? "EN" : "AR";
  }

  localStorage.setItem("lang", lang);
}

function detailSetTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (detailThemeToggleEl) {
    detailThemeToggleEl.setAttribute("aria-checked", String(isDark));
  }
}

(function detailInitTheme() {
  const savedTheme = localStorage.getItem("theme");
  detailSetTheme(savedTheme === "dark");
})();

function detailInitLanguage() {
  detailApplyTranslations(detailState.lang);

  detailLangToggle?.addEventListener("click", () => {
    detailState.lang = document.documentElement.lang === "en" ? "ar" : "en";
    detailApplyTranslations(detailState.lang);
    renderDetailProject();
  });
}

function renderDetailProject() {
  const titleEl = document.getElementById("projectTitle");
  const descEl = document.getElementById("projectDesc");
  const galleryImage = document.getElementById("galleryImage");
  const dotsWrap = document.getElementById("galleryDots");
  const figmaBtn = document.getElementById("figmaBtn");

  const projects = window.PROJECTS || [];
  const project = projects.find((p) => p.id === detailProjectId);

  if (!project) {
    titleEl.textContent = detailT("project.notFound");
    descEl.textContent = detailT("project.notFoundDesc");

    if (galleryImage) galleryImage.style.display = "none";
    if (figmaBtn) figmaBtn.style.display = "none";
    return;
  }

  detailState.project = project;

  titleEl.textContent = detailT(project.titleKey);
  descEl.textContent = detailT(project.detailsKey);

  document.title = `${detailT(project.titleKey)} | ${detailT("meta.title")}`;

  if (figmaBtn) {
    if (project.figma) {
      figmaBtn.href = project.figma;
      figmaBtn.target = "_blank";
      figmaBtn.rel = "noopener noreferrer";
      figmaBtn.style.display = "inline-flex";
    } else {
      figmaBtn.style.display = "none";
    }
  }

  const images = project.gallery?.length ? project.gallery : [project.img];
  if (detailState.currentIndex >= images.length) detailState.currentIndex = 0;

  galleryImage.src = images[detailState.currentIndex];
  galleryImage.alt = detailT(project.altKey);
  galleryImage.style.display = "block";

  dotsWrap.innerHTML = images.map((_, i) => `
    <button
      class="projectGalleryDot ${i === detailState.currentIndex ? "isActive" : ""}"
      type="button"
      data-index="${i}"
      aria-label="image ${i + 1}">
    </button>
  `).join("");

  dotsWrap.querySelectorAll(".projectGalleryDot").forEach((btn) => {
    btn.addEventListener("click", () => {
      detailState.currentIndex = Number(btn.dataset.index);
      renderDetailProject();
    });
  });
}

function detailNextImage() {
  if (!detailState.project) return;
  const images = detailState.project.gallery?.length
    ? detailState.project.gallery
    : [detailState.project.img];

  detailState.currentIndex = (detailState.currentIndex + 1) % images.length;
  renderDetailProject();
}

function detailPrevImage() {
  if (!detailState.project) return;
  const images = detailState.project.gallery?.length
    ? detailState.project.gallery
    : [detailState.project.img];

  detailState.currentIndex = (detailState.currentIndex - 1 + images.length) % images.length;
  renderDetailProject();
}

function detailInitGallery() {
  document.getElementById("nextBtn")?.addEventListener("click", detailNextImage);
  document.getElementById("prevBtn")?.addEventListener("click", detailPrevImage);
}

function detailInitReveal() {
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

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") detailNextImage();
  if (e.key === "ArrowLeft") detailPrevImage();
});

(function initDetailPage() {
  detailInitLanguage();
  detailInitGallery();
  renderDetailProject();
  detailInitReveal();
})();

