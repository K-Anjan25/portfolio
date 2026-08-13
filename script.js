/* ============================================================
   PORTFOLIO · SCRIPT
   Theme, routing, scroll-spy, typing, and interactive widgets
   ============================================================ */

/* ============================================================
   EASY EDIT: your links  ←  replace the defaults below
   Links marked `<a data-link="...">` in the HTML pick their
   href from this object, so updating one line updates them all.
   ============================================================ */
const SITE_LINKS = {
  github: "https://github.com/K-Anjan25",          // your GitHub
  linkedin: "https://linkedin.com",                // TODO: paste your profile, e.g. https://www.linkedin.com/in/your-name
  instagram: "https://instagram.com",              // TODO: paste your handle, e.g. https://instagram.com/your-handle
  email: "mailto:kyamaanjan2@gmail.com",
  certs: "#",                                      // TODO: paste your certificates folder (e.g. Google Drive) link
};

/* Set this to your free Formspree form ID to send messages to your
   inbox (create one at https://formspree.io → "New form", then paste
   the ID from https://formspree.io/f/<THIS_ID>).
   Leave it empty ("" ) to fall back to opening the visitor's mail app. */
const FORMSPREE_ID = "";

/* ---------- 0. Site links injection ---------- */
function initSiteLinks() {
  document.querySelectorAll("[data-link]").forEach(el => {
    const key = el.getAttribute("data-link");
    const url = SITE_LINKS[key];
    if (url) {
      el.href = url;
      // Warn (in tooltip only) while real links are missing
      if (url === "#") el.title = "Update SITE_LINKS.certs in script.js";
    }
  });
}

/* ---------- 1. Theme (dark default) ---------- */
function applyTheme(light) {
  if (light) {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
  }
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.innerHTML = light
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  }
  try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) {}
}

function toggleMode() {
  const isLight = document.body.classList.contains("light");
  applyTheme(!isLight);
}

// Restore persisted theme on load
(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  applyTheme(saved === "light");
})();

/* ---------- 2. Mobile menu ---------- */
function toggleMenu() {
  const links = document.getElementById("navLinks");
  const icon = document.querySelector(".hamburger i");
  if (!links) return;
  links.classList.toggle("open");
  if (icon) icon.className = links.classList.contains("open")
    ? "fa-solid fa-xmark"
    : "fa-solid fa-bars";
}

/* ---------- 3. Scroll reveal ---------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function initScrollAnimations() {
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/* ---------- 4. Scroll spy (active nav link) ---------- */
function initScrollSpy() {
  const sections = ["about", "projects", "certificates"];
  const map = {};
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) map[id] = el;
  });
  if (!Object.keys(map).length) return;

  const onScroll = () => {
    let current = null;
    const probe = window.innerHeight / 2;
    sections.forEach(id => {
      if (!map[id]) return;
      const rect = map[id].getBoundingClientRect();
      if (rect.top <= probe && rect.bottom >= probe) current = id;
    });
    if (current) updateActiveNavLink("index.html#" + current);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- 5. SPA routing ---------- */
function updateActiveNavLink(currentHref) {
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    link.classList.remove("active-nav");
    if (href === currentHref) link.classList.add("active-nav");
  });
}

function fadeInContainer(container) {
  container.classList.remove("page-fade");
  void container.offsetWidth;
  container.classList.add("page-fade");
}

function loadHomePageAndScroll(targetId) {
  fetch("index.html")
    .then(res => res.text())
    .then(html => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const container = document.getElementById("dynamic-content");
      const homeContent = doc.getElementById("dynamic-content");
      container.innerHTML = homeContent ? homeContent.innerHTML : "";

      fadeInContainer(container);
      document.title = "Kyama Anjan Kumar | Portfolio";

      const activeHref = targetId && targetId !== "home" ? "index.html#" + targetId : "index.html";
      updateActiveNavLink(activeHref);
      runAllHomeComponents();

      history.pushState({ page: "home" }, "Home", "index.html");

      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 60);
      } else {
        window.scrollTo(0, 0);
      }
    })
    .catch(err => console.error("Error loading home page:", err));
}

document.addEventListener("click", function (e) {
  const contactLink = e.target.closest('a[href="contact.html"]');
  const anchorLink = e.target.closest('a[href*="#"]');
  const homeLink = e.target.closest('a[href="index.html"], a[href="index.html#home"]');

  // Close mobile menu on any nav click
  if (e.target.closest(".nav-links")) {
    const links = document.getElementById("navLinks");
    if (links && links.classList.contains("open")) toggleMenu();
  }

  if (contactLink) {
    e.preventDefault();
    fetch("contact.html")
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const container = document.getElementById("dynamic-content");
        const content = doc.getElementById("contact-page-content");
        container.innerHTML = content ? content.innerHTML : "";

        fadeInContainer(container);
        document.title = "Contact | Anjan Kumar";
        updateActiveNavLink("contact.html");
        initSiteLinks();

        history.pushState({ page: "contact" }, "Contact", "contact.html");
        window.scrollTo(0, 0);
      })
      .catch(err => console.error("Error loading contact page:", err));
    return;
  }

  if (anchorLink) {
    const href = anchorLink.getAttribute("href");
    const targetId = href.includes("#") ? href.split("#")[1] : null;
    if (targetId && !document.getElementById(targetId)) {
      e.preventDefault();
      loadHomePageAndScroll(targetId);
    }
  } else if (homeLink) {
    e.preventDefault();
    loadHomePageAndScroll(null);
  }
});

window.addEventListener("popstate", function () {
  window.location.reload();
});

/* ---------- 6. Form handler (Formspree → mailto fallback) ---------- */
document.addEventListener("submit", async function (e) {
  const form = e.target && e.target.id === "contactForm" ? e.target : null;
  if (!form) return;
  e.preventDefault();

  const msg = document.getElementById("successMessage");
  const setMsg = (text, ok = true) => {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = ok ? "#34d399" : "#f87171";
  };

  const name = (form.querySelector('[name="name"]') || {}).value || "";
  const email = (form.querySelector('[name="email"]') || {}).value || "";
  const text = (form.querySelector('[name="message"]') || {}).value || "";

  // Basic client-side validation
  if (!name.trim() || !email.trim() || !text.trim()) {
    setMsg("⚠ Please fill in all fields before sending.", false);
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setMsg("⚠ That email address doesn't look right.", false);
    return;
  }

  const subject = `Portfolio message from ${name.trim()}`;
  const body = `${text.trim()}\n\n— ${name.trim()} (${email.trim()})`;

  if (FORMSPREE_ID) {
    // Send via Formspree
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Formspree error " + res.status);
      setMsg("✅ Message sent! I'll get back to you soon.");
      form.reset();
    } catch (err) {
      console.error("Form submit failed:", err);
      setMsg("⚠ Couldn't send. Please email me directly: kyamaanjan2@gmail.com", false);
    }
  } else {
    // Fallback: open the visitor's mail app pre-filled
    try {
      window.location.href =
        SITE_LINKS.email +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      setMsg("✅ Opening your mail app — press send to deliver the message!");
      form.reset();
    } catch (err) {
      console.error("Mailto fallback failed:", err);
      setMsg("⚠ Couldn't open your mail app. Email me directly: kyamaanjan2@gmail.com", false);
    }
  }
});

/* ---------- 7. Skill tracker ---------- */
function initSkillTracker() {
  const container = document.querySelector(".skills");
  const targetText = document.getElementById("skillDetailText");
  if (!container || !targetText) return;

  container.addEventListener("mouseover", function (e) {
    const badge = e.target.closest(".skill-badge");
    if (badge) {
      const desc = badge.getAttribute("data-desc");
      if (desc) targetText.innerText = desc;
    }
  });

  container.addEventListener("mouseout", function (e) {
    const badge = e.target.closest(".skill-badge");
    if (badge) targetText.innerText = "Hover a skill badge to inspect technical specifics.";
  });
}

/* ---------- 8. ML dashboard ---------- */
function initMLDashboard() {
  const slider = document.getElementById("thresholdSlider");
  const val = document.getElementById("threshold-val");
  const count = document.getElementById("alert-count");
  if (!slider || !val || !count) return;

  slider.addEventListener("input", function (e) {
    const threshold = parseFloat(e.target.value);
    val.innerText = threshold.toFixed(2);
    count.innerText = Math.round(threshold * 280) + " flags";
  });
}

/* ---------- 9. Architecture blueprint ---------- */
function initArchitectureBlueprint() {
  const container = document.querySelector(".blueprint-nodes");
  const detailsBox = document.getElementById("blueprintDetails");
  if (!container || !detailsBox) return;

  const specs = {
    gateway: "<strong>Route handling:</strong> ingress traffic management, rate-limiting, and microservice request routing via Spring Cloud Gateway.",
    auth: "<strong>Identity &amp; access control:</strong> stateless security layer issuing cryptographically signed JWT tokens to authenticated requests.",
    product: "<strong>Domain service:</strong> isolated business-logic container for product catalogs, talking directly to a PostgreSQL instance."
  };

  container.addEventListener("click", function (e) {
    const node = e.target.closest(".node");
    if (!node) return;
    container.querySelectorAll(".node").forEach(n => n.classList.remove("active-node"));
    node.classList.add("active-node");
    const key = node.getAttribute("data-arch");
    if (specs[key]) detailsBox.innerHTML = specs[key];
  });
}

/* ---------- 10. Typing hero ---------- */
let typingTimeout;

function initTypingHero() {
  const el = document.getElementById("typing-text");
  if (!el) return;
  if (typingTimeout) clearTimeout(typingTimeout);

  const words = ["Full-Stack Developer", "Java & Spring Boot Engineer", "ML Enthusiast"];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const word = words[wordIndex];
    el.textContent = word.substring(0, charIndex);

    let speed = deleting ? 40 : 80;
    if (!deleting) {
      charIndex++;
      if (charIndex === word.length) { speed = 2000; deleting = true; }
    } else {
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
      }
    }
    typingTimeout = setTimeout(type, speed);
  }

  type();
}

/* ---------- Unified home init ---------- */
function runAllHomeComponents() {
  initSiteLinks();
  initScrollAnimations();
  initScrollSpy();
  initSkillTracker();
  initMLDashboard();
  initArchitectureBlueprint();
  initTypingHero();
}

document.addEventListener("DOMContentLoaded", runAllHomeComponents);
