import React, { useState, useEffect } from 'react';

// Component to display a question with a country's flag
function Question({ question }) {
  const [flagUrl, setFlagUrl] = useState(''); // State to store the URL of the flag image

  useEffect(() => {
    // Function to fetch the flag image from the API
    const fetchFlag = async () => {
      const response = await fetch(`https://flagcdn.com/w320/${question.alpha2Code.toLowerCase()}.png`); 
      if (response.ok) {
        setFlagUrl(response.url); // Set the flag URL if the response is successful
      } else {
        console.error('Błąd pobierania flagi'); // Log an error if the fetch fails
      }
    };

    fetchFlag(); // Call the fetchFlag function
  }, [question.alpha2Code]); // Dependency array to re-run the effect when the alpha2Code changes

  return (
    <div>
      {flagUrl && <img src={flagUrl} alt={`Flaga ${question.country}`} />} {/* Display the flag image if the URL is available */}
      <p>Podaj nazwę państwa:</p> {/* Prompt to ask for the country's name */}
    </div>
  );
}

export default Question; // Export the component as the default export