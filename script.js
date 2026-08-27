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

const eventSlides = document.querySelectorAll(".event-slide");
const eventDotsContainer = document.getElementById("eventDots");
const eventPrevBtn = document.getElementById("eventPrev");
const eventNextBtn = document.getElementById("eventNext");
const eventSliderEl = document.getElementById("eventSlider");
let currentEvent = 0;
let eventAutoplay;

if (eventSlides.length) {
  eventSlides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.classList.add("event-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      showEvent(i);
      resetAutoplay();
    });
    eventDotsContainer.appendChild(dot);
  });

  const eventDots = document.querySelectorAll(".event-dot");

  function showEvent(index) {
    eventSlides[currentEvent].classList.remove("active");
    eventDots[currentEvent].classList.remove("active");
    currentEvent = (index + eventSlides.length) % eventSlides.length;
    eventSlides[currentEvent].classList.add("active");
    eventDots[currentEvent].classList.add("active");
  }

  function startAutoplay() {
    eventAutoplay = setInterval(() => {
      showEvent(currentEvent + 1);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(eventAutoplay);
    startAutoplay();
  }

  eventPrevBtn.addEventListener("click", () => {
    showEvent(currentEvent - 1);
    resetAutoplay();
  });

  eventNextBtn.addEventListener("click", () => {
    showEvent(currentEvent + 1);
    resetAutoplay();
  });

  eventSliderEl.addEventListener("mouseenter", () =>
    clearInterval(eventAutoplay),
  );
  eventSliderEl.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}
