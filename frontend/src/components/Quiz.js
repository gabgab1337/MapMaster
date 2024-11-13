import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Question from './Question';
import AnswerInput from './AnswerInput';
import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('http://localhost:5000');

function Quiz() {
  const { gameCode } = useParams(); // Get game code from URL parameters
  const [currentQuestion, setCurrentQuestion] = useState(null); // State to hold the current question
  const [score, setScore] = useState(0); // State to hold the user's score
  const [opponentScore, setOpponentScore] = useState(0); // State to hold the opponent's score

  // Effect to handle incoming socket events
  useEffect(() => {
    socket.on('answerResult', (data) => {
      if (data.correct) {
        setScore(score + 1); // Increment score if the answer is correct
      }
      setCurrentQuestion(data.nextQuestion); // Set the next question
    });

    // Cleanup socket event listener on component unmount
    return () => {
      socket.off('answerResult');
    };
  }, [score]);

  // Effect to fetch the initial question
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/questions');
        const question = await response.json();
        setCurrentQuestion(question); // Set the fetched question
      } catch (error) {
        console.error('Error fetching question:', error); // Log any errors
      }
    };
    fetchQuestion();
  }, []);

  // Function to handle answer submission
  const handleAnswer = async (answer) => {
    socket.emit('submitAnswer', { gameCode, answer, questionId: currentQuestion.id });
  };

  return (
    <div>
      <h1>Map Master</h1>
      <div>
        <p>Twój wynik: {score} pkt</p> {/* Display user's score */}
        <p>Wynik przeciwnika: {opponentScore} pkt</p> {/* Display opponent's score */}
      </div>
      {currentQuestion && (
        <>
          <Question question={currentQuestion} /> {/* Render current question */}
          <AnswerInput onAnswer={handleAnswer} /> {/* Render answer input */}
        </>
      )}
    </div>
  );
}

export default Quiz;