const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 5555;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(bodyParser.json());
app.use(cors());

let questions = [];
let currentQuestionIndex = 0;
const players = {};
const scores = {};

const loadQuestions = () => {
  const dataPath = path.join(__dirname, 'data', 'flags.json');
  const data = fs.readFileSync(dataPath, 'utf8');
  questions = JSON.parse(data);
};

loadQuestions();

app.get('/api/questions', (req, res) => {
  const question = questions[currentQuestionIndex];
  res.json(question);
});

app.get('/api/scores/:gameCode', (req, res) => {
  const { gameCode } = req.params;
  res.json(scores[gameCode] || { player1: 0, player2: 0 });
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('joinGame', ({ gameCode, playerId }) => {
    if (!players[gameCode]) {
      players[gameCode] = [];
      scores[gameCode] = { player1: 0, player2: 0 }; // Initialize scores for the game room
    }

    if (players[gameCode].length < 2) {
      const playerRole = players[gameCode].length === 0 ? 'player1' : 'player2';
      players[gameCode].push({ id: playerId, role: playerRole });
      socket.join(gameCode);
      console.log(`User joined game ${gameCode} as ${playerRole}. With Player ID: ${playerId}`);
      socket.emit('joinSuccess', { message: 'Joined game successfully', role: playerRole, playerId });
    } else {
      socket.emit('joinError', { message: 'Game room is full' });
    }
  });

  socket.on('submitAnswer', (data) => {
    const { gameCode, answer, questionId, playerId } = data;
    console.log('Received answer submission with player ID:', playerId);
    console.log('Game code:', gameCode);
    console.log('Players object:', players);
    const question = questions.find(q => q.id === questionId);
    const correct = question && question.country.toLowerCase() === answer.toLowerCase();
    if (correct) {
      console.log(`Correct answer: ${answer}`);
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      scores[gameCode] = scores[gameCode] || { player1: 0, player2: 0 };
      console.log('Player ID:', playerId);
      const player = players[gameCode]?.find(p => p.id === playerId);
      console.log('Player:', player);
      if (player) {
        scores[gameCode][player.role]++; // Increment the score for the correct player
      }
    }
    console.log(`Answer submitted: ${answer}, correct: ${correct}, scores:`, scores[gameCode]);
    io.to(gameCode).emit('answerResult', { correct, nextQuestion: questions[currentQuestionIndex], scores: scores[gameCode] });
  });

  socket.on('disconnect', () => {
    for (const gameCode in players) {
      if (players.hasOwnProperty(gameCode)) {
        const playerIndex = players[gameCode].findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
          players[gameCode].splice(playerIndex, 1);
          if (players[gameCode].length === 0) {
            delete players[gameCode];
            delete scores[gameCode]; // Remove scores for the game room
          }
          console.log(`User disconnected from game ${gameCode}`);
          break;
        }
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});