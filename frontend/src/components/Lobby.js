import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../socket';

function Lobby() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the gameCode passed along from JoinGame
  const { gameCode, playerId } = location.state || {};

  const [players, setPlayers] = useState([]);
  const [countdown, setCountdown] = useState(10);
  const [startCountdown, setStartCountdown] = useState(false);

  // Listen for a "playerJoined" event from the server
  useEffect(() => {
    socket.on('playerJoined', (joinedPlayerId) => {
      setPlayers((prev) => {
        const alreadyInRoom = prev.includes(joinedPlayerId);
        return alreadyInRoom ? prev : [...prev, joinedPlayerId];
      });
    });

    // Request the current players in the room (if you implement it server-side)
    socket.emit('getPlayers', { gameCode });

    return () => {
      socket.off('playerJoined');
    };
  }, [gameCode]);

  // Whenever players count becomes 2, start countdown
  useEffect(() => {
    if (players.length === 2) {
      setStartCountdown(true);
    }
  }, [players]);

  // Handle countdown every second
  useEffect(() => {
    if (!startCountdown) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [startCountdown]);

  // When countdown hits 0, navigate to the quiz
  useEffect(() => {
    if (countdown <= 0) {
      navigate(`/quiz/${gameCode}`, { state: { playerId } });
    }
  }, [countdown, navigate, gameCode, playerId]);

  useEffect(() => {
    socket.on('playersList', (data) => {
      setPlayers(data.players);
    });
  
    socket.emit('getPlayers', { gameCode }); // Request existing players right away
  
    return () => {
      socket.off('playersList');
    };
  }, [gameCode]);

  return (
    <div>
      <h2>Lobby</h2>
      <p>Game Code: <strong>{gameCode}</strong></p>
      <p>Players joined: {players.length} of 2</p>
      {startCountdown && (
        <p>Starting in {countdown}...</p>
      )}
    </div>
  );
}

export default Lobby;