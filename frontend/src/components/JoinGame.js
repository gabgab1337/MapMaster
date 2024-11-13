import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const socket = io('http://localhost:5000');

function JoinGame() {
  const [gameCode, setGameCode] = useState('');
  const navigate = useNavigate();

  const handleCreateGame = () => {
    const newGameCode = uuidv4();
    socket.emit('joinGame', newGameCode);
    navigate(`/quiz/${newGameCode}`);
  };

  const handleJoinGame = () => {
    socket.emit('joinGame', gameCode);
    navigate(`/quiz/${gameCode}`);
  };

  return (
    <div>
      <h1>Join or Create Game</h1>
      <button onClick={handleCreateGame}>Create Game</button>
      <input
        type="text"
        placeholder="Enter game code"
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
      />
      <button onClick={handleJoinGame}>Join Game</button>
    </div>
  );
}

export default JoinGame;