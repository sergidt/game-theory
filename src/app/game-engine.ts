import { Injectable, signal, WritableSignal } from '@angular/core';
import { Board, DEPTH, EMPTY, IntRange, Move, Position } from './definitions';
import { deepClone, evaluateBoard, gameDraw, gameWinner, getPossibleMoves } from './game.utils';


@Injectable({ providedIn: 'root' })
export class GameEngine {
  #board: Board = [
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

  #moves: WritableSignal<Move[]> = signal<Move[]>([]);

  get board() {
    return this.#board;
  }

  moves = (): Move[] => this.#moves();

  /**
   * Move a piece to a new position.
   * The piece is provided in the position object.
   * @param move
   */
  move(move: Move) {
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

