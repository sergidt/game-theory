/*
    Each property describes these properties with bits (0, 1):
    Size: Big -> 1, Small -> 0
    Colour: Dark -> 1,  -> 0
    Shape: Square -> 1, Round -> 0
    Hole: Yes -> 1, No -> 0
*/

export enum Size {
  Small = 0,
  Big = 1
};

export enum Colour {
  Light = 0,
  Dark = 1
};

export enum Shape {
  Round = 0,
  Square = 1
};

export enum Hole {
  No = 0,
  Yes = 1
};

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type Piece = IntRange<0, 16>;

export function getPiece(size: Size, colour: Colour, shape: Shape, hole: Hole): number {
  return parseInt(`${size}${colour}${shape}${hole}`, 2);
}



export interface Position {
    row: IntRange<0, 4>,
    col: IntRange<0, 4>
  piece?: Piece;
}

export type Board = [
                Position, Position, Position, Position,
                Position, Position, Position, Position,
                Position, Position, Position, Position,
                Position, Position, Position, Position,
            ];

export enum Turn  {
  User,
  CPU
}

export const PIECES = {
  BigDarkSquareHole: 15, // 1111
  BigDarkSquareNoHole: 14, // 1110
  BigDarkRoundHole: 13, // 1101
  BigDarkRoundNoHole: 12, // 1100
  BigLightSquareHole: 11, // 1011
 BigLightSquareNoHole:  10,  // 1010
 BigLightRoundHole:  9, // 1001
  BigLightRoundNoHole: 8, // 1000
  SmallDarkSquareHole: 7, // 0111
  SmallDarkSquareNoHole: 6, // 0110
  SmallDarkRoundHole: 5, // 0101
  SmallDarkRoundNoHole: 4, // 0100
  SmallLightSquareHole: 3,// 0011
  SmallLightSquareNoHole: 2, // 0010
  SmallLightRoundHole:1 , // 0001
 SmallLightRoundNoHole:0 , // 0000
};
