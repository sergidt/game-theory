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
    DrawPiece = 'DrawPiece'
}

export type GameState = keyof typeof GameStates;
export type GameAction = keyof typeof GameActions;

type FromStates = Exclude<GameState, 'UserWon' | 'CPUWon' | 'Draw'>;

export type StateMachine = {
    [state in FromStates]?: {
        [action in GameAction]?: GameState;
    }
}

export const StateMachine: StateMachine = {
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
    }
};

const getNextState = (currentState: FromStates, action: GameAction) => {
    const currentStateActions = StateMachine[currentState];

    if (!currentStateActions) {
        throw new Error(`State ${ currentState } is not a valid state`);
    }

    const nextState = currentStateActions[action];

    if (!nextState) {
        throw new Error(`Action ${ action } is not a valid step from state ${ currentState }`);
    }

    return nextState;
};
