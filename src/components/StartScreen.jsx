import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAIDifficulty } from '../store/gameSlice';

const StartScreen = ({ onStart }) => {
  const dispatch = useDispatch();
  const [playerName, setPlayerName] = useState('');
  const aiDifficulty = useSelector((state) => state.game.aiDifficulty);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() && aiDifficulty) {
      onStart(playerName.trim());
    }
  };

  return (
    <div className="start-screen">
      <h2>Start New Game</h2>
      <form className="start-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playerName">Your Name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label>Select AI Difficulty:</label>
          <div className="difficulty-buttons">
            <button
              type="button"
              className={`difficulty-button ${aiDifficulty === 'easy' ? 'active' : ''}`}
              onClick={() => dispatch(setAIDifficulty('easy'))}
            >
              Easy
            </button>
            <button
              type="button"
              className={`difficulty-button ${aiDifficulty === 'medium' ? 'active' : ''}`}
              onClick={() => dispatch(setAIDifficulty('medium'))}
            >
              Medium
            </button>
            <button
              type="button"
              className={`difficulty-button ${aiDifficulty === 'hard' ? 'active' : ''}`}
              onClick={() => dispatch(setAIDifficulty('hard'))}
            >
              Hard
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="start-button"
          disabled={!playerName.trim() || !aiDifficulty}
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default StartScreen; 