const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const currentYear = document.querySelector("#current-year");
const navLinks = [...document.querySelectorAll(".primary-nav .nav-link")];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter((section) => section instanceof HTMLElement);
const parallaxElements = [...document.querySelectorAll("[data-parallax-speed]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = [
  ...document.querySelectorAll(
    ".ticker, .section-heading, .program-card, .about-visual, .about-copy > *, .stat, .schedule-table tbody tr, .schedule-footnote, .testimonial-image, .testimonial-copy > *, .price-card, .pricing-footnote, .final-cta-inner > *, .footer-main > *, .footer-bottom",
  ),
];

let parallaxFrame = 0;
let revealObserver;
let activeSectionFrame = 0;

function updateActiveNavigation() {
  activeSectionFrame = 0;

  const header = document.querySelector(".site-header");
  const activationLine = (header?.getBoundingClientRect().bottom ?? 0) + 24;
  let activeSection = navSections[0];

  navSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= activationLine) {
      activeSection = section;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeSection?.id}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function scheduleActiveNavigationUpdate() {
  if (!activeSectionFrame) {
    activeSectionFrame = window.requestAnimationFrame(updateActiveNavigation);
  }
}

function updateParallax() {
  parallaxFrame = 0;

  const viewportHeight = window.innerHeight;
  parallaxElements.forEach((element) => {
    if (reducedMotion.matches) {
      element.style.setProperty("--parallax-offset", "0px");
      return;
    }

    const bounds = element.getBoundingClientRect();
    if (bounds.bottom < -200 || bounds.top > viewportHeight + 200) {
      element.style.setProperty("--parallax-offset", "0px");
      return;
    }

    const previousOffset = Number.parseFloat(element.style.getPropertyValue("--parallax-offset")) || 0;
    const distanceFromCenter = bounds.top + bounds.height / 2 - viewportHeight / 2 - previousOffset;
    const speed = Number(element.dataset.parallaxSpeed);
    const offset = Math.max(-80, Math.min(80, distanceFromCenter * speed));
    element.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
  });
}

function scheduleParallaxUpdate() {
  if (!parallaxFrame) {
    parallaxFrame = window.requestAnimationFrame(updateParallax);
  }
}

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const revealGroups = document.querySelectorAll(".program-grid, .stats-grid, .schedule-table tbody, .pricing-grid, .footer-main");
  revealGroups.forEach((group) => {
    [...group.children].forEach((child, index) => {
      child.style.setProperty("--reveal-delay", `${Math.min(index * 90, 270)}ms`);
    });
  });

  revealElements.forEach((element) => element.setAttribute("data-reveal", ""));
  document.body.classList.add("motion-ready");

  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (parallaxElements.length > 0) {
  window.addEventListener("scroll", scheduleParallaxUpdate, { passive: true });
  window.addEventListener("resize", scheduleParallaxUpdate);
  reducedMotion.addEventListener("change", scheduleParallaxUpdate);
  scheduleParallaxUpdate();
}

if (navSections.length > 0) {
  window.addEventListener("scroll", scheduleActiveNavigationUpdate, { passive: true });
  window.addEventListener("resize", scheduleActiveNavigationUpdate);
  scheduleActiveNavigationUpdate();
}

if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNavigation.classList.toggle("is-open", !isOpen);
  });

  primaryNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNavigation.classList.remove("is-open");
    });
  });
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
