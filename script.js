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

/* EVENT REGISTER BUTTONS -> PRE-FILL CONTACT FORM */
document.querySelectorAll(".event-register").forEach((link) => {
  link.addEventListener("click", function () {
    const eventName = this.dataset.event;
    const price = this.dataset.price;
    if (!eventName) return;

    setTimeout(() => {
      const reasonSelect = document.getElementById("reason");
      const amountInput = document.getElementById("amount");
      const amountGroup = document.getElementById("amountGroup");
      const amountHint = document.getElementById("amountHint");
      const submitBtn = document.getElementById("submitBtn");

      if (eventName.includes("Communication")) {
        reasonSelect.value = "communication-series";
      } else if (eventName.includes("School Setup")) {
        reasonSelect.value = "school-masterclass";
      }

      if (price === "0") {
        amountInput.value = 0;
        amountInput.readOnly = true;
        amountGroup.classList.add("is-free");
        amountHint.textContent =
          "This event is free — click Register below to confirm your spot.";
        submitBtn.textContent = "Register (Free)";
      } else {
        amountInput.value = price;
        amountInput.readOnly = true;
        amountGroup.classList.remove("is-free");
        amountHint.textContent = "Amount is fixed for this event.";
        submitBtn.textContent = "Register & Pay";
      }
    }, 300);
  });
});

/* CONTACT FORM SUBMIT: FREE REGISTRATION OR PAYSTACK PAYMENT */
const registrationForm = document.getElementById("registrationForm");

if (registrationForm) {
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const reason = document.getElementById("reason").value;
    const amount = document.getElementById("amount").value;
    const statusEl = document.getElementById("formStatus");

    function sendTicketEmail(eventName, amountPaid, reference) {
      if (typeof emailjs === "undefined") return;
      emailjs.send("YOUR_EMAILJS_SERVICE_ID", "YOUR_EMAILJS_TEMPLATE_ID", {
        to_name: fullName,
        to_email: email,
        event_name: eventName,
        amount_paid: amountPaid,
        reference: reference || "FREE-" + Date.now(),
        phone: phone,
      });
    }

    if (!amount || parseFloat(amount) === 0) {
      const eventLabel =
        document.getElementById("reason").selectedOptions[0].text;
      statusEl.textContent =
        "You're registered! A confirmation has been sent to your email.";
      statusEl.className = "form-status success";
      sendTicketEmail(eventLabel, "Free", null);
      registrationForm.reset();
      document.getElementById("amountGroup").classList.remove("is-free");
      document.getElementById("submitBtn").textContent = "Register & Pay";
      return;
    }

    const handler = PaystackPop.setup({
      key: "pk_test_8f5ac1a86da00af240d4bf47276e268c04d679c4",
      email: email,
      amount: parseFloat(amount) * 100,
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Full Name",
            variable_name: "full_name",
            value: fullName,
          },
          { display_name: "Phone", variable_name: "phone", value: phone },
          { display_name: "Reason", variable_name: "reason", value: reason },
        ],
      },
      callback: function (response) {
        const eventLabel =
          document.getElementById("reason").selectedOptions[0].text;
        statusEl.textContent =
          "Payment successful! Reference: " +
          response.reference +
          ". Your ticket has been emailed to you.";
        statusEl.className = "form-status success";
        sendTicketEmail(eventLabel, amount, response.reference);
        registrationForm.reset();
      },
      onClose: function () {
        statusEl.textContent =
          "Payment window closed. You can try again anytime.";
        statusEl.className = "form-status error";
      },
    });

    handler.openIframe();
  });
}

const eventPopup = document.getElementById("eventPopup");
const popupClose = document.getElementById("popupClose");

if (eventPopup && popupClose) {
  popupClose.addEventListener("click", () => {
    eventPopup.classList.add("hidden");
  });
}
