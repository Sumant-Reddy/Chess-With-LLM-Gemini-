import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameMode, setPlayerNames, setAITurn, resetGame, makeAIMove } from './store/gameSlice';
import Chessboard from './components/Chessboard';
import CapturedPieces from './components/CapturedPieces';
import StartScreen from './components/StartScreen';
import AIModelSelector from './components/AIModelSelector';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { 
    gameStarted, 
    playerNames, 
    currentPlayer, 
    isAITurn,
    aiModel,
    board
  } = useSelector((state) => state.game);

  useEffect(() => {
    dispatch(setGameMode('ai'));
  }, [dispatch]);

  useEffect(() => {
    if (gameStarted && currentPlayer === 'black' && isAITurn) {
      dispatch(makeAIMove(board));
    }
  }, [currentPlayer, isAITurn, gameStarted, dispatch, board]);

  const handleGameStart = (playerName) => {
    dispatch(setPlayerNames({ white: playerName, black: `${aiModel.toUpperCase()} AI` }));
  };

  const handleReset = () => {
    dispatch(resetGame());
  };

  return (
    <div className="app">
      <h1>Chess Game</h1>
      {!gameStarted ? (
        <StartScreen onStart={handleGameStart} />
      ) : (
        <div className="game-container">
          <div className="game-info">
            <div className="player-info">
              <h2>{playerNames.white} (White)</h2>
              <h2>{playerNames.black} (Black)</h2>
            </div>
            <CapturedPieces />
            <button className="reset-button" onClick={handleReset}>
              Reset Game
            </button>
          </div>
          <Chessboard />
        </div>
      )}
      <AIModelSelector />
    </div>
  );
}

export default App;
