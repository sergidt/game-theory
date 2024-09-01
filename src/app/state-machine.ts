import { computed, effect, Injectable, signal } from '@angular/core';
import { IntRange } from './definitions';

export enum GameStates {
  NewGame = 'NewGame',
  UserSelectsPiece = 'UserSelectsPiece',
  UserPlacesPiece = 'UserPlacesPiece',
  CPUSelectsPiece = 'CPUSelectsPiece',
  CPUPlacesPiece = 'CPUPlacesPiece',
  UserWins = 'UserWins',
  CPUWins = 'CPUWins',
  Draw = 'Draw'
}

export enum GameActions {
  Ready = 'Ready',
  PieceSelected = 'PieceSelected',
  PiecePlaced = 'PiecePlaced',
  WinnerPiece = 'WinnerPiece',
  DrawPiece = 'DrawPiece',
  PlayAgain = 'PlayAgain'
}

export type GameState = keyof typeof GameStates;
export type GameAction = keyof typeof GameActions;

export type GameStateTransitions = {
  [state in GameState]: {
    [action in GameAction]?: GameState;
  }
}

@Injectable({ providedIn: 'root' })
export class GameStateMachine {
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

  currentState = signal<GameState>(GameStates.NewGame);

  playing = computed(() => !['NewGame', 'Draw', 'CPUWins', 'UserWins'].includes(this.currentState()));

  selectedPiece = signal<IntRange<0, 16> | null>(null);

  #allowedTransitions: GameStateTransitions = {
    [GameStates.NewGame]: {
      [GameActions.Ready]: GameStates.UserSelectsPiece
    },
    [GameStates.UserSelectsPiece]: {
      [GameActions.PieceSelected]: GameStates.CPUPlacesPiece
    },
    [GameStates.CPUPlacesPiece]: {
      [GameActions.PiecePlaced]: GameStates.CPUSelectsPiece,
      [GameActions.WinnerPiece]: GameStates.CPUWins,
      [GameActions.DrawPiece]: GameStates.Draw
    },
    [GameStates.CPUSelectsPiece]: {
      [GameActions.PieceSelected]: GameStates.UserPlacesPiece
    },
    [GameStates.UserPlacesPiece]: {
      [GameActions.PiecePlaced]: GameStates.UserSelectsPiece,
      [GameActions.WinnerPiece]: GameStates.UserWins,
      [GameActions.DrawPiece]: GameStates.Draw
    },
    [GameStates.UserWins]: {
      [GameActions.PlayAgain]: GameStates.NewGame
    },
    [GameStates.CPUWins]: {
      [GameActions.PlayAgain]: GameStates.NewGame
    },
    [GameStates.Draw]: {
      [GameActions.PlayAgain]: GameStates.NewGame
    }
  };

  constructor() {
    effect(() => console.log(`Current state: ${this.currentState()}`));
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

  toggleSelection(characteristics: IntRange<0, 16>) {
    this.selectedPiece.set(this.selectedPiece() === characteristics ? null : characteristics);
  }



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

export function minimax(game: GameEngine, alpha: number, beta: number, maximizingPlayer: boolean, depth = DEPTH, piece?: IntRange<0, 16>): [Move | undefined, number] {
  let bestMove: Move | undefined = undefined;

  // if terminal state (game over) or max depth (depth == 0)
  if (gameWinner(game.board).win || gameDraw(game.board) || depth === 0) {
    return [bestMove, evaluateBoard(game.board)];
  }

  let value = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

  const possibleMoves = getPossibleMoves(game.board, piece);

  for (let i = 0; i < possibleMoves.length; i++) {
    //const tabs = Array.from({ length: 2 - depth }, () => '\t');
    //console.log(`${tabs.join('')}Depth: ${depth} -> iteration: ${i}`);

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
      // console.log('-------------pruning-------------');
      break;
    }
  }
  return [bestMove, value];
}



