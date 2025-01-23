const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const serverless = require('serverless-http');

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: "https://mapmasteronline.vercel.app" // Replace with your actual frontend URL
}));

let questions = [];
const players = {};
const scores = {};
const questionIndices = {}; // Maintain a separate question index for each game
const timers = {}; // Maintain a separate timer for each game

// Load questions from flags.json
const loadQuestions = () => {
  const dataPath = path.join(__dirname, 'data', 'flags.json');
  const data = fs.readFileSync(dataPath, 'utf8');
  questions = JSON.parse(data);
};

loadQuestions();

const getRandomQuestionIndex = () => {
  return Math.floor(Math.random() * 105) + 1; // Generate a random number between 1 and 105
};

const startQuestionTimer = (gameCode) => {
  if (timers[gameCode]) {
    clearTimeout(timers[gameCode]);
  }
  let timeLeft = 15;
  timers[gameCode] = setInterval(() => {
    if (timeLeft > 0) {
      io.to(gameCode).emit('timer', { timeLeft });
      timeLeft--;
    } else {
      clearInterval(timers[gameCode]);
      questionIndices[gameCode] = getRandomQuestionIndex(); // Generate a new random question index
      io.to(gameCode).emit('answerResult', { correct: false, nextQuestion: questions[questionIndices[gameCode]], scores: scores[gameCode] });
      startQuestionTimer(gameCode); // Restart the timer for the next question
    }
  }, 1000); // 1 second interval
};

app.get('/api/questions/:gameCode', (req, res) => {
  const { gameCode } = req.params;
  const questionIndex = questionIndices[gameCode] || getRandomQuestionIndex();
  questionIndices[gameCode] = questionIndex; // Store the random question index for the game
  const question = questions.find(q => q.id === questionIndex);
  res.json(question);
});

app.get('/api/scores/:gameCode', (req, res) => {
  const { gameCode } = req.params;
  res.json(scores[gameCode] || { player1: 0, player2: 0 });
});

// Export the wrapped Express application as a serverless function
module.exports = serverless(app);