import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPlayerNames } from '../store/gameSlice';

const PlayerNames = ({ onStart }) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (player1Name.trim() && player2Name.trim()) {
      dispatch(setPlayerNames({ player1: player1Name, player2: player2Name }));
      onStart();
    }
  };

  return (
    <div className="player-names-modal">
      <form onSubmit={handleSubmit} className="player-names-form">
        <h2>Enter Player Names</h2>
        <div className="form-group">
          <label htmlFor="player1">Player 1 (White):</label>
          <input
            type="text"
            id="player1"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            placeholder="Enter name for White player"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="player2">Player 2 (Black):</label>
          <input
            type="text"
            id="player2"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            placeholder="Enter name for Black player"
            required
          />
        </div>
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
};

export default PlayerNames; 