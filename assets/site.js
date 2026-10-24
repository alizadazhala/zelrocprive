document.documentElement.classList.add("js-enabled");
const header = document.querySelector(".site-header");
const toggle = document.querySelector("[data-menu-toggle]");
const panel = document.querySelector("[data-mobile-panel]");
const close = document.querySelector("[data-mobile-close]");

let menuReturnFocus;
function setMenu(open) {
  if (!panel) return;
  if (open) window.$crisp?.push(["do", "chat:hide"]);
  if (open) menuReturnFocus = toggle || document.activeElement;
  panel.classList.toggle("is-open", open);
  panel.inert = !open;
  toggle?.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
  document.querySelectorAll("main, .site-footer, .site-header, .skip-link, .contact-dock").forEach(el => { el.inert = open; });
  if (open) close?.focus();
  else menuReturnFocus?.focus();
}

document.addEventListener("keydown", event => {
  if (!panel?.classList.contains("is-open")) return;
  if (event.key === "Escape") { event.preventDefault(); setMenu(false); }
  if (event.key === "Tab") {
    const items = [...panel.querySelectorAll("button, a[href], summary")].filter(el=>el.getClientRects().length && !el.closest("details:not([open])") || el.matches("summary"));
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.matchMedia("(min-width: 1361px)").addEventListener("change", event => {
  if (event.matches && panel?.classList.contains("is-open")) setMenu(false);
});

if (header) {
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 50);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

if (toggle) toggle.addEventListener("click", () => setMenu(true));
if (close) close.addEventListener("click", () => setMenu(false));
if (panel) {
  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
}

const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));
  document.documentElement.classList.add("reveal-ready");
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}


// Close navigation before a chat action; closing never hides the widget.
document.addEventListener("zelroc:close-menu", () => {
  if (panel?.classList.contains("is-open")) setMenu(false);
});
