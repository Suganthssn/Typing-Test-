const quoteContainer = document.querySelector("#quote");
const userInput = document.getElementById("user-input");
const timerDisplay = document.getElementById("timer");
const mistakeDisplay = document.getElementById("mistake");
const startBtn = document.getElementById("start-test");
const stopBtn = document.getElementById("stop-test");
const result = document.getElementById("result");

const TEST_DURATION = 60;
let timeLeft = TEST_DURATION;
let timer = null;
let mistakes = 0;
let totalTyped = 0;
let isTestRunning = false;

const sentences = [
  "Consistency beats motivation. Small daily improvements lead to massive long term results.",
  "Discipline is choosing what you want most over what you want now.",
  "Success usually comes to those who are too busy to be looking for it.",
  "The expert in anything was once a beginner who refused to quit.",
  "Focus on progress, not perfection, and keep moving forward.",
  "Great developers are not born, they are built through practice and persistence.",
  "Your future is created by what you do today, not tomorrow.",
  "Push yourself because no one else is going to do it for you.",
  "Confidence comes from preparation and consistent hard work.",
  "Dream big, start small, but most importantly start."
];



function getRandomSentence() {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
}


function displayQuote(text) {
  quoteContainer.innerHTML = "";
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.innerText = char;
    quoteContainer.appendChild(span);
  });
}



function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
      stopTest();
    }
  }, 1000);
}



function stopTimer() {
  clearInterval(timer);
}



function calculateWPM() {
  const words = totalTyped / 5;
  const minutes = (TEST_DURATION - timeLeft) / 60;
  return minutes > 0 ? Math.round(words / minutes) : 0;
}



function calculateAccuracy() {
  return totalTyped > 0
    ? Math.round(((totalTyped - mistakes) / totalTyped) * 100)
    : 100;
}



startBtn.addEventListener("click", () => {
  resetTest();

  const randomSentence = getRandomSentence();
  displayQuote(randomSentence);

  isTestRunning = true;
  userInput.disabled = false;
  userInput.focus();
  startTimer();
});



stopBtn.addEventListener("click", stopTest);


function stopTest() {
  if (!isTestRunning) return;

  isTestRunning = false;
  stopTimer();
  userInput.disabled = true;

  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();

  result.innerHTML = `
    <strong>Results</strong><br>
    WPM: ${wpm} <br>
    Accuracy: ${accuracy}% <br>
    Mistakes: ${mistakes}
  `;
}



function resetTest() {
  timeLeft = TEST_DURATION;
  mistakes = 0;
  totalTyped = 0;

  timerDisplay.textContent = TEST_DURATION;
  mistakeDisplay.textContent = 0;
  userInput.value = "";
  result.innerHTML = "";
  userInput.disabled = true;
}



userInput.addEventListener("input", () => {
  if (!isTestRunning) return;

  const quoteSpans = quoteContainer.querySelectorAll("span");
  const typedText = userInput.value;

  mistakes = 0;
  totalTyped = typedText.length;

  quoteSpans.forEach((span, index) => {
    const typedChar = typedText[index];

    if (typedChar == null) {
      span.classList.remove("correct", "incorrect");
    } else if (typedChar === span.innerText) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
      mistakes++;
    }
  });

  mistakeDisplay.textContent = mistakes;

  if (typedText.length === quoteSpans.length) {
    stopTest();
  }
});



window.addEventListener("load", () => {
  const randomSentence = getRandomSentence();
  displayQuote(randomSentence);
  resetTest();
});
