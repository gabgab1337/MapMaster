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
  const [socketId, setSocketId] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
      console.log('Socket connected with ID:', socket.id); // Log the socket ID
    });

    socket.on('answerResult', (data) => {
      if (data.correct) {
        setScore(data.scores[role]);
        setOpponentScore(data.scores[role === 'player1' ? 'player2' : 'player1']);
      }
      setCurrentQuestion(data.nextQuestion);
    });

    return () => {
      socket.off('connect');
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
    console.log('Submitting answer with socket ID:', socketId); // Log the socket ID being sent
    socket.emit('submitAnswer', { gameCode, answer, questionId: currentQuestion.id, socketId });
  };

  return (
    <div>
      <h1>Map Master</h1>
      <div>
        <p>Twój wynik: {score} pkt</p>
        <p>Wynik przeciwnika: {opponentScore} pkt</p>
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