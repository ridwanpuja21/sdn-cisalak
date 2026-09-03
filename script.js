document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // --- 1. MEMUAT BERITA SECARA OTOMATIS DARI JSON ---
  const newsGrid = document.getElementById("news-grid");
  if (newsGrid) {
    fetch("berita.json")
      .then((response) => response.json())
      .then((data) => {
        newsGrid.innerHTML = data
          .map(
            (item) => `
            <article class="news-card">
              <div class="news-date">${item.tanggal}</div>
              <h3>${item.judul}</h3>
              <p>${item.ringkasan}</p>
              <a href="detail-berita.html?id=${item.id}" class="read-more">Baca Selengkapnya &rarr;</a>
            </article>
          `,
          )
          .join("");
      })
      .catch((err) => console.error("Gagal memuat file berita.json:", err));
  }

  // --- 2. LOGIKA NAVIGASI MELAYANG (FLOATING NAVBAR) ---
  const navLinks = document.querySelectorAll(".floating-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetCard = document.querySelector(targetId);

      if (targetCard) {
        const cardIndex =
          parseInt(targetCard.getAttribute("data-card"), 10) - 1;
        const targetScrollTop = cardIndex * window.innerHeight;

        window.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    });
  });

  // --- 3. FITUR KLIK/TAP ACCORDION KHUSUS UNTUK MOBILE ---
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

  // --- 4. ANIMASI SCROLL Z-DEPTH ---
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const cards = Array.from(document.querySelectorAll(".zcard"));
  const spacer = document.querySelector(".scroll-spacer");
  let vh = window.innerHeight;
  let ticking = false;

  if (spacer && cards.length > 0) {
    spacer.style.height = `${cards.length * 100}vh`;
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function renderEngine() {
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
    if (!reduceMotion) {
      renderEngine();
    }
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
    if (spacer && cards.length > 0) {
      spacer.style.height = `${cards.length * 100}vh`;
    }
    requestRender();
  });

  requestRender();
});
