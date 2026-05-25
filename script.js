const root = document.documentElement;
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const progress = document.getElementById("progress");
const backTop = document.getElementById("backTop");
const overlay = document.getElementById("sidebarOverlay");
const sections = [...document.querySelectorAll(".guide-section")];
const navLinks = [...document.querySelectorAll(".side-group a")];

// Table Double Wrapping for Premium Scroll Hint Fix
document.querySelectorAll(".guide-section table").forEach((table) => {
  const container = document.createElement("div");
  container.className = "table-container";
  const wrapper = document.createElement("div");
  wrapper.className = "table-wrapper";
  
  table.parentNode.insertBefore(container, table);
  container.appendChild(wrapper);
  wrapper.appendChild(table);
  
  const checkScroll = () => {
    if (table.offsetWidth > wrapper.offsetWidth) {
      container.classList.add("scrollable");
    } else {
      container.classList.remove("scrollable");
    }
  };
  checkScroll();
  window.addEventListener("resize", checkScroll);
});

const savedTheme = localStorage.getItem("codex101-theme");
if (savedTheme === "light") {
  root.classList.add("light");
}

themeToggle.addEventListener("click", () => {
  root.classList.toggle("light");
  localStorage.setItem("codex101-theme", root.classList.contains("light") ? "light" : "dark");
});

// Sidebar Toggle & Dimmer & Scroll Lock Helper
const toggleBodyScroll = () => {
  const isOpen = sidebar.classList.contains("open");
  document.body.classList.toggle("no-scroll", isOpen);
  overlay.classList.toggle("active", isOpen);
};

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  toggleBodyScroll();
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    document.body.classList.remove("no-scroll");
    overlay.classList.remove("active");
  });
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  document.body.classList.remove("no-scroll");
  overlay.classList.remove("active");
});

document.addEventListener("click", (event) => {
  if (!sidebar.classList.contains("open")) return;
  if (sidebar.contains(event.target) || menuToggle.contains(event.target) || overlay.contains(event.target)) return;
  sidebar.classList.remove("open");
  document.body.classList.remove("no-scroll");
  overlay.classList.remove("active");
});

// Intersection Observer for active TOC links
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => link.classList.remove("active"));
    const activeLink = document.querySelector(`.side-group a[href="#${visible.target.id}"]`);
    activeLink?.classList.add("active");
  },
  {
    rootMargin: "-22% 0px -68% 0px",
    threshold: [0.1, 0.25, 0.5, 0.75],
  },
);

sections.forEach((section) => observer.observe(section));

// Copy Code Button Hover Injection
document.querySelectorAll("pre").forEach((block) => {
  const button = document.createElement("button");
  button.className = "copy-code";
  button.type = "button";
  button.textContent = "복사";
  button.addEventListener("click", async () => {
    const text = block.querySelector("code")?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "완료";
      window.setTimeout(() => {
        button.textContent = "복사";
      }, 1200);
    } catch {
      button.textContent = "실패";
      window.setTimeout(() => {
        button.textContent = "복사";
      }, 1200);
    }
  });
  block.appendChild(button);
});

// Scroll State Progress & Back to Top
function updateScrollState() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max <= 0 ? 0 : window.scrollY / max;
  progress.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
  backTop.classList.toggle("show", window.scrollY > 700);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

updateScrollState();
