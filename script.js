// ---------- Chat widget open / close ----------
const chatWindow = document.getElementById("chatWindow");
const chatClose = document.getElementById("chatClose");
const chatLauncher = document.getElementById("chatLauncher");

function openChat() {
  chatWindow.classList.add("open");
  chatLauncher.classList.add("active");
}
function closeChat() {
  chatWindow.classList.remove("open");
  chatLauncher.classList.remove("active");
}
function toggleChat() {
  chatWindow.classList.contains("open") ? closeChat() : openChat();
}

chatLauncher.addEventListener("click", toggleChat);
chatClose.addEventListener("click", closeChat);

// Any button with data-open-chat opens the chatbot
document.querySelectorAll("[data-open-chat]").forEach((btn) => {
  btn.addEventListener("click", openChat);
});

// ---------- Mobile menu ----------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("show"));
});

// ---------- Fade-in on scroll ----------
const fadeItems = document.querySelectorAll(".fade-in");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  fadeItems.forEach((item) => observer.observe(item));
} else {
  fadeItems.forEach((item) => item.classList.add("visible"));
}

// ---------- Copy email button ----------
const copyEmailBtn = document.getElementById("copyEmailBtn");
const footerEmail = document.getElementById("footerEmail");

copyEmailBtn.addEventListener("click", async () => {
  const email = footerEmail.textContent.trim();

  try {
    await navigator.clipboard.writeText(email);
  } catch (err) {
    // Purane browsers ke liye fallback
    const temp = document.createElement("textarea");
    temp.value = email;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  }

  copyEmailBtn.textContent = "Copied!";
  copyEmailBtn.classList.add("copied");
  setTimeout(() => {
    copyEmailBtn.textContent = "Copy";
    copyEmailBtn.classList.remove("copied");
  }, 2000);
});

// ---------- Contact form ----------
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

const formBtn = document.getElementById("formBtn");
const FORM_ENDPOINT = "https://formsubmit.co/ajax/hiumar937@gmail.com";

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  formBtn.disabled = true;
  formBtn.textContent = "Sending...";
  formNote.style.color = "";
  formNote.textContent = "";

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(contactForm),
    });
    const data = await response.json();

    if (response.ok && String(data.success) === "true") {
      formNote.style.color = "#16a34a";
      formNote.textContent = "Thanks! Your message has been sent.";
      contactForm.reset();
    } else {
      throw new Error("Send failed");
    }
  } catch (err) {
    formNote.style.color = "#dc2626";
    formNote.textContent = "Sorry, something went wrong. Please email me directly.";
  } finally {
    formBtn.disabled = false;
    formBtn.textContent = "Send Message";
    setTimeout(() => (formNote.textContent = ""), 6000);
  }
});