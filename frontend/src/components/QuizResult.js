import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function QuizResult({ result }) {
  const navigate = useNavigate();
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!hasIncremented.current) {
      const userScore = parseInt(localStorage.getItem('userScore')) || 0;
      const userGamesPlayed = parseInt(localStorage.getItem('userGamesPlayed')) || 0;

      if (result === 'win') {
        localStorage.setItem('userScore', userScore + 1);
      }

      localStorage.setItem('userGamesPlayed', userGamesPlayed + 1);

      hasIncremented.current = true; // Prevent second increment in dev
    }
  }, [result]);

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>{result === 'win' ? 'YOU WON' : 'YOU LOST'}</h1>
      <button onClick={handleBackToMain}>Back to Main Screen</button>
    </div>
  );
}

export default QuizResult;