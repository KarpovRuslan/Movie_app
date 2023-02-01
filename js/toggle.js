const toggle = document.querySelector(".toggle");
const docElement = document.documentElement;
const toggleDisplayMode = () => {
  if (toggle.getAttribute("aria-pressed") === "true") {
    toggle.removeAttribute("aria-pressed");
  } else {
    toggle.setAttribute("aria-pressed", "true");
  }

  docElement.classList.toggle("dark");
  docElement.classList.toggle("light");
};

toggle.addEventListener("click", () => toggleDisplayMode());
