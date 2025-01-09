import React from 'react';
import { useNavigate } from 'react-router-dom';

function QuizResult({ result }) {
  const navigate = useNavigate();

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