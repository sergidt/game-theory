import { Injectable, signal, WritableSignal } from '@angular/core';
import { Board, CanWin, CharacteristicIndices, DEPTH, EMPTY, IntRange, Move, Piece, Position, WINNING_LINE_NAMES } from './definitions';

export function deepClone<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

@Injectable({ providedIn: 'root' })
export class GameEngine {
  #board: Board = [
    { row: 0, col: 0, coords: [57, 0, -57], piece: -1 },
    { row: 0, col: 1, coords: [57, 0, -19], piece: -1 },
    { row: 0, col: 2, coords: [57, 0, 19], piece: -1 },
    { row: 0, col: 3, coords: [57, 0, 57], piece: -1 },
    { row: 1, col: 0, coords: [19, 0, -57], piece: -1 },
    { row: 1, col: 1, coords: [19, 0, -19], piece: -1 },
    { row: 1, col: 2, coords: [19, 0, 19], piece: -1 },
    { row: 1, col: 3, coords: [19, 0, 57], piece: -1 },
    { row: 2, col: 0, coords: [-19, 0, -57], piece: -1 },
    { row: 2, col: 1, coords: [-19, 0, -19], piece: -1 },
    { row: 2, col: 2, coords: [-19, 0, 19], piece: -1 },
    { row: 2, col: 3, coords: [-19, 0, 57], piece: -1 },
    { row: 3, col: 0, coords: [-57, 0, -57], piece: -1 },
    { row: 3, col: 1, coords: [-57, 0, -19], piece: -1 },
    { row: 3, col: 2, coords: [-57, 0, 19], piece: -1 },
    { row: 3, col: 3, coords: [-57, 0, 57], piece: -1 },
  ];

  #moves: WritableSignal<Move[]> = signal<Move[]>([]);

  get board() {
    return this.#board;
  }

  moves = () => this.#moves();

  /**
   * Move a piece to a new position.
   * The piece is provided in the position object.
   * @param move
   */
  move(move: Move) { // TODO: Use makeMove function
    this.#board = deepClone<Board>(this.#board);
    this.#board.find((p: Position) => p.row === move.row && p.col === move.col)!.piece = move.piece;
    this.#moves.set([...this.#moves(), move]);
  }

  undo() {
    const moves = this.#moves();
    const lastMove = moves.pop();

    if (lastMove) {
      // Remove the last piece placed on the board
      this.move({ row: lastMove.row, col: lastMove.col, piece: EMPTY });
      this.#moves.set(moves);
    }
  }
}

export const getRows = (board: Board) => Array.from(new Array(4), (_, i) => board.slice(i * 4, i * 4 + 4));
export const getColumns = (board: Board) => Array.from(new Array(4), (_, i) => [board[i], board[i + 4], board[i + 8], board[i + 12]]);
export const getDiagonal1 = (board: Board) => [board[0], board[5], board[10], board[15]];
export const getDiagonal2 = (board: Board) => [board[3], board[6], board[9], board[12]];

export const getEmptyPositions = (board: Board) => board.filter(p => p.piece === EMPTY);

export const getFilledPositions = (positions: Position[]) => positions.filter(p => p.piece !== EMPTY);

export function number2binary(number: number): string {
  return (number >>> 0).toString(2).padStart(4, '0');
}

export function getSingleCharacteristic(piece: Piece, characteristic: 'Size' | 'Colour' | 'Shape' | 'Hole'): 0 | 1 {
  const characteristicValue = Number(number2binary(piece.characteristics).at(CharacteristicIndices[characteristic])!);
  if (characteristicValue !== 0 && characteristicValue !== 1) {
    throw new Error('Invalid characteristic');
  }
  return characteristicValue as 0 | 1;
}

export function getPossibleMoves(board: Board, withPiece?: IntRange<0, 16>): Array<Move> {
  const availablePieces = withPiece ? [withPiece] : getAvailablePieces(board);
  const availableMoves: Array<Move> = [];

  getEmptyPositions(board)
    .forEach(({ col, row }) => availablePieces.forEach(piece => availableMoves.push({ row, col, piece })));

  return availableMoves;
}

const MATCHES = Array.from(new Array(4), (_, i) => new Array(i + 1).fill(1).join(''))
  .concat(Array.from(new Array(4), (_, i) => new Array(i + 1).fill('0').join('')));

export function evaluatePositions(positions: Position[]) {
  const features = featuresByPosition(positions);
  const coincidences = features.reduce((acc, cur) => acc + (MATCHES.includes(cur) ? 1 : 0), 0);
  return coincidences ? coincidences * 10 : featuresByPosition.length * -10;
}

export function evaluateBoard(board: Board): number {
  if (gameWinner(board).win) return 1000;
  else {
    const rows = getRows(board);
    const columns = getColumns(board);
    const diagonal1 = getDiagonal1(board);
    const diagonal2 = getDiagonal2(board);

    return rows.concat(columns).concat([diagonal1], [diagonal2])
      .map(pieces => evaluatePositions(pieces)).reduce((acc, cur) => acc + cur, 0);
  }
}

export function featuresByPosition(positions: Position[]) {
  const filledPositions = getFilledPositions(positions);
  const concatenated = filledPositions.map(p => number2binary(p.piece)).join('');
  const featuresByPosition = [];

  for (let i = 0; i < 4; i++) {
    featuresByPosition.push(
      filledPositions.reduce((acc, cur, currentIndex) => acc += concatenated[currentIndex * 4 + i], '')
    );
  }
  return featuresByPosition;
}

export function getAvailablePieces(board: Board): Array<IntRange<0, 16>> {
  const pieces = new Set<IntRange<0, 16>>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  const placedPieces = board.filter(p => p.piece !== EMPTY).map(p => p.piece);
  placedPieces.forEach(p => pieces.delete(p as IntRange<0, 16>));
  return Array.from(pieces);
}

export interface WinningLine {
  win: boolean;
  positions: Position[];
  line: typeof WINNING_LINE_NAMES[number] | undefined;
}

export function gameWinner(board: Board): WinningLine {
  const rows = getRows(board);
  const columns = getColumns(board);
  const diagonal1 = getDiagonal1(board);
  const diagonal2 = getDiagonal2(board);
  const winningLines = rows.concat(columns).concat([diagonal1], [diagonal2]);

  return winningLines
    .reduce((acc: WinningLine, line: Position[], currentIndex) => {
      if (acc.win) {
        return acc as WinningLine;
      } else {
        const features = featuresByPosition(getFilledPositions(line));
        if (features[0].length === 4) { // Skip lines with less than 4, that means not all pieces are placed in the line

          return (features.includes('1111') || features.includes('0000')) // Winning line must have 4 pieces with some characteristic in common
            ? { win: true, positions: line, line: WINNING_LINE_NAMES[currentIndex] }
            : acc as WinningLine;
        } else {
          return acc as WinningLine;
        }
      }
    }, { win: false, positions: [], line: undefined });
}

export function gameDraw(board: Board): boolean {
  return board.every(p => p.piece !== EMPTY) && !gameWinner(board).win;
}

export function printBoard(board: Board) {
  console.log(
    getRows(board)
      .map(row => row.map(p => p.piece === EMPTY ? '    ' : number2binary(p.piece)).join(' | ')).join('\n--------------------------\n')
  );
}

export function makeMove(board: Board, move: Move): Board {
  const clonedBoard = deepClone<Board>(board);
  const position = clonedBoard.find((p: Position) => p.row === move.row && p.col === move.col);
  clonedBoard.splice(clonedBoard.indexOf(position!), 1, { ...position, ...move } as Position);
  return clonedBoard;
}

export function canWin(board: Board, piece: IntRange<0, 16>): CanWin {
  return getPossibleMoves(board, piece)
    .reduce((acc: CanWin, move) => {
      if (acc.win) return acc;
      else {
        const { win, line } = gameWinner(makeMove(board, move));
        return { win, move: win ? move : acc.move, line };
      }
    }, { win: false, move: undefined, line: undefined });
}

export function nextMove(game: GameEngine, piece: IntRange<0, 16>) {
  const { win, move } = canWin(game.board, piece);
  return win ? move : minimax(game, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, DEPTH, piece)[0];
}

export function minimax(game: GameEngine, alpha: number, beta: number, maximizingPlayer: boolean, depth = DEPTH,
  piece?: IntRange<0, 16>): [Move | undefined, number] {
  let bestMove: Move | undefined = undefined;

  // if terminal state (game over) or max depth (depth == 0)
  if (gameWinner(game.board).win || gameDraw(game.board) || depth === 0) {
    return [bestMove, evaluateBoard(game.board)];
  }

  let value = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

  const possibleMoves = getPossibleMoves(game.board, piece);

  for (let i = 0; i < possibleMoves.length; i++) {
    game.move(possibleMoves[i]);

    const [_, childEval] = minimax(game, alpha, beta, !maximizingPlayer, depth - 1);

    if (maximizingPlayer) {
      if (childEval > value) {
        value = childEval;
        bestMove = possibleMoves[i];
      }

      alpha = Math.max(alpha, childEval);
    } else {
      if (childEval < value) {
        value = childEval;
        bestMove = possibleMoves[i];
      }

      beta = Math.min(beta, childEval);
    }
    game.undo();

    if (beta <= alpha) {
      break;
    }
  }
  return [bestMove, value];
}


