import { createSlice } from "@reduxjs/toolkit";
import { createInitialBoard, calculateValidMoves, checkGameState } from "../utils/chessLogic";

const initialState = {
  board: createInitialBoard(),
  currentPlayer: "white",
  selectedSquare: null,
  validMoves: [],
  gameStatus: "active",
  moveHistory: [],
  capturedPieces: {
    white: [],
    black: []
  },
  lastMove: null
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    squareClicked: (state, action) => {
      const { row, col } = action.payload;
      const clickedSquare = state.board[row][col];

      if (!state.selectedSquare && clickedSquare && clickedSquare.color === state.currentPlayer) {
        state.selectedSquare = { row, col };
        state.validMoves = calculateValidMoves(state.board, row, col, clickedSquare, state.lastMove);
      } 
      else if (state.selectedSquare && state.validMoves.some(move => move.row === row && move.col === col)) {
        const fromSquare = state.board[state.selectedSquare.row][state.selectedSquare.col];
        const toSquare = state.board[row][col];

        if (toSquare) {
          state.capturedPieces[state.currentPlayer].push(toSquare);
        }

        if (fromSquare.type === "pawn") {
          if ((state.currentPlayer === "white" && row === 7) || (state.currentPlayer === "black" && row === 0)) {
            fromSquare.type = "queen";
          }
        }

        state.board[row][col] = fromSquare;
        state.board[state.selectedSquare.row][state.selectedSquare.col] = null;
        fromSquare.hasMoved = true;

        state.moveHistory.push({
          from: state.selectedSquare,
          to: { row, col },
          piece: fromSquare,
          captured: toSquare
        });

        state.lastMove = {
          from: state.selectedSquare,
          to: { row, col },
          piece: fromSquare
        };

        state.currentPlayer = state.currentPlayer === "white" ? "black" : "white";
        state.gameStatus = checkGameState(state.board, state.currentPlayer, state.lastMove);

        state.selectedSquare = null;
        state.validMoves = [];
      } 
      else {
        state.selectedSquare = null;
        state.validMoves = [];
      }
    },
    resetGame: () => initialState
  }
});

export const { squareClicked, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
