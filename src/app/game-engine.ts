import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Mesh } from 'three';
import { Board, EMPTY, GameAction, GameActions, GameState, GameStates, GameStateTransitions, Move, Piece, PieceCharacteristics, Position } from './definitions';
import { deepClone, describePiece } from './game.utils';

@Injectable({ providedIn: 'root' })
export class BoardController {
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

  #moveHistory: Move[] = [];

  get board() {
    return this.#board;
  }

  getCoordinates = (row: number, col: number) => this.#board.find(p => p.row === row && p.col === col)!.coords;

  get moves(): Move[] {
    return this.#moveHistory;
  }

  move(move: Move) {
    this.#setPieceOnBoard(move);
    this.#registerMove(move);
  }

  #setPieceOnBoard(move: Move) {
    this.#board = deepClone<Board>(this.#board);
    this.#board.find((p: Position) => p.row === move.row && p.col === move.col)!.piece = move.piece;
  };

  #registerMove(move: Move) {
    this.#moveHistory = [...this.moves, move];
  }

  undo() {
    const moves = this.moves.slice();
    const lastMove = moves.pop();

    if (lastMove) {
      // Remove the last piece placed on the board
      this.move({ row: lastMove.row, col: lastMove.col, piece: EMPTY });
      this.#moveHistory = moves;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class GameEngine {
  boardController = inject(BoardController);

  #renderedMeshes: Map<PieceCharacteristics, Mesh> = new Map<PieceCharacteristics, Mesh>();

  //pointedPiece = signal<

  selectedPiece = signal<Piece | null>(null);

  availablePositionHovered = signal<Position | null>(null);

  showAvailablePositions = computed(() => this.currentState() === GameStates.UserPlacingPiece);

  constructor() {
    effect(() => {
      console.log(`[Game Engine] -> selected piece: ${this.selectedPiece()?.characteristics || ''}`, this.selectedPiece() ?
        describePiece(this.selectedPiece()!) : 'None');
    });
  }

  registerMesh(piece: PieceCharacteristics, mesh: Mesh) {
    this.#renderedMeshes.set(piece, mesh);
  }

  //async cpuPlacePiece(piece: PieceCharacteristics) {
  //    const [move, value] = await minimaxPromisified(this, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, DEPTH, piece);
  //}

  toggleSelection(piece: Piece) {
    this.selectedPiece.set(this.selectedPiece()?.characteristics === piece.characteristics ? null : piece);
  }

  hoverAvailablePosition(position: Position | null) {
    this.availablePositionHovered.set(position);
  }

  /**
   * Move a piece to a new position.
   * The piece is provided in the position object.
   * @param move
   */


  // GAME STATE MACHINE

  currentState = signal<GameState>(GameStates.NewGame);

  playing = computed(() => !['NewGame', 'Draw', 'CPUWins', 'UserWins'].includes(this.currentState()));

  #allowedTransitions: GameStateTransitions = {
    [GameStates.NewGame]: {
      [GameActions.Ready]: GameStates.UserSelectingPiece
    },
    [GameStates.UserSelectingPiece]: {
      [GameActions.PieceSelected]: GameStates.CPUPlacingPiece
    },
    [GameStates.CPUPlacingPiece]: {
      [GameActions.PiecePlaced]: GameStates.CPUSelectingPiece,
      [GameActions.WinnerPiece]: GameStates.CPUWon,
      [GameActions.DrawPiece]: GameStates.Draw
    },
    [GameStates.CPUSelectingPiece]: {
      [GameActions.PieceSelected]: GameStates.UserPlacingPiece
    },
    [GameStates.UserPlacingPiece]: {
      [GameActions.PiecePlaced]: GameStates.UserSelectingPiece,
      [GameActions.WinnerPiece]: GameStates.UserWon,
      [GameActions.DrawPiece]: GameStates.Draw
    },
    [GameStates.UserWon]: {
      [GameActions.PlayAgain]: GameStates.NewGame
    },
    [GameStates.CPUWon]: {
      [GameActions.PlayAgain]: GameStates.NewGame
    },
    [GameStates.Draw]: {
      [GameActions.PlayAgain]: GameStates.NewGame
    }
  };

  getCurrentStateAvailableActions = () => this.#allowedTransitions[this.currentState()];

  nextState(action: GameAction) {
    const currentStateActions = this.getCurrentStateAvailableActions();

    if (!currentStateActions)
      throw new Error(`This action cannot be applied to the current state: ${this.currentState()}`);

    const nextState = currentStateActions[action];

    if (!nextState)
      throw new Error(`Action ${action} is not a valid step from current state:  ${this.currentState()}`);

    this.currentState.set(nextState);
  }
}

/*
    anime({
        targets: [event.object.position],
        z: 57,
        y: 0,
        easing: "easeInQuad",
        duration: 1000,
        direction: "normal",
      });
*/
