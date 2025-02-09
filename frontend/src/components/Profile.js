import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState('');
  const [userName, setUserName] = useState('');
  const [country, setCountry] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedPlayerId = localStorage.getItem('playerId');
    const storedUserName = localStorage.getItem('userName');
    const storedCountry = localStorage.getItem('country');
    const storedUserScore = localStorage.getItem('userScore');

    if (storedPlayerId) setPlayerId(storedPlayerId);
    if (storedUserName) setUserName(storedUserName);
    if (storedCountry) setCountry(storedCountry);
    if (storedUserScore) setUserScore(parseInt(storedUserScore));
  }, []);

  const handleSave = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('country', country);
    setIsEditing(false);
    alert('Profile saved successfully!');
  };

  const handleResetScore = () => {
    setUserScore(0);
    localStorage.setItem('userScore', 0);
    alert('Score reset successfully!');
  };

  return (
    <div className="profile">
      <h1 className="profile__header">YOUR PROFILE</h1>
      <div>
        <label>User Score: </label>
        <span>{userScore}</span>
      </div>
      <div>
        <label>User Name: </label>
        {isEditing ? (
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        ) : (
          <span>{userName}</span>
        )}
      </div>
      <div>
        <label>Country of Origin: </label>
        {isEditing ? (
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        ) : (
          <span>{country}</span>
        )}
      </div>
      {isEditing ? (
        <button className="join-game__button" onClick={handleSave}>Save</button>
      ) : (
        <button className="join-game__button" onClick={() => setIsEditing(true)}>Edit</button>
      )}
      <button className="join-game__button" onClick={handleResetScore}>Reset my score</button>
    </div>
  );
}

export default Profile;