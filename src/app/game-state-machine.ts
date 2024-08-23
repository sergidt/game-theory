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
        effect(() => console.log(`Current state: ${ this.currentState() }`));
    }

    getCurrentStateAvailableActions = () => this.#allowedTransitions[this.currentState()];

    nextState(action: GameAction) {
        const currentStateActions = this.getCurrentStateAvailableActions();

        if (!currentStateActions)
            throw new Error(`This action cannot be applied to the current state: ${ this.currentState() }`);

        const nextState = currentStateActions[action];

        if (!nextState)
            throw new Error(`Action ${ action } is not a valid step from current state:  ${ this.currentState() }`);

        this.currentState.set(nextState);
    }

    toggleSelection(characteristics: IntRange<0, 16>) {
        this.selectedPiece.set(this.selectedPiece() === characteristics ? null : characteristics);
    }
}
