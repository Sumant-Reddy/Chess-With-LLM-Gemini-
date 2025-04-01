import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ChessSquare from "./ChessSquare";
import { squareClicked } from "../store/gameSlice";

const ChessBoard = () => {
  const board = useSelector((state) => state.game.board);
  const validMoves = useSelector((state) => state.game.validMoves);
  const selectedPiece = useSelector((state) => state.game.selectedPiece);
  const dispatch = useDispatch();

  return (
    <div className="chessboard">
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          const isValidMove = validMoves.some(
            (move) => move.row === rowIndex && move.col === colIndex
          );
          const isSelected = selectedPiece && 
            selectedPiece.row === rowIndex && 
            selectedPiece.col === colIndex;

          return (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              piece={square ? { ...square, isSelected } : null}
              isValidMove={isValidMove}
              onClick={() => dispatch(squareClicked({ row: rowIndex, col: colIndex }))}
            />
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
