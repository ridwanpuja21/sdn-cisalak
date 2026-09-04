document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // --- 1. LOGIKA NAVIGASI MELAYANG (FLOATING NAVBAR) ---
  const navLinks = document.querySelectorAll(".floating-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetCard = document.querySelector(targetId);

      if (targetCard) {
        // Matikan Z-depth override di mobile agar scroll href bekerja
        if (window.innerWidth <= 768) {
          targetCard.scrollIntoView({ behavior: "smooth" });
          document.getElementById("menu-toggle").checked = false; // Tutup menu
        } else {
          const cardIndex =
            parseInt(targetCard.getAttribute("data-card"), 10) - 1;
          const targetScrollTop = cardIndex * window.innerHeight;
          window.scrollTo({
            top: targetScrollTop,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // --- 2. FITUR KLIK/TAP ACCORDION KHUSUS UNTUK MOBILE ---
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        const isActive = this.classList.contains("active");

        accordionItems.forEach((otherItem) => {
          otherItem.classList.remove("active");
        });

        if (!isActive) {
          this.classList.add("active");
        }
      }
    });
  });

  // --- 3. ANIMASI SCROLL Z-DEPTH (Hanya Aktif di Desktop) ---
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const cards = Array.from(document.querySelectorAll(".zcard"));
  const spacer = document.querySelector(".scroll-spacer");
  let vh = window.innerHeight;
  let ticking = false;

  function initZDepth() {
    if (window.innerWidth <= 768) {
      if (spacer) spacer.style.display = "none";
      cards.forEach((card) => {
        card.style.transform = "none";
        card.style.opacity = "1";
      });
      return; // Hentikan kalkulasi Z-Depth di HP
    }

    if (spacer && cards.length > 0) {
      spacer.style.display = "block";
      spacer.style.height = `${cards.length * 100}vh`;
    }
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function renderEngine() {
    if (window.innerWidth <= 768) return; // Jangan render efek di HP

    const y = window.scrollY || window.pageYOffset || 0;
    cards.forEach((card, i) => {
      const entry = i === 0 ? 1 : clamp01((y - (i - 1) * vh) / vh);
      const recede = i === cards.length - 1 ? 0 : clamp01((y - i * vh) / vh);
      const scale = 1 - 0.08 * recede;
      const ty = (1 - entry) * 100;

      card.style.transform = `translateY(${ty}%) scale(${scale})`;
      card.style.opacity = String(1 - 0.8 * recede);
    });
  }

  function onFrame() {
    if (!reduceMotion) renderEngine();
    ticking = false;
  }

  function requestRender() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onFrame);
    }
  }

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", function () {
    vh = window.innerHeight;
    initZDepth();
    requestRender();
  });

  initZDepth();
  requestRender();
});
