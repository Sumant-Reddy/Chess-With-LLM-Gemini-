import React from "react";
import ChessPiece from "./ChessPiece";

const ChessSquare = ({ row, col, piece, isValidMove, onClick }) => {
  const isSelected = piece && piece.isSelected;

  return (
    <div
      className={`square ${isValidMove ? "valid-move" : ""} ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      {piece && <ChessPiece type={piece.type} color={piece.color} />}
    </div>
  );
};

export default ChessSquare;
