import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JoinGame from './components/JoinGame';
import Quiz from './components/Quiz';
import Profile from './components/Profile';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<JoinGame />} />
        <Route path="/quiz/:gameCode" element={<Quiz />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;