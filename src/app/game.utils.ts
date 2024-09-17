import {
  Board, CharacteristicIndices, EMPTY, Move, Piece, PieceCharacteristics, PiecesCharacteristics, Position, WINNING_LINE_NAMES, WinningLine
} from './definitions';

export function deepClone<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

const MATCHES = Array.from(new Array(4), (_, i) => new Array(i + 1).fill(1).join(''))
  .concat(Array.from(new Array(4), (_, i) => new Array(i + 1).fill('0').join('')));

const getRows = (board: Board) => Array.from(new Array(4), (_, i) => board.slice(i * 4, i * 4 + 4));

const getColumns = (board: Board) => Array.from(new Array(4), (_, i) => [board[i], board[i + 4], board[i + 8], board[i + 12]]);

const getDiagonal1 = (board: Board) => [board[0], board[5], board[10], board[15]];

const getDiagonal2 = (board: Board) => [board[3], board[6], board[9], board[12]];

const getFilledPositions = (positions: Position[]) => positions.filter(p => p.piece !== EMPTY);

const number2binary = (number: number) => (number >>> 0).toString(2).padStart(4, '0');

const winningLines = (board: Board) => getRows(board).concat(getColumns(board)).concat([getDiagonal1(board)], [getDiagonal2(board)]);

export const getEmptyPositions = (board: Board) => board.filter(p => p.piece === EMPTY);

export const describePiece = (p: PieceCharacteristics) => PiecesCharacteristics[p];

export function getSingleCharacteristic(piece: Piece, characteristic: 'Size' | 'Colour' | 'Shape' | 'Hole'): 0 | 1 {
  const characteristicValue = Number(number2binary(piece.characteristics).at(CharacteristicIndices[characteristic])!);
  if (characteristicValue !== 0 && characteristicValue !== 1) {
    throw new Error('Invalid characteristic');
  }
  return characteristicValue as 0 | 1;
}

export function getPossibleMoves(board: Board, withPiece?: PieceCharacteristics): Array<Move> {
  const availablePieces = !nil(withPiece) ? [withPiece] : getAvailablePieces(board);
  const availableMoves: Array<Move> = [];

  getEmptyPositions(board)
    .forEach(({ col, row }) => availablePieces.forEach(piece => availableMoves.push({ row, col, piece: piece! })));

  return availableMoves;
}

export function evaluatePositions(positions: Position[]) {
  const features = featuresByPosition(positions);
  const coincidences = features.reduce((acc, cur) => acc + (MATCHES.includes(cur) ? 1 : 0), 0);
  return coincidences ? coincidences * 10 : featuresByPosition.length * -10;
}

export function evaluateBoard(board: Board): number {
  return gameWinner(board).win
    ? 1000
    : winningLines(board).map(pieces => evaluatePositions(pieces)).reduce((acc, cur) => acc + cur, 0);
}

function featuresByPosition(positions: Position[]) {
  const filledPositions = getFilledPositions(positions);
  const concatenated = filledPositions.map(p => number2binary(p.piece)).join('');
  const features = [];

  for (let i = 0; i < 4; i++) {
    features.push(filledPositions.reduce((acc, cur, currentIndex) => acc += concatenated[currentIndex * 4 + i], ''));
  }
  return features;
}

export function getAvailablePieces(board: Board): Array<PieceCharacteristics> {
  const pieces = new Set<PieceCharacteristics>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  const placedPieces = board.filter(p => p.piece !== EMPTY).map(p => p.piece);
  placedPieces.forEach(p => pieces.delete(p as PieceCharacteristics));
  return Array.from(pieces);
}

export function gameWinner(board: Board): WinningLine {
  return winningLines(board)
    .reduce((acc: WinningLine, line: Position[], currentIndex) => {
      if (acc.win) return acc as WinningLine;
      else {
        const features = featuresByPosition(getFilledPositions(line));
        if (features[0].length === 4) { // Skip lines with less than 4, meaning not all pieces are placed in the line
          return (features.includes('1111') || features.includes('0000')) // Winning line must have 4 pieces with some characteristic in common
            ? { win: true, positions: line, line: WINNING_LINE_NAMES[currentIndex] }
            : acc as WinningLine;
        } else
          return acc as WinningLine;
      }
    }, { win: false, positions: [], line: undefined });
}

export const gameDraw = (board: Board) => board.every(p => p.piece !== EMPTY) && !gameWinner(board).win;

export function printBoard(board: Board) {
  console.log(
    getRows(board)
      .map(row => row.map(p => p.piece === EMPTY ? '    ' : number2binary(p.piece)).join(' | ')).join('\n--------------------------\n')
  );
}

export const shuffleArray = <T>(array: T[]) => array.map((a) => ({ sort: Math.random(), value: a }))
  .sort((a, b) => a.sort - b.sort)
  .map((a) => a.value);

export async function randomSleep() {
  const rand = Math.random();
  const sleep = Math.min(rand * 5000, 3000);
  return new Promise(resolve => setTimeout(resolve, sleep));
}

export const nil = (value: any) => value === null || value === undefined;
