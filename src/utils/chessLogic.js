export const createInitialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[6][col] = { type: 'pawn', color: 'white' };  // White pawns start at row 6
    board[1][col] = { type: 'pawn', color: 'black' };  // Black pawns start at row 1
  }
  
  // Set up other pieces
  const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let col = 0; col < 8; col++) {
    board[7][col] = { type: pieces[col], color: 'white' };  // White pieces at row 7
    board[0][col] = { type: pieces[col], color: 'black' };  // Black pieces at row 0
  }
  
  return board;
};

// Utility to check if a position is within board limits
const isValidPosition = (row, col) => row >= 0 && row < 8 && col >= 0 && col < 8;

export const calculateValidMoves = (board, row, col, piece, lastMove) => {
  const moves = [];
  const directions = {
    pawn: { white: -1, black: 1 },  // White moves up (-1), black moves down (1)
    rook: [[0, 1], [0, -1], [1, 0], [-1, 0]],
    knight: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
    bishop: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
    queen: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
    king: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
  };

  switch (piece.type) {
    case 'pawn':
      const direction = directions.pawn[piece.color];
      // Forward move
      if (!board[row + direction]?.[col]) {
        moves.push({ row: row + direction, col });
        // First move can be 2 squares
        if ((piece.color === 'white' && row === 6) || (piece.color === 'black' && row === 1)) {
          if (!board[row + 2 * direction]?.[col]) {
            moves.push({ row: row + 2 * direction, col });
          }
        }
      }
      // Diagonal captures
      [-1, 1].forEach(offset => {
        const targetRow = row + direction;
        const targetCol = col + offset;
        if (board[targetRow]?.[targetCol]?.color === (piece.color === 'white' ? 'black' : 'white')) {
          moves.push({ row: targetRow, col: targetCol });
        }
      });
      break;

    case 'rook':
    case 'bishop':
    case 'queen':
      directions[piece.type].forEach(([dRow, dCol]) => {
        let currentRow = row + dRow;
        let currentCol = col + dCol;
        while (
          currentRow >= 0 && currentRow < 8 &&
          currentCol >= 0 && currentCol < 8
        ) {
          if (!board[currentRow][currentCol]) {
            moves.push({ row: currentRow, col: currentCol });
          } else {
            if (board[currentRow][currentCol].color !== piece.color) {
              moves.push({ row: currentRow, col: currentCol });
            }
            break;
          }
          currentRow += dRow;
          currentCol += dCol;
        }
      });
      break;

    case 'knight':
      directions.knight.forEach(([dRow, dCol]) => {
        const targetRow = row + dRow;
        const targetCol = col + dCol;
        if (
          targetRow >= 0 && targetRow < 8 &&
          targetCol >= 0 && targetCol < 8 &&
          (!board[targetRow][targetCol] || board[targetRow][targetCol].color !== piece.color)
        ) {
          moves.push({ row: targetRow, col: targetCol });
        }
      });
      break;

    case 'king':
      directions.king.forEach(([dRow, dCol]) => {
        const targetRow = row + dRow;
        const targetCol = col + dCol;
        if (
          targetRow >= 0 && targetRow < 8 &&
          targetCol >= 0 && targetCol < 8 &&
          (!board[targetRow][targetCol] || board[targetRow][targetCol].color !== piece.color)
        ) {
          moves.push({ row: targetRow, col: targetCol });
        }
      });
      break;
  }

  return moves;
}

// Export the isMoveLegal function
export function isMoveLegal(board, from, to, piece) {
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  const kingPos = findKingPosition(newBoard, piece.color);
  return !isKingInCheck(newBoard, kingPos, piece.color);
}

function findKingPosition(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = board[row][col];
      if (square && square.type === 'king' && square.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

// Get all legal moves for a piece (moves that don't leave king in check)
function getLegalMoves(board, row, col, piece, lastMove) {
  const possibleMoves = calculateValidMoves(board, row, col, piece, lastMove);
  return possibleMoves.filter(move => 
    isMoveLegal(board, { row, col }, move, piece)
  );
}

export const checkGameState = (board, currentPlayer) => {
  // Find king position
  let kingRow, kingCol;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col]?.type === 'king' && board[row][col]?.color === currentPlayer) {
        kingRow = row;
        kingCol = col;
        break;
      }
    }
    if (kingRow !== undefined) break;
  }

  // Check if king is in check
  const isInCheck = isKingInCheck(board, { row: kingRow, col: kingCol }, currentPlayer);

  // Check if any legal move exists
  const playerPieces = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col]?.color === currentPlayer) {
        playerPieces.push({ row, col, piece: board[row][col] });
      }
    }
  }

  const hasValidMove = playerPieces.some(({ row, col, piece }) => {
    const moves = calculateValidMoves(board, row, col, piece);
    return moves.some(move => isMoveLegal(board, { row, col }, move, piece));
  });

  

  if (isInCheck) {
    return hasValidMove ? 'check' : 'checkmate';
  }

  return hasValidMove ? 'normal' : 'stalemate';
};
// Check if the king is in check
export function isKingInCheck(board, kingPos, currentPlayer) {
  if (!kingPos) return false;

  // Check for attacks from each direction
  const directions = {
    rook: [[1, 0], [-1, 0], [0, 1], [0, -1]],
    bishop: [[1, 1], [-1, -1], [1, -1], [-1, 1]],
    knight: [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2]]
  };

  // Check for pawn attacks
  const pawnDirections = currentPlayer === 'white' ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]];
  for (const [dx, dy] of pawnDirections) {
    const newRow = kingPos.row + dx;
    const newCol = kingPos.col + dy;
    if (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece && piece.type === 'pawn' && piece.color !== currentPlayer) {
        return true;
      }
    }
  }

  // Check for knight attacks
  for (const [dx, dy] of directions.knight) {
    const newRow = kingPos.row + dx;
    const newCol = kingPos.col + dy;
    if (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece && piece.type === 'knight' && piece.color !== currentPlayer) {
        return true;
      }
    }
  }

  // Check for rook/queen attacks
  for (const [dx, dy] of directions.rook) {
    let newRow = kingPos.row + dx;
    let newCol = kingPos.col + dy;
      while (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece) {
        if ((piece.type === 'rook' || piece.type === 'queen') && 
            piece.color !== currentPlayer) {
          return true;
          }
          break;
        }
        newRow += dx;
        newCol += dy;
      }
  }

  // Check for bishop/queen attacks
  for (const [dx, dy] of directions.bishop) {
    let newRow = kingPos.row + dx;
    let newCol = kingPos.col + dy;
    while (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece) {
        if ((piece.type === 'bishop' || piece.type === 'queen') && 
            piece.color !== currentPlayer) {
          return true;
        }
        break;
      }
      newRow += dx;
      newCol += dy;
    }
  }

  // Check for enemy king (prevents kings moving next to each other)
  for (const [dx, dy] of directions.rook.concat(directions.bishop)) {
    const newRow = kingPos.row + dx;
    const newCol = kingPos.col + dy;
    if (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece && piece.type === 'king' && piece.color !== currentPlayer) {
        return true;
      }
    }
  }

  return false;
}

// Convert board state to FEN notation
export const boardToFEN = (board) => {
  let fen = '';
  
  // Convert each row
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      
      if (piece) {
        // Add empty squares count if any
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        
        // Add piece to FEN
        const pieceChar = piece.type === 'knight' ? 'n' : piece.type[0];
        fen += piece.color === 'white' ? pieceChar.toUpperCase() : pieceChar.toLowerCase();
      } else {
        emptyCount++;
      }
    }
    
    // Add remaining empty squares count
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    
    // Add row separator
    if (row < 7) {
      fen += '/';
    }
  }
  
  return fen;
};

export function isValidMove(board, start, end, currentPlayer) {
  const piece = board[start.row][start.col];
  if (!piece) return false;

  // Check if it's the player's piece
  if (piece.color !== currentPlayer) return false;

  // Get valid moves for the piece
  const validMoves = getValidMoves(board, start, currentPlayer);
  
  // Check if the end position is in valid moves
  return validMoves.some(move => move.row === end.row && move.col === end.col);
}

export function makeMove(board, start, end, currentPlayer) {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[start.row][start.col];
  
  // Check for pawn promotion
  if (piece.type === 'pawn') {
    const isPromotion = (currentPlayer === 'white' && end.row === 0) || 
                       (currentPlayer === 'black' && end.row === 7);
    
    if (isPromotion) {
      // Promote to queen by default
      newBoard[end.row][end.col] = {
        type: 'queen',
        color: currentPlayer
      };
    } else {
      newBoard[end.row][end.col] = piece;
    }
  } else {
    newBoard[end.row][end.col] = piece;
  }
  
  newBoard[start.row][start.col] = null;
  return newBoard;
}

function getValidMoves(board, position, currentPlayer) {
  const piece = board[position.row][position.col];
  if (!piece) return [];

  const moves = [];
  const directions = {
    pawn: currentPlayer === 'white' ? -1 : 1,
    rook: [[0, 1], [0, -1], [1, 0], [-1, 0]],
    knight: [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]],
    bishop: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
    queen: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
    king: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
  };

  switch (piece.type) {
    case 'pawn':
      // Forward move
      const forwardRow = position.row + directions.pawn;
      if (forwardRow >= 0 && forwardRow < 8 && !board[forwardRow][position.col]) {
        moves.push({ row: forwardRow, col: position.col });
        
        // First move can be 2 squares
        if ((currentPlayer === 'white' && position.row === 6) || 
            (currentPlayer === 'black' && position.row === 1)) {
          const doubleRow = position.row + (2 * directions.pawn);
          if (!board[doubleRow][position.col]) {
            moves.push({ row: doubleRow, col: position.col });
          }
        }
      }
      
      // Diagonal captures
      [-1, 1].forEach(diag => {
        const captureRow = position.row + directions.pawn;
        const captureCol = position.col + diag;
        if (captureRow >= 0 && captureRow < 8 && captureCol >= 0 && captureCol < 8) {
          const targetPiece = board[captureRow][captureCol];
          if (targetPiece && targetPiece.color !== currentPlayer) {
            moves.push({ row: captureRow, col: captureCol });
          }
        }
      });
      break;

    case 'rook':
    case 'bishop':
    case 'queen':
      directions[piece.type].forEach(([dRow, dCol]) => {
        let currentRow = position.row + dRow;
        let currentCol = position.col + dCol;
        while (
          currentRow >= 0 && currentRow < 8 &&
          currentCol >= 0 && currentCol < 8
        ) {
          if (!board[currentRow][currentCol]) {
            moves.push({ row: currentRow, col: currentCol });
          } else {
            if (board[currentRow][currentCol].color !== piece.color) {
              moves.push({ row: currentRow, col: currentCol });
            }
            break;
          }
          currentRow += dRow;
          currentCol += dCol;
        }
      });
      break;

    case 'knight':
      directions.knight.forEach(([dRow, dCol]) => {
        const targetRow = position.row + dRow;
        const targetCol = position.col + dCol;
        if (
          targetRow >= 0 && targetRow < 8 &&
          targetCol >= 0 && targetCol < 8 &&
          (!board[targetRow][targetCol] || board[targetRow][targetCol].color !== piece.color)
        ) {
          moves.push({ row: targetRow, col: targetCol });
        }
      });
      break;

    case 'king':
      directions.king.forEach(([dRow, dCol]) => {
        const targetRow = position.row + dRow;
        const targetCol = position.col + dCol;
        if (
          targetRow >= 0 && targetRow < 8 &&
          targetCol >= 0 && targetCol < 8 &&
          (!board[targetRow][targetCol] || board[targetRow][targetCol].color !== piece.color)
        ) {
          moves.push({ row: targetRow, col: targetCol });
        }
      });
      break;
  }

  return moves.filter(move => {
    const targetPiece = board[move.row][move.col];
    return !targetPiece || targetPiece.color !== currentPlayer;
  });
}
