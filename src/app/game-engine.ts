import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import anime from 'animejs';
import { toObservableSignal } from 'ngxtension/to-observable-signal';
import { tap } from 'rxjs';
import { Mesh } from 'three';
import { Board, DEPTH, EMPTY, GameAction, GameActions, GameState, GameStates, GameStateTransitions, Move, PieceCharacteristics, Position } from './definitions';
import { deepClone, describePiece, evaluateBoard, gameWinner, getAvailablePieces, getEmptyPositions, getPossibleMoves, randomSleep, shuffleArray } from './game.utils';
import { minimaxPromisified } from './minimax';

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

  getAvailablePieces(): Array<PieceCharacteristics> {
    return getAvailablePieces(this.#board);
  }

  getPossibleMoves(withPiece?: PieceCharacteristics): Array<Move> {
    return getPossibleMoves(this.#board, withPiece);
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
}

@Injectable({ providedIn: 'root' })
export class GameEngine {

  boardController = inject(BoardController);

  #renderedMeshes: Map<PieceCharacteristics, Mesh> = new Map<PieceCharacteristics, Mesh>();
  #destroyRef = inject(DestroyRef);
  pointedPiece = signal<PieceCharacteristics | null>(null);
  selectedPiece = signal<PieceCharacteristics | null>(null);
  availablePositionHovered = signal<Position | null>(null);
  showAvailablePositions = computed(() => this.currentState() === GameStates.UserPlacingPiece);

  constructor() {
    this.#cpuStatesManagement();

    effect(() => {
      console.log(`[Game Engine] -> selected piece: ${this.selectedPiece() || ''}`, this.selectedPiece() ?
        describePiece(this.selectedPiece()!) : 'None');
    });
  }

  describeSelectedPiece() {
    const selectedPiece = this.selectedPiece();
    return selectedPiece ? describePiece(selectedPiece) : 'No selected piece';
  }

  userPointingPiece(characteristics: PieceCharacteristics) {
    if (this.currentState() === GameStates.UserSelectingPiece) {
      this.pointedPiece.set(characteristics);
    }
  }

  piecePointedOut() {
    if (this.currentState() === GameStates.UserSelectingPiece) {
      this.pointedPiece.set(null);
    }
  }

  pieceSelectedByUser(piece: PieceCharacteristics) {
    if (this.currentState() === GameStates.UserSelectingPiece) {
      this.toggleSelection(piece);
      this.nextState(GameActions.PieceSelected);
    }
  }

  private pieceSelectedByCPU(piece: PieceCharacteristics) {
    if (this.currentState() === GameStates.CPUSelectingPiece)
      this.toggleSelection(piece);
  }

  registerMesh(piece: PieceCharacteristics, mesh: Mesh) {
    this.#renderedMeshes.set(piece, mesh);
  }

  toggleSelection(piece: PieceCharacteristics) {
    this.selectedPiece.set(this.selectedPiece() === piece ? null : piece);
  }

  hoverAvailablePosition(position: Position | null) {
    this.availablePositionHovered.set(position);
  }

  deselectedAnyPiece() {
    this.selectedPiece.set(null);
    this.pointedPiece.set(null);
  }

  #move(move: Move): Promise<void> {
    this.boardController.move(move);
    const position: [number, number, number] = this.boardController.getCoordinates(move.row, move.col) as [number, number, number];

    return anime({
      targets: [this.#renderedMeshes.get(move.piece as PieceCharacteristics)!.position],
      x: position[0],
      y: position[1],
      z: position[2],
      easing: "easeInQuad",
      duration: 1000,
      direction: "normal",
    })
      .finished;
  }

  async userMove(move: Position) {
    move.piece = this.selectedPiece() as PieceCharacteristics;
    await this.#move(move)
    this.deselectedAnyPiece();

    // TODO: manage game state
    this.nextState(GameActions.PiecePlaced);
  }

  /**
   * Move a piece to a new position.
   * The piece is provided in the position object.
   * @param move
   */


  // GAME STATE MACHINE

  currentState = signal<GameState>(GameStates.NewGame);

  playing = computed(() => !['NewGame', 'Draw', 'CPUWins', 'UserWins'].includes(this.currentState()));

  userAvailablePositions = computed(() => this.currentState() === 'UserPlacingPiece' ? getEmptyPositions(this.boardController.board) : []);

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

  /*
  It is not a perfomant algorithm
  */
  #cpuSelectingNextUserPiece(): Promise<PieceCharacteristics> {
    return new Promise(resolve => {
      const availablePieces = this.boardController.getAvailablePieces();

      if (availablePieces.length > 13) // less than 3 pieces are placed, impossible to win, yet
        resolve(shuffleArray(availablePieces)[0]);
      else {
        const possibleMoves: Array<Move & { win: boolean; value: number; }> = this.boardController.getPossibleMoves()
          .map(_ => ({ ..._, value: -1, win: false }));

        possibleMoves.forEach(move => {
          const board = this.boardController.move(move);
          move.value = evaluateBoard(board);
          move.win = gameWinner(board).win;
          this.boardController.undo();
        });

        resolve(possibleMoves.sort((a, b) => a.value - b.value).find(_ => !_.win)!.piece as PieceCharacteristics);
      }
    });
  }

  #cpuStatesManagement() {
    toObservableSignal(this.currentState)
      .pipe(
        tap(this.#manageCPUStates.bind(this)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  #manageCPUStates(state: GameState) {
    switch (state) {
      case GameStates.CPUPlacingPiece:
        minimaxPromisified(this.boardController, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, DEPTH, this.selectedPiece() || undefined)
          .then(([move, value]: [Move | undefined, number]) => {
            if (move) {
              this.#move(move)
                .then(() => {
                  this.deselectedAnyPiece();
                  this.nextState(GameActions.PiecePlaced);
                })
            }
          });
        break;

      case GameStates.CPUSelectingPiece:
        this.#cpuSelectingPieceStateManagement();
        /* this.#cpuSelectingNextUserPiece()
           .then(piece => {
             console.log(11111);
             return delayedPromise(this.pieceSelectedByCPU, piece);

           })
           .then(([value]) => {
             console.log(value);// this.nextState(GameActions.PieceSelected);
           });
           */
        break;
    }
  }

  async #cpuSelectingPieceStateManagement() {
    const piece = await this.#cpuSelectingNextUserPiece();
    await randomSleep();
    this.pieceSelectedByCPU(piece);
    this.nextState(GameActions.PieceSelected);
    console.log(piece);
  }

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
