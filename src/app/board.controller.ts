import { Injectable } from '@angular/core';
import { Board, EMPTY, Move, PieceCharacteristics, Position, WinningLine } from './definitions';
import { deepClone, gameDraw, gameWinner, getAvailablePieces, getPossibleMoves } from './game.utils';

export const EMPTY_BOARD: Board = [
  { row: 0, col: 0, coords: [57, 0, -57], piece: EMPTY },
  { row: 0, col: 1, coords: [57, 0, -19], piece: EMPTY },
  { row: 0, col: 2, coords: [57, 0, 19], piece: EMPTY },
  { row: 0, col: 3, coords: [57, 0, 57], piece: EMPTY },
  { row: 1, col: 0, coords: [19, 0, -57], piece: EMPTY },
  { row: 1, col: 1, coords: [19, 0, -19], piece: EMPTY },
  { row: 1, col: 2, coords: [19, 0, 19], piece: EMPTY },
  { row: 1, col: 3, coords: [19, 0, 57], piece: EMPTY },
  { row: 2, col: 0, coords: [-19, 0, -57], piece: EMPTY },
  { row: 2, col: 1, coords: [-19, 0, -19], piece: EMPTY },
  { row: 2, col: 2, coords: [-19, 0, 19], piece: EMPTY },
  { row: 2, col: 3, coords: [-19, 0, 57], piece: EMPTY },
  { row: 3, col: 0, coords: [-57, 0, -57], piece: EMPTY },
  { row: 3, col: 1, coords: [-57, 0, -19], piece: EMPTY },
  { row: 3, col: 2, coords: [-57, 0, 19], piece: EMPTY },
  { row: 3, col: 3, coords: [-57, 0, 57], piece: EMPTY },
];

@Injectable({ providedIn: 'root' })
export class BoardController {
  #board: Board = EMPTY_BOARD;

  #moveHistory: Move[] = [];

  get board() {
    return this.#board;
  }

  getCoordinates = (row: number, col: number) => this.#board.find(p => p.row === row && p.col === col)!.coords;

  get moves(): Move[] {
    return this.#moveHistory;
  }

  getAvailablePieces(): Array<PieceCharacteristics> {
    return getAvailablePieces(this.#board);
  }

  getPossibleMoves(withPiece?: PieceCharacteristics): Array<Move> {
    return getPossibleMoves(this.#board, withPiece);
  }

  isPlaced(characteristics: PieceCharacteristics): boolean {
    return this.#board.some(p => p.piece === characteristics);
  }

  move(move: Move): Board {
    this.#setPieceOnBoard(move);
    this.#registerMove(move);
    return this.#board;
  }

  #setPieceOnBoard(move: Move) {
    this.#board = deepClone<Board>(this.#board);
    this.#board.find((p: Position) => p.row === move.row && p.col === move.col)!.piece = move.piece;
  };

  #registerMove(move: Move) {
    this.#moveHistory = [...this.moves, move];
  }

  undo(): Board {
    const moves = this.moves.slice();
    const lastMove = moves.pop();

    if (lastMove) {
      // Remove the last piece placed on the board
      this.move({ row: lastMove.row, col: lastMove.col, piece: EMPTY });
      this.#moveHistory = moves;
    }
    return this.#board;
  }

  evaluateBoard(): { draw: boolean; winningLine: WinningLine; } {
    return {
      draw: gameDraw(this.#board),
      winningLine: gameWinner(this.#board)
    };
  }
}

