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

/* PRICING LOOKUP FOR EACH REASON */
const reasonPricing = {
  general: null,
  consultation: null,
  "communication-series": 0,
  "school-masterclass": 15000,
  other: null,
};

function updateAmountField(reasonValue) {
  const amountInput = document.getElementById("amount");
  const amountGroup = document.getElementById("amountGroup");
  const amountHint = document.getElementById("amountHint");
  const submitBtn = document.getElementById("submitBtn");

  const price = reasonPricing[reasonValue];

  if (price === null || price === undefined) {
    amountGroup.classList.add("hidden");
    amountGroup.classList.remove("is-free");
    amountInput.value = "";
    amountInput.readOnly = false;
    submitBtn.textContent = "Send Message";
  } else if (price === 0) {
    amountGroup.classList.remove("hidden");
    amountGroup.classList.add("is-free");
    amountInput.value = 0;
    amountInput.readOnly = true;
    amountHint.textContent =
      "This event is free — click Register below to confirm your spot.";
    submitBtn.textContent = "Register (Free)";
  } else {
    amountGroup.classList.remove("hidden");
    amountGroup.classList.remove("is-free");
    amountInput.value = price;
    amountInput.readOnly = true;
    amountHint.textContent = "Amount is fixed for this event.";
    submitBtn.textContent = "Register & Pay";
  }
}

/* EVENT REGISTER BUTTONS -> PRE-FILL CONTACT FORM */
document.querySelectorAll(".event-register").forEach((link) => {
  link.addEventListener("click", function () {
    const eventName = this.dataset.event;
    if (!eventName) return;

    setTimeout(() => {
      const reasonSelect = document.getElementById("reason");

      if (eventName.includes("Communication")) {
        reasonSelect.value = "communication-series";
      } else if (eventName.includes("School Setup")) {
        reasonSelect.value = "school-masterclass";
      }

      updateAmountField(reasonSelect.value);
    }, 300);
  });
});

/* MANUAL DROPDOWN SELECTION -> UPDATE AMOUNT FIELD */
const reasonSelectEl = document.getElementById("reason");
if (reasonSelectEl) {
  reasonSelectEl.addEventListener("change", function () {
    updateAmountField(this.value);
  });
}

/* CONTACT FORM SUBMIT: GENERAL MESSAGE, FREE REGISTRATION, OR PAYSTACK PAYMENT */
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
      emailjs.send("service_6wmfium", "template_h0roc3c", {
        to_name: fullName,
        to_email: email,
        event_name: eventName,
        amount_paid: amountPaid,
        reference: reference || "N/A-" + Date.now(),
        phone: phone,
      });
    }

    if (!amount || parseFloat(amount) === 0) {
      const eventLabel =
        document.getElementById("reason").selectedOptions[0].text;
      statusEl.textContent =
        "Thank you! We've received your message and will get back to you shortly.";
      statusEl.className = "form-status success";
      sendTicketEmail(eventLabel, "N/A", null);
      registrationForm.reset();
      document.getElementById("amountGroup").classList.add("hidden");
      document.getElementById("amountGroup").classList.remove("is-free");
      document.getElementById("submitBtn").textContent = "Send Message";
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
        document.getElementById("amountGroup").classList.add("hidden");
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
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    document
      .querySelectorAll(".faq-item")
      .forEach((el) => el.classList.remove("open"));

    if (!isOpen) {
      item.classList.add("open");
    }
  });
});

const footerYearEl = document.getElementById("footerYear");
if (footerYearEl) {
  footerYearEl.textContent = new Date().getFullYear();
}
