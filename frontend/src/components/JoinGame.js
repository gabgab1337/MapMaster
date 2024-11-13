import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

// Initialize socket connection
const socket = io('http://localhost:5000');

function JoinGame() {
  // State to store the game code entered by the user
  const [gameCode, setGameCode] = useState('');
  const navigate = useNavigate();

  // Function to handle creating a new game
  const handleCreateGame = () => {
    const newGameCode = uuidv4(); // Generate a new unique game code
    socket.emit('joinGame', newGameCode); // Emit the joinGame event with the new game code
    navigate(`/quiz/${newGameCode}`); // Navigate to the quiz page with the new game code
  };

  // Function to handle joining an existing game
  const handleJoinGame = () => {
    socket.emit('joinGame', gameCode); // Emit the joinGame event with the entered game code
    navigate(`/quiz/${gameCode}`); // Navigate to the quiz page with the entered game code
  };

  return (
    <div>
      <h1>Join or Create Game</h1>
      <button onClick={handleCreateGame}>Create Game</button>
      <input
        type="text"
        placeholder="Enter game code"
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)} // Update the game code state when the input value changes
      />
      <button onClick={handleJoinGame}>Join Game</button>
    </div>
  );
}

export default JoinGame;