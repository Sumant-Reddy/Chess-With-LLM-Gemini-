import React from 'react';
import { useSelector } from 'react-redux';

const CapturedPieces = () => {
  const capturedPieces = useSelector((state) => state.game.capturedPieces) || [];

  // Group captured pieces by color
  const whiteCaptured = capturedPieces.filter(piece => piece.color === 'white');
  const blackCaptured = capturedPieces.filter(piece => piece.color === 'black');

  const getPieceSymbol = (piece) => {
    switch (piece.type) {
      case 'king': return '♔';
      case 'queen': return '♕';
      case 'rook': return '♖';
      case 'bishop': return '♗';
      case 'knight': return '♘';
      case 'pawn': return '♙';
      default: return '';
    }
  };

  return (
    <div className="captured-pieces">
      <div className="captured-piece-group">
        <h3>Captured White Pieces</h3>
        <div className="captured-piece-list">
          {whiteCaptured.map((piece, index) => (
            <span key={`white-${index}`} className="captured-piece black">
              {getPieceSymbol(piece)}
            </span>
          ))}
        </div>
      </div>
      <div className="captured-piece-group">
        <h3>Captured Black Pieces</h3>
        <div className="captured-piece-list">
          {blackCaptured.map((piece, index) => (
            <span key={`black-${index}`} className="captured-piece white">
              {getPieceSymbol(piece)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CapturedPieces; 