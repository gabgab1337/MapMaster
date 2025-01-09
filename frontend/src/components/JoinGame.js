import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import socket from '../socket';

function JoinGame() {
  const [gameCode, setGameCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('joinSuccess', (data) => {
      console.log(data.message);
      navigate(`/quiz/${gameCode}`, { state: { role: data.role, playerId: data.playerId } });
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

  const getPlayerId = () => {
    let playerId = localStorage.getItem('playerId');
    if (!playerId) {
      playerId = uuidv4();
      localStorage.setItem('playerId', playerId);
    }
    return playerId;
  };

  const handleCreateGame = () => {
    const newGameCode = uuidv4();
    const playerId = getPlayerId();
    socket.emit('joinGame', { gameCode: newGameCode, playerId });
    setGameCode(newGameCode);
  };

  const handleJoinGame = () => {
    const playerId = getPlayerId();
    socket.emit('joinGame', { gameCode, playerId });
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