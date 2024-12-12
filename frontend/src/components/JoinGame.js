import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const socket = io('http://localhost:5555');

function JoinGame() {
  const [gameCode, setGameCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('joinSuccess', (data) => {
      console.log(data.message);
      navigate(`/quiz/${gameCode}`, { state: { role: data.role } }); 
    });

    socket.on('joinError', (data) => {
      console.error(data.message); 
      alert(data.message);
    });

    return () => {
      socket.off('joinSuccess');
      socket.off('joinError');
    };
  }, [gameCode, navigate]);

  const handleCreateGame = () => {
    const newGameCode = uuidv4();
    socket.emit('joinGame', newGameCode);
    setGameCode(newGameCode);
  };

  const handleJoinGame = () => {
    socket.emit('joinGame', gameCode);
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