import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JoinGame from './components/JoinGame';
import Quiz from './components/Quiz';
import Profile from './components/Profile';
import Header from './components/Header';
import Lobby from './components/Lobby';
import About from './components/About';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<JoinGame />} />
        <Route path="/quiz/:gameCode" element={<Quiz />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;