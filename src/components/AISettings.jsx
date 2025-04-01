import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAIDifficulty } from '../store/gameSlice';

const AISettings = ({ onStart }) => {
  const dispatch = useDispatch();
  const { aiDifficulty } = useSelector((state) => state.game);

  const handleDifficultyChange = (difficulty) => {
    console.log('Changing AI difficulty to:', difficulty);
    dispatch(setAIDifficulty(difficulty));
  };

  const handleStart = () => {
    onStart();
  };

  return (
    <div className="ai-settings">
      <h2>Select AI Difficulty</h2>
      <div className="difficulty-buttons">
        <button
          className={`difficulty-button ${aiDifficulty === 'easy' ? 'active' : ''}`}
          onClick={() => handleDifficultyChange('easy')}
        >
          Easy
        </button>
        <button
          className={`difficulty-button ${aiDifficulty === 'medium' ? 'active' : ''}`}
          onClick={() => handleDifficultyChange('medium')}
        >
          Medium
        </button>
        <button
          className={`difficulty-button ${aiDifficulty === 'hard' ? 'active' : ''}`}
          onClick={() => handleDifficultyChange('hard')}
        >
          Hard
        </button>
      </div>

      <button 
        className="start-button"
        onClick={handleStart}
        disabled={!aiDifficulty}
      >
        Start Game
      </button>
    </div>
  );
};

export default AISettings; 