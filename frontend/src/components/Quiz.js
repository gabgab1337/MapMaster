import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Question from './Question';
import AnswerInput from './AnswerInput';
import QuizResult from './QuizResult';
import socket from '../socket';

function Quiz() {
  const { gameCode } = useParams();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [role, setRole] = useState(location.state?.role || 'player1');
  const [playerId, setPlayerId] = useState(location.state?.playerId || '');
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    console.log('Setting up socket listeners');
    console.log('Game code:', gameCode);

    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id); 
    });

    socket.on('answerResult', (data) => {
      console.log('Received answerResult event:', data); 
      if (data.correct) {
        setScore(data.scores[role]);
        setOpponentScore(data.scores[role === 'player1' ? 'player2' : 'player1']);
      }
      setCurrentQuestion(data.nextQuestion);
    });

    socket.on('gameOver', (data) => {
      console.log('Received gameOver event:', data);
      setGameOver(true);
      setResult(data.winner === role ? 'win' : 'lose');
    });

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('answerResult');
      socket.off('gameOver');
    };
  }, [role, gameCode]);

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
    console.log('Submitting answer:', answer);
    socket.emit('submitAnswer', { gameCode, answer, questionId: currentQuestion.id, playerId });
  };

  if (gameOver) {
    return <QuizResult result={result} />;
  }

  return (
    <div>
      <h1>Map Master</h1>
      <div>
        <p>Your score: {score} points</p>
        <p>Opponent's score: {opponentScore} points</p>
      </div>
      {currentQuestion && (
        <>
          <Question question={currentQuestion} />
          <AnswerInput onAnswer={handleAnswer} />
        </>
      )}
      <div>
        <p>Your game code: <strong>{gameCode}</strong></p>
      </div>
    </div>
  );
}

export default Quiz;