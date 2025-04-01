import { calculateValidMoves, boardToFEN } from './chessLogic.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper function to get all valid moves for a piece
function getValidMoves(board, row, col, piece) {
  return calculateValidMoves(board, row, col, piece);
}

// Helper function to evaluate a position
function evaluatePosition(board) {
  const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0
  };

  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = pieceValues[piece.type];
        score += piece.color === 'black' ? value : -value;
      }
    }
  }
  return score;
}

// Helper function to get all possible moves for black pieces
function getAllBlackMoves(board) {
  const moves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === 'black') {
        const validMoves = getValidMoves(board, row, col, piece);
        moves.push(...validMoves.map(move => ({
          from: { row, col },
          to: move
        })));
      }
    }
  }
  return moves;
}

// Initialize Gemini client
const initGemini = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
  return apiKey ? new GoogleGenerativeAI(apiKey) : null;
};

export const generateAIMove = async (board) => {
  // Get all possible moves for black pieces
  const moves = getAllBlackMoves(board);

  // If no valid moves, return null
  if (moves.length === 0) {
    return null;
  }

  // Convert board to FEN notation
  const fen = boardToFEN(board);

  try {
    const genAI = initGemini();
    if (!genAI) throw new Error('Gemini API key not found');

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a chess AI. The current board position in FEN notation is: ${fen}
    Please analyze the position and suggest the best move for black in standard chess notation (e.g., "e2e4").
    Only respond with the move in the format "e2e4", nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const move = response.text().trim();

    // Convert the move to coordinates
    const fromCol = move.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
    const fromRow = 8 - parseInt(move[1]);
    const toCol = move.charCodeAt(2) - 97;
    const toRow = 8 - parseInt(move[3]);

    return {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol }
    };
  } catch (error) {
    console.error('Error generating AI move:', error);
    // Fallback to random move if there's an error
    return moves[Math.floor(Math.random() * moves.length)];
  }
}; 