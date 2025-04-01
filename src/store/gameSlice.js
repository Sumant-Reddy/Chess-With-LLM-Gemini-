import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { calculateValidMoves, checkGameState, createInitialBoard, isMoveLegal } from '../utils/chessLogic';
import { generateAIMove } from '../utils/aiEngine';

// Create async thunk for AI move
export const makeAIMove = createAsyncThunk(
  'game/makeAIMove',
  async (board, { rejectWithValue }) => {
    try {
      const move = await generateAIMove(board);
      return move;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  board: createInitialBoard(),
  currentPlayer: 'white',
  selectedSquare: null,
  validMoves: [],
  capturedPieces: [],
  playerNames: {
    white: '',
    black: ''
  },
  gameStarted: false,
  gameMode: 'ai',
  aiModel: 'gemini',
  aiDifficulty: 'medium',
  isAITurn: false,
  moveHistory: [],
  isCheck: false,
  isCheckmate: false,
  lastMove: null,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    squareClicked: (state, action) => {
      const { row, col } = action.payload;

      // If it's AI's turn, don't allow moves
      if (state.isAITurn) return;

      // If no piece is selected and clicked square has a piece of current player's color
      if (!state.selectedSquare && state.board[row][col]?.color === state.currentPlayer) {
        state.selectedSquare = { row, col };
        state.validMoves = calculateValidMoves(state.board, row, col, state.board[row][col], state.lastMove)
          .filter(move => isMoveLegal(state.board, { row, col }, move, state.board[row][col]));
      }
      // If a piece is selected and clicked square is a valid move
      else if (state.selectedSquare && state.validMoves.some(move => move.row === row && move.col === col)) {
        // Store the captured piece if any
        if (state.board[row][col]) {
          state.capturedPieces.push(state.board[row][col]);
        }

        // Move the piece
        state.board[row][col] = state.board[state.selectedSquare.row][state.selectedSquare.col];
        state.board[state.selectedSquare.row][state.selectedSquare.col] = null;

        // Clear selection and valid moves
        state.selectedSquare = null;
        state.validMoves = [];

        // Check the game state
        const gameState = checkGameState(state.board, state.currentPlayer);
        state.isCheck = gameState === 'check';
        state.isCheckmate = gameState === 'checkmate';

        // Switch turns if not checkmate
        if (!state.isCheckmate) {
          state.currentPlayer = state.currentPlayer === 'white' ? 'black' : 'white';
          state.isAITurn = state.currentPlayer === 'black' && state.gameMode === 'ai';
        }
      }
      // If clicked square is not a valid move, clear selection
      else {
        state.selectedSquare = null;
        state.validMoves = [];
      }
    },
    movePiece: (state, action) => {
      const { from, to } = action.payload;
      const piece = state.board[from.row][from.col];
      
      // Handle captures
      if (state.board[to.row][to.col]) {
        const capturedPiece = state.board[to.row][to.col];
        state.capturedPieces.push(capturedPiece);
      }
      
      // Move the piece
      state.board[to.row][to.col] = piece;
      state.board[from.row][from.col] = null;
      
      // Update game state
      state.currentPlayer = 'white';
      state.selectedSquare = null;
      state.validMoves = [];
      state.isAITurn = false;
      state.lastMove = { from, to, piece };
      state.moveHistory.push({ from, to, piece });
    },
    resetGame: (state) => {
      state.board = createInitialBoard();
      state.currentPlayer = 'white';
      state.selectedSquare = null;
      state.validMoves = [];
      state.capturedPieces = [];
      state.playerNames = {
        white: '',
        black: ''
      };
      state.gameStarted = false;
      state.gameMode = 'ai';
      state.aiModel = 'gemini';
      state.aiDifficulty = 'medium';
      state.isAITurn = false;
      state.moveHistory = [];
      state.isCheck = false;
      state.isCheckmate = false;
      state.lastMove = null;
    },
    setGameMode: (state, action) => {
      state.gameMode = action.payload;
    },
    setPlayerNames: (state, action) => {
      state.playerNames = action.payload;
      state.gameStarted = true;
    },
    setAIModel: (state, action) => {
      state.aiModel = action.payload;
    },
    setAIDifficulty: (state, action) => {
      state.aiDifficulty = action.payload;
    },
    setAITurn: (state, action) => {
      state.isAITurn = action.payload;
    },
    makeMove: (state, action) => {
      const { from, to } = action.payload;
      const piece = state.board[from.row][from.col];

      // Store captured piece before moving
      const capturedPiece = state.board[to.row][to.col];
      if (capturedPiece) {
        state.capturedPieces.push(capturedPiece);
      }

      // Move piece
      state.board[to.row][to.col] = piece;
      state.board[from.row][from.col] = null;

      // Update last move
      state.lastMove = { from, to };

      // Check the game state
      const gameState = checkGameState(state.board, state.currentPlayer);
      state.isCheck = gameState === 'check';
      state.isCheckmate = gameState === 'checkmate';

      // Switch turns if not checkmate
      if (!state.isCheckmate) {
        state.currentPlayer = state.currentPlayer === 'white' ? 'black' : 'white';
        state.isAITurn = state.currentPlayer === 'black' && state.gameMode === 'ai';
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeAIMove.fulfilled, (state, action) => {
        const { from, to } = action.payload;
        const piece = state.board[from.row][from.col];

        // Store captured piece before moving
        const capturedPiece = state.board[to.row][to.col];
        if (capturedPiece) {
          state.capturedPieces.push(capturedPiece);
        }

        // Move piece
        state.board[to.row][to.col] = piece;
        state.board[from.row][from.col] = null;

        // Update last move
        state.lastMove = { from, to };

        // Check the game state
        const gameState = checkGameState(state.board, state.currentPlayer);
        state.isCheck = gameState === 'check';
        state.isCheckmate = gameState === 'checkmate';

        // Switch turns if not checkmate
        if (!state.isCheckmate) {
          state.currentPlayer = 'white';
          state.isAITurn = false;
        }
      })
      .addCase(makeAIMove.rejected, (state) => {
        state.isAITurn = false;
      });
  }
});

export const {
  squareClicked,
  movePiece,
  resetGame,
  setGameMode,
  setPlayerNames,
  setAIModel,
  setAIDifficulty,
  setAITurn,
  makeMove
} = gameSlice.actions;

export default gameSlice.reducer;