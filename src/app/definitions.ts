import { NgtVector3 } from 'angular-three';

export const DarkColor = '#2F5CBB';
export const LightColor = '#ffe7e2';
export const SelectionColor = '#ff9e42';

// the minimax algorithm takes only few ms to return any result. We want to simulate a normal behavior applying this delay
export const CPU_THINKING_DELAY = 2000;

/*
    Each property describes these characteristics with bits (0, 1):
    Size: Big -> 1, Small -> 0
    Colour: Dark -> 1,  -> 0
    Shape: Square -> 1, Round -> 0
    Hole: Yes -> 1, No -> 0

*/

//  Piece Characteristics:

export const PiecesCharacteristics = {
  15: 'Big Dark Square Hole', // 1111
  14: 'Big Dark Square No Hole', // 1110
  13: 'Big Dark Round Hole', // 1101
  12: 'Big Dark Round No Hole', // 1100
  11: 'Big Light Square Hole', // 1011
  10: 'Big Light Square No Hole',  // 1010
  9: 'Big Light Round Hole', // 1001
  8: 'Big Light Round No Hole', // 1000
  7: 'Small Dark Square Hole', // 0111
  6: 'Small Dark Square No Hole', // 0110
  5: 'Small Dark Round Hole', // 0101
  4: 'Small Dark Round No Hole', // 0100
  3: 'Small Light Square Hole',// 0011
  2: 'Small Light Square No Hole', // 0010
  1: 'Small Light Round Hole', // 0001
  0: 'Small Light Round No Hole', // 0000
};

export let COUNTER = 0;
export const DEPTH = 2;
export const WINNING_LINE_NAMES = ['Row 1', 'Row 2', 'Row 3', 'Row 4', 'Column 1', 'Column 2', 'Column 3', 'Column 4', 'Diagonal 1',
  'Diagonal 2'] as const;
export const EMPTY = -1;

export const CharacteristicIndices = {
  Size: 0,
  Colour: 1,
  Shape: 2,
  Hole: 3
};

export interface CanWin {
  win: boolean;
  move: Move | undefined;
  line: typeof WINNING_LINE_NAMES[number] | undefined;
}

export enum Size {
  Small = 0,
  Big = 1
}

export enum Colour {
  Light = 0,
  Dark = 1
}

export enum Shape {
  Round = 0,
  Square = 1
}

export enum Hole {
  No = 0,
  Yes = 1
}

export const PieceProperties = ['Size', 'Colour', 'Shape', 'Hole'];

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type PieceCharacteristics = IntRange<0, 16>;

export interface Piece {
  path: string;
  position: NgtVector3;
  characteristics: PieceCharacteristics;
}

export function getPiece(size: Size, colour: Colour, shape: Shape, hole: Hole): PieceCharacteristics {
  const value = parseInt(`${size}${colour}${shape}${hole}`, 2);

  if (value < 0 || value > 16) {
    throw new Error('Invalid piece characteristics');
  }

  return value as PieceCharacteristics;
}

export const PIECES: Piece[] = [
  {
    path: '/assets/round-big-hole.glb?dark=yes',
    position: [57, -12, -130],
    characteristics: getPiece(Size.Big, Colour.Dark, Shape.Round, Hole.Yes)
  },
  {
    path: '/assets/round-big-hole.glb?dark=no',
    position: [19, -12, -130],
    characteristics: getPiece(Size.Big, Colour.Light, Shape.Round, Hole.Yes)
  },
  {
    path: '/assets/round-big-no-hole.glb?dark=yes',
    position: [-19, -12, -130],
    characteristics: getPiece(Size.Big, Colour.Dark, Shape.Round, Hole.No)
  },
  {
    path: '/assets/round-big-no-hole.glb?dark=no',
    position: [-57, -12, -130],
    characteristics: getPiece(Size.Big, Colour.Light, Shape.Round, Hole.No)
  },
  {
    path: '/assets/square-big-hole.glb?dark=yes',
    position: [57, -12, 130],
    characteristics: getPiece(Size.Big, Colour.Dark, Shape.Square, Hole.Yes)
  },
  {
    path: '/assets/square-big-hole.glb?dark=no',
    position: [19, -12, 130],
    characteristics: getPiece(Size.Big, Colour.Light, Shape.Square, Hole.Yes)
  },
  {
    path: '/assets/square-big-no-hole.glb?dark=yes',
    position: [-19, -12, 130],
    characteristics: getPiece(Size.Big, Colour.Dark, Shape.Square, Hole.No)
  },
  {
    path: '/assets/square-big-no-hole.glb?dark=no',
    position: [-57, -12, 130],
    characteristics: getPiece(Size.Big, Colour.Light, Shape.Square, Hole.No)
  },
  {
    path: '/assets/round-small-hole.glb?dark=yes',
    position: [130, -12, 57],
    characteristics: getPiece(Size.Small, Colour.Dark, Shape.Round, Hole.Yes)
  },
  {
    path: '/assets/round-small-hole.glb?dark=no',
    position: [130, -12, 19],
    characteristics: getPiece(Size.Small, Colour.Light, Shape.Round, Hole.No)
  },
  {
    path: '/assets/round-small-no-hole.glb?dark=yes',
    position: [130, -12, -19],
    characteristics: getPiece(Size.Small, Colour.Dark, Shape.Round, Hole.No)
  },
  {
    path: '/assets/round-small-no-hole.glb?dark=no',
    position: [130, -12, -57],
    characteristics: getPiece(Size.Small, Colour.Light, Shape.Round, Hole.Yes)
  },
  {
    path: '/assets/square-small-hole.glb?dark=yes',
    position: [-130, -12, 57],
    characteristics: getPiece(Size.Small, Colour.Dark, Shape.Square, Hole.Yes)
  },
  {
    path: '/assets/square-small-hole.glb?dark=no',
    position: [-130, -12, 19],
    characteristics: getPiece(Size.Small, Colour.Light, Shape.Square, Hole.Yes)
  },
  {
    path: '/assets/square-small-no-hole.glb?dark=yes',
    position: [-130, -12, -19],
    characteristics: getPiece(Size.Small, Colour.Dark, Shape.Square, Hole.No)
  },
  {
    path: '/assets/square-small-no-hole.glb?dark=no',
    position: [-130, -12, -57],
    characteristics: getPiece(Size.Small, Colour.Light, Shape.Square, Hole.No)
  },
];

export interface Position {
  row: IntRange<0, 4>;
  col: IntRange<0, 4>;
  coords: NgtVector3;
  piece: PieceCharacteristics | typeof EMPTY;
}

export type Move = Omit<Position, 'coords'>;

export type Board = [
  Position, Position, Position, Position,
  Position, Position, Position, Position,
  Position, Position, Position, Position,
  Position, Position, Position, Position,
];

// GAME STATE MACHINE DEFINITIONS

export enum GameStates {
  NewGame = 'NewGame',
  UserSelectingPiece = 'UserSelectingPiece',
  UserPlacingPiece = 'UserPlacingPiece',
  CPUSelectingPiece = 'CPUSelectingPiece',
  CPUPlacingPiece = 'CPUPlacingPiece',
  UserWon = 'UserWon',
  CPUWon = 'CPUWon',
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
