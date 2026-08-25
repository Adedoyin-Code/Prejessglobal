const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");

toggle.addEventListener("click", () => {
  const isOpen = links.classList.toggle("open");
  toggle.classList.toggle("active");
  toggle.setAttribute("aria-expanded", isOpen);
});

links.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
  });
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeForward(el, text, speed) {
  el.classList.add("typing-cursor");
  for (let i = 0; i < text.length; i++) {
    el.textContent += text.charAt(i);
    await delay(speed);
  }
  el.classList.remove("typing-cursor");
}

async function typeBackward(el, speed) {
  el.classList.add("typing-cursor");
  let text = el.textContent;
  for (let i = text.length; i > 0; i--) {
    el.textContent = text.substring(0, i - 1);
    await delay(speed);
  }
  el.classList.remove("typing-cursor");
}

async function loopTyping() {
  const nameEl = document.getElementById("typeName");
  const titleEl = document.getElementById("typeTitle");
  if (!nameEl || !titleEl) return;

  while (true) {
    await typeForward(nameEl, "Promise Adiele, PhD", 55);
    await delay(600);
    await typeForward(titleEl, "MD/CEO", 70);
    await delay(2200);
    await typeBackward(titleEl, 40);
    await delay(200);
    await typeBackward(nameEl, 40);
    await delay(600);
  }
}

loopTyping();
