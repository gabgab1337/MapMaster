import React, { useState } from 'react';

function AnswerInput({ onAnswer }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAnswer(answer);
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button type="submit">Odpowiedz</button>
    </form>
  );
}

export default AnswerInput;