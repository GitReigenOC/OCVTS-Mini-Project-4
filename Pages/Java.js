const themeToggleButton = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeText = document.getElementById("theme-text");
const searchInput = document.getElementById("search-input");
const contactForm = document.getElementById("contact-form");
const contactFormStatus = document.getElementById("form-status");
const contactFields = [
  {
    input: document.getElementById("name"),
    error: document.getElementById("name-error"),
    requiredMessage: "Please enter your name.",
  },
  {
    input: document.getElementById("email"),
    error: document.getElementById("email-error"),
    requiredMessage: "Please enter your email address.",
    invalidMessage: "Please enter a valid email address.",
  },
  {
    input: document.getElementById("message"),
    error: document.getElementById("message-error"),
    requiredMessage: "Please write a message.",
  },
].filter(({ input, error }) => input && error);
const reviewCards = Array.from(
  document.querySelectorAll(".review, .F-review, .T-review"),
).map((card) => ({
  element: card,
  text: card.textContent.toLowerCase(),
}));
const noResults = document.getElementById("no-results");

function updateThemeButton(theme) {
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  if (themeText) {
    themeText.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeButton(theme);
}

const savedTheme = localStorage.getItem("verdikt-theme");

if (savedTheme === "dark" || savedTheme === "light") {
  setTheme(savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
}

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("verdikt-theme", nextTheme);
  });
}

if (contactForm && contactFields.length > 0) {
  const getFieldError = ({ input, requiredMessage, invalidMessage }) => {
    if (!input.value.trim()) {
      return requiredMessage;
    }

    if (input.validity.typeMismatch) {
      return invalidMessage;
    }

    return "";
  };

  const updateFieldError = (field) => {
    const message = getFieldError(field);

    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    field.error.textContent = message;
    field.error.classList.toggle("hidden", !message);

    return Boolean(message);
  };

  contactForm.addEventListener("submit", (event) => {
    const invalidFields = contactFields.filter(updateFieldError);

    if (invalidFields.length > 0) {
      event.preventDefault();
      invalidFields[0].input.focus();
      return;
    }

    if (contactForm.action.includes("YOUR_FORM_ID")) {
      event.preventDefault();
      contactFormStatus.textContent =
        "This form isn't connected yet. Add your Formspree form ID to the form action first.";
      contactFormStatus.classList.remove("hidden");
    }
  });

  contactFields.forEach((field) => {
    field.input.addEventListener("input", () => {
      if (!field.error.classList.contains("hidden")) {
        updateFieldError(field);
      }
    });
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let matchesCount = 0;

    reviewCards.forEach(({ element, text }) => {
      const matches = text.includes(query);

      if (matches) {
        if (element.classList.contains("hidden")) {
          element.classList.add("search-enter");

          const finishSearchAnimation = () => {
            element.classList.remove("search-enter");
            element.removeEventListener("animationend", finishSearchAnimation);
            element.removeEventListener("animationcancel", finishSearchAnimation);
          };

          element.addEventListener("animationend", finishSearchAnimation);
          element.addEventListener("animationcancel", finishSearchAnimation);
        }

        element.classList.remove("hidden");
        matchesCount++;
      } else {
        element.classList.remove("search-enter");
        element.classList.add("hidden");
      }
    });

    if (noResults) {
      noResults.classList.toggle("hidden", matchesCount > 0);
    }
  });
}
