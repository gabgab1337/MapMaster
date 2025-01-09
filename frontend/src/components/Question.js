import React, { useState, useEffect } from 'react';

function Question({ question }) {
  const [flagUrl, setFlagUrl] = useState('');

  useEffect(() => {
    const fetchFlag = async () => {
      const response = await fetch(`https://flagcdn.com/w320/${question.alpha2Code.toLowerCase()}.png`);
      if (response.ok) {
        setFlagUrl(response.url);
      } else {
        console.error('Błąd pobierania flagi');
      }
    };
    fetchFlag();
  }, [question.alpha2Code]); 

  return (
    <div>
      {flagUrl && <img src={flagUrl} alt={`Flaga ${question.country}`} />} {/* Display the flag image if the URL is available */}
      <p>What country's flag is that?</p> {/* country's name */}
    </div>
  );
}

export default Question;