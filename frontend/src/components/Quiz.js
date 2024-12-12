import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Question from './Question';
import AnswerInput from './AnswerInput';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5555');

function Quiz() {
  const { gameCode } = useParams();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [role, setRole] = useState(location.state?.role || 'player1');
  const [playerId, setPlayerId] = useState(location.state?.playerId || '');

  useEffect(() => {
    console.log('Setting up socket listeners'); // Debugging log

    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id); // Log the socket ID
    });

    socket.on('answerResult', (data) => {
      console.log('Received answerResult event:', data); // Log the received data
      if (data.correct) {
        setScore(data.scores[role]);
        setOpponentScore(data.scores[role === 'player1' ? 'player2' : 'player1']);
      }
      setCurrentQuestion(data.nextQuestion);
    });

    return () => {
      console.log('Cleaning up socket listeners'); // Debugging log
      socket.off('answerResult');
    };
  }, [role]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/questions');
        const question = await response.json();
        setCurrentQuestion(question);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };
    fetchQuestion();
  }, []);

  const handleAnswer = async (answer) => {
    console.log('Submitting answer:', answer); // Debugging log
    socket.emit('submitAnswer', { gameCode, answer, questionId: currentQuestion.id, playerId });
  };

  return (
    <div>
      <h1>Map Master</h1>
      <div>
        <p>Your score: {score} pkt</p>
        <p>Opponent's score: {opponentScore} pkt</p>
      </div>
      {currentQuestion && (
        <>
          <Question question={currentQuestion} />
          <AnswerInput onAnswer={handleAnswer} />
        </>
      )}
    </div>
  );
}

export default Quiz;