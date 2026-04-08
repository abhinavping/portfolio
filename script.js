// (First block removed during revert to previous behavior)

// Neural network-style animated background
(() => {
  const canvas = document.getElementById("nn-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let points = [];

  const POINT_COUNT = 70;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function createPoints() {
    points = Array.from({ length: POINT_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -40) p.x = width + 40;
      if (p.x > width + 40) p.x = -40;
      if (p.y < -40) p.y = height + 40;
      if (p.y > height + 40) p.y = -40;
    }

    // Draw connections
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = 1 - dist / 150;
          const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          gradient.addColorStop(0, `rgba(66, 232, 255, ${alpha * 0.5})`);
          gradient.addColorStop(1, `rgba(123, 92, 255, ${alpha * 0.5})`);
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const p of points) {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4);
      gradient.addColorStop(0, "rgba(255,255,255,0.9)");
      gradient.addColorStop(1, "rgba(66,232,255,0.0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  createPoints();
  requestAnimationFrame(step);

  window.addEventListener("resize", () => {
    resize();
    createPoints();
  });
})();

// Mobile nav toggle
(() => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  const closeMenu = () => {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.classList.toggle("is-open");
    links.classList.toggle("is-open", isOpen);
  });

  links.addEventListener("click", (e) => {
    if (e.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });
})();

// Intersection-based reveal animations for sections
(() => {
  const sections = document.querySelectorAll("section");
  if (!("IntersectionObserver" in window) || !sections.length) return;

  sections.forEach((section) => {
    section.setAttribute("data-reveal", "hidden");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-reveal", "visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  sections.forEach((section) => observer.observe(section));
})();

// Smooth scroll for older browsers with a graceful fallback
(() => {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const hash = (link.getAttribute("href") || "").slice(1);
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

// Dynamic year and resume placeholder
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  const resumeLink = document.getElementById("download-resume");
  if (resumeLink) {
    resumeLink.addEventListener("click", (e) => {
      const href = resumeLink.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
        // Hint to update link
        alert(
          "Resume download link is not yet configured. Replace the href on the 'Download Resume' link with your actual PDF URL."
        );
      }
    });
  }
})();

