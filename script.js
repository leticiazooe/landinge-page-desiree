const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const progress = document.querySelector(".scroll-progress span");
const revealItems = document.querySelectorAll(".reveal");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const WHATSAPP_NUMBER = "5511915776536";
const WHATSAPP_MESSAGE = "Olá, equipe DS Assessoria! Vim pelo site e gostaria de conhecer melhor os eventos e as oportunidades de conexões e parcerias. Podem me passar mais informações?";

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const updateProgress = () => {
  if (!progress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progress.style.width = `${Math.max(0, Math.min(100, ratio))}%`;
};

updateHeader();
updateProgress();
window.addEventListener("scroll", () => {
  updateHeader();
  updateProgress();
}, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu?.classList.toggle("is-open", !isOpen);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  });
});

if (!prefersReduced && "IntersectionObserver" in window) {
  revealItems.forEach((item) => item.classList.add("motion-pending"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("motion-pending");
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => {
    item.classList.remove("motion-pending");
    item.classList.add("is-visible");
  });
}

document.querySelectorAll("[data-accordion] details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll("[data-accordion] details").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

const contactForm = document.querySelector("[data-contact-form]");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const status = contactForm.querySelector(".form-status");
  const data = new FormData(contactForm);
  const readField = (name) => String(data.get(name) ?? "").trim();
  const fullName = [readField("firstName"), readField("lastName")].filter(Boolean).join(" ");
  const subject = readField("subject") || "Contato pelo site";
  const body = [
    "Olá, equipe DS Assessoria!",
    "",
    "Vim pelo site e gostaria de entrar em contato.",
    "",
    "Nome: " + fullName,
    "E-mail para retorno: " + readField("email"),
    "Assunto: " + subject,
    "",
    "Mensagem:",
    readField("message")
  ].join("\r\n");

  window.location.href = "mailto:ceodesiree@dsassessoriaestrategica.com.br"
    + "?subject=" + encodeURIComponent("Contato pelo site — " + subject)
    + "&body=" + encodeURIComponent(body);
  if (status) {
    status.textContent = "Abra seu aplicativo de e-mail para revisar e enviar a mensagem. Se ele não abrir, configure um aplicativo de e-mail padrão ou escreva para ceodesiree@dsassessoriaestrategica.com.br. Os dados continuam preenchidos.";
  }
});

document.querySelectorAll("[data-footer-placeholder]").forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

// O logo acompanha a passagem da chamada final pela tela.
(() => {
  const section = document.querySelector(".cta-final-section");
  const logo = section?.querySelector(".hero-right img");
  if (!section || !logo) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pendingFrame = null;

  const updateLogoRotation = () => {
    pendingFrame = null;
    if (reducedMotion.matches) {
      logo.style.removeProperty("--ds-logo-scroll-angle");
      return;
    }

    const bounds = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = Math.max(0, Math.min(1,
      (viewportHeight - bounds.top) / (viewportHeight + bounds.height)
    ));
    const angle = (progress - 0.5) * 180;
    logo.style.setProperty("--ds-logo-scroll-angle", angle.toFixed(2) + "deg");
  };

  const scheduleLogoRotation = () => {
    if (pendingFrame !== null) return;
    pendingFrame = window.requestAnimationFrame(updateLogoRotation);
  };

  window.addEventListener("scroll", scheduleLogoRotation, { passive: true });
  window.addEventListener("resize", scheduleLogoRotation);
  window.addEventListener("load", scheduleLogoRotation);
  reducedMotion.addEventListener("change", scheduleLogoRotation);
  updateLogoRotation();
})();
