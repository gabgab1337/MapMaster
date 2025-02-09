import React, { useState } from 'react';

function AnswerInput({ onAnswer }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAnswer(answer);
    setAnswer('');
  };

  return (
    <form className="answer" onSubmit={handleSubmit}>
      <input
        type="text"
        value={answer}
        className="answer-input"
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button className="join-game__button" type="submit">Answer</button>
    </form>
  );
}

export default AnswerInput;