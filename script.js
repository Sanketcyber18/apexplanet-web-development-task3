// Sanket Sharma — ApexPlanet Task 3
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Interactive multiple-choice quiz
const questions = [
  { q: "Which language adds interactivity to a webpage?", options: ["HTML", "CSS", "JavaScript", "SQL"], answer: 2, note: "JavaScript makes webpages interactive." },
  { q: "Which CSS feature is designed for one-dimensional layouts?", options: ["Flexbox", "Canvas", "Local Storage", "Fetch"], answer: 0, note: "Flexbox is ideal for arranging items in a row or column." },
  { q: "Which browser API stores data between visits?", options: ["querySelector", "localStorage", "addEventListener", "Math.random"], answer: 1, note: "localStorage keeps key-value data in the browser." }
];
let questionIndex = 0;
let answered = false;
let score = 0;
const questionEl = document.getElementById("quizQuestion");
const optionsEl = document.getElementById("quizOptions");
const countEl = document.getElementById("quizCount");
const feedbackEl = document.getElementById("quizFeedback");
const nextEl = document.getElementById("quizNext");

function renderQuestion() {
  const item = questions[questionIndex];
  answered = false;
  countEl.textContent = `QUESTION ${String(questionIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  questionEl.textContent = item.q;
  feedbackEl.textContent = "";
  nextEl.disabled = true;
  nextEl.textContent = questionIndex === questions.length - 1 ? "See my score →" : "Next question →";
  optionsEl.innerHTML = "";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => chooseAnswer(index, button));
    optionsEl.appendChild(button);
  });
}
function chooseAnswer(selected, selectedButton) {
  if (answered) return;
  answered = true;
  const item = questions[questionIndex];
  const buttons = [...optionsEl.children];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.answer) button.classList.add("correct");
  });
  if (selected === item.answer) {
    score++;
    feedbackEl.textContent = `Correct! ${item.note}`;
  } else {
    selectedButton.classList.add("wrong");
    feedbackEl.textContent = `Not quite. ${item.note}`;
  }
  nextEl.disabled = false;
}
nextEl.addEventListener("click", () => {
  if (!answered) return;
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    countEl.textContent = "QUIZ COMPLETE";
    questionEl.textContent = `You scored ${score} out of ${questions.length}!`;
    optionsEl.innerHTML = "";
    feedbackEl.textContent = score === questions.length ? "Perfect run. Keep that curiosity going!" : "Nice attempt — every question is a chance to learn.";
    nextEl.textContent = "Try again ↻";
    nextEl.disabled = false;
    nextEl.onclick = () => { questionIndex = 0; score = 0; nextEl.onclick = null; renderQuestion(); };
  }
});
renderQuestion();

// Fetch live data from a public API. A fallback keeps the card useful if the API is unavailable.
const jokeButton = document.getElementById("jokeButton");
const jokeText = document.getElementById("jokeText");
const apiStatus = document.getElementById("apiStatus");
async function fetchJoke() {
  jokeButton.disabled = true;
  jokeButton.textContent = "Fetching...";
  apiStatus.textContent = "CONNECTING TO PUBLIC API...";
  try {
    const response = await fetch("https://v2.jokeapi.dev/joke/Programming,Miscellaneous?type=single&safe-mode");
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    if (data.error || !data.joke) throw new Error("No joke returned");
    jokeText.textContent = data.joke;
    apiStatus.textContent = "LIVE DATA RECEIVED ✓";
  } catch (error) {
    jokeText.textContent = "Why do programmers prefer dark mode? Because light attracts bugs. (Fallback joke — check your internet connection to fetch live data.)";
    apiStatus.textContent = "API UNAVAILABLE · FALLBACK SHOWN";
  } finally {
    jokeButton.disabled = false;
    jokeButton.innerHTML = 'Fetch another <span>↻</span>';
  }
}
jokeButton.addEventListener("click", fetchJoke);

// JavaScript image/visual carousel
const slides = [...document.querySelectorAll(".slide")];
const dotsContainer = document.getElementById("carouselDots");
let activeSlide = 0;
slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.className = `carousel-dot${index === 0 ? " active" : ""}`;
  dot.type = "button";
  dot.setAttribute("aria-label", `Show slide ${index + 1}`);
  dot.addEventListener("click", () => showSlide(index));
  dotsContainer.appendChild(dot);
});
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("slide-active", i === activeSlide));
  [...dotsContainer.children].forEach((dot, i) => dot.classList.toggle("active", i === activeSlide));
}
document.getElementById("prevSlide").addEventListener("click", () => showSlide(activeSlide - 1));
document.getElementById("nextSlide").addEventListener("click", () => showSlide(activeSlide + 1));
