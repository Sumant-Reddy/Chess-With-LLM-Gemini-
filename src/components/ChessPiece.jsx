import React from "react";

const pieceSymbols = {
  pawn: "♙",
  knight: "♘",
  bishop: "♗",
  rook: "♖",
  queen: "♕",
  king: "♔",
};

const ChessPiece = ({ type, color }) => {
  return (
    <span className={`piece ${color}`}>
      {pieceSymbols[type] || "?"}
    </span>
  );
};

export default ChessPiece;
