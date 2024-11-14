const express = require('express'); // Import express module
const bodyParser = require('body-parser'); // Import body-parser module
const cors = require('cors'); // Import cors module
const fs = require('fs'); // Import file system module
const path = require('path'); // Import path module
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import socket.io module

const app = express(); // Create an express application
const port = 5555; // Define the port number
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"] // Allow these HTTP methods
  }
});

app.use(bodyParser.json()); // Use body-parser middleware to parse JSON requests
app.use(cors()); // Use CORS middleware to allow cross-origin requests

let questions = []; // Initialize an empty array to store questions
let currentQuestionIndex = 0; // Initialize the current question index

// Function to load questions from flags.json
const loadQuestions = () => {
  const dataPath = path.join(__dirname, 'data', 'flags.json'); // Define the path to the JSON file
  const data = fs.readFileSync(dataPath, 'utf8'); // Read the file synchronously
  questions = JSON.parse(data); // Parse the JSON data and store it in the questions array
};

// Load questions initially
loadQuestions();

// Define a route to get the current question
app.get('/api/questions', (req, res) => {
  const question = questions[currentQuestionIndex]; // Get the current question
  res.json(question); // Send the question as a JSON response
});

// Define a route to check the answer
app.post('/api/check-answer', (req, res) => {
  const { answer, questionId } = req.body; // Extract answer and questionId from the request body
  const question = questions.find(q => q.id === questionId); // Find the question by ID
  const correct = question && question.country.toLowerCase() === answer.toLowerCase(); // Check if the answer is correct
  if (correct) {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length; // Move to the next question
  }
  res.json({ correct }); // Send the result as a JSON response
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log('User connected'); // Log when a user connects

  socket.on('joinGame', gameCode => {
    socket.join(gameCode); // Join the user to a game room
    console.log(`User joined game ${gameCode}`); // Log the game code
  });

  socket.on('submitAnswer', (data)  => {
    const { gameCode, answer, questionId } = data; // Extract data from the event
    const question = questions.find(q => q.id === questionId); // Find the question by ID
    const correct = question && question.country.toLowerCase() === answer.toLowerCase(); // Check if the answer is correct
    if (correct) {
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length; // Move to the next question
    }
    io.to(gameCode).emit('answerResult', { correct, nextQuestion: questions[currentQuestionIndex] }); // Emit the result to the game room
  });

  socket.on('disconnect', () => {
    console.log('user disconnected'); // Log when a user disconnects
  });

});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log the server URL
});