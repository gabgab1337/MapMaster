import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JoinGame from './components/JoinGame';
import Quiz from './components/Quiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinGame />} />
        <Route path="/quiz/:gameCode" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;