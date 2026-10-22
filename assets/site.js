const header = document.querySelector(".site-header");
const toggle = document.querySelector("[data-menu-toggle]");
const panel = document.querySelector("[data-mobile-panel]");
const close = document.querySelector("[data-mobile-close]");

let menuReturnFocus;
function setMenu(open) {
  if (!panel) return;
  if (open) menuReturnFocus = toggle || document.activeElement;
  panel.classList.toggle("is-open", open);
  panel.inert = !open;
  toggle?.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
  document.querySelectorAll("main, .site-footer, .site-header, .skip-link").forEach(el => { el.inert = open; });
  if (open) close?.focus();
  else menuReturnFocus?.focus();
}

document.addEventListener("keydown", event => {
  if (!panel?.classList.contains("is-open")) return;
  if (event.key === "Escape") { event.preventDefault(); setMenu(false); }
  if (event.key === "Tab") {
    const items = [...panel.querySelectorAll("button, a[href]")];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.matchMedia("(min-width: 1201px)").addEventListener("change", event => {
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

const form = document.querySelector("[data-contact-form]");
if (form) {
  const status = form.querySelector("[data-form-status]");
  const draft = form.querySelector("[data-email-draft]");

  form.addEventListener("input", () => {
    if (draft) { draft.hidden = true; draft.href = "mailto:info@zelrocprive.com"; }
    if (status) status.textContent = "";
    form.querySelectorAll("input, textarea").forEach(field => field.setCustomValidity(""));
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    for (const field of form.querySelectorAll("[required]")) {
      field.setCustomValidity(field.value.trim() ? "" : "Please complete this field.");
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = name => String(data.get(name) || "").trim();
    const subject = `Private enquiry — ${value("nature")} — ${value("name")}`;
    const body = [
      `Full name: ${value("name")}`,
      `Email address: ${value("email")}`,
      `Nature of enquiry: ${value("nature")}`,
      `Destination or location: ${value("destination") || "Not specified"}`,
      `Preferred travel dates: ${value("dates") || "Not specified"}`,
      "", "Your request or requirements:", value("message"),
    ].join("\n");
    if (draft) {
      draft.href = `mailto:info@zelrocprive.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      draft.hidden = false;
    }
    if (status) status.textContent = "Your enquiry has not been sent. Open the email draft below, review it and send it from your email app. If no email app is configured, email info@zelrocprive.com directly.";
  });
}
