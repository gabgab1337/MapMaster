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
  const [timeLeft, setTimeLeft] = useState(15); // Add state for the timer

  useEffect(() => {
    console.log('Game code:', gameCode);

    localStorage.setItem('gameCode', gameCode); // Store game code in local storage

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
      setTimeLeft(15); // Reset the timer for the next question
    });

    socket.on('gameOver', (data) => {
      console.log('Received gameOver event:', data);
      setGameOver(true);
      setResult(data.winner === role ? 'win' : 'lose');
      localStorage.removeItem('gameCode'); // Remove game code from local storage
    });

    socket.on('timer', (data) => {
      setTimeLeft(data.timeLeft);
    });

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('answerResult');
      socket.off('gameOver');
      socket.off('timer');
    };
  }, [role, gameCode]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`https://mapmasteronline.app/api/questions/${gameCode}`); // Replace with your actual frontend URL
        const question = await response.json();
        setCurrentQuestion(question);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };
    fetchQuestion();
  }, [gameCode]);

  const handleAnswer = async (answer) => {
    console.log('Submitting answer:', answer);
    socket.emit('submitAnswer', { gameCode, answer, questionId: currentQuestion.id, playerId });
  };

  if (gameOver) {
    return <QuizResult result={result} />;
  }

  return (
    <div className="quiz">
      <div>
        <p>CODE: <strong className="quiz-code">{gameCode}</strong></p>
      </div>
      <div>
        <p className="quiz-score">Your score: {score} points</p>
        <p className="quiz-score">Opponent's score: {opponentScore} points</p>
      </div>
      {currentQuestion && (
        <>
          <AnswerInput onAnswer={handleAnswer} />
          <Question question={currentQuestion} />
        </>
      )}
      <div className="quiz-timer">
        <p>Time left: {timeLeft} seconds</p>
        {timeLeft <= 5 && <p style={{ color: 'red' }}>QUICKLY!</p>}
      </div>
    </div>
  );
}

export default Quiz;