import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Question from './Question';
import AnswerInput from './AnswerInput';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function Quiz() {
  const { gameCode } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  useEffect(() => {
    socket.on('answerResult', (data) => {
      if (data.correct) {
        setScore(score + 1);
      }
      setCurrentQuestion(data.nextQuestion);
    });

    return () => {
      socket.off('answerResult');
    };
  }, [score]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/questions');
        const question = await response.json();
        setCurrentQuestion(question);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };
    fetchQuestion();
  }, []);

  const handleAnswer = async (answer) => {
    socket.emit('submitAnswer', { gameCode, answer, questionId: currentQuestion.id });
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