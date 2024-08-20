/*
    Each property describes these properties with bits (0, 1):
    Size: Big -> 1, Small -> 0
    Colour: Dark -> 1,  -> 0
    Shape: Square -> 1, Round -> 0
    Hole: Yes -> 1, No -> 0
*/

import { NgtVector3 } from 'angular-three';

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

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type Piece = IntRange<0, 16>;

export function getPiece(size: Size, colour: Colour, shape: Shape, hole: Hole): number {
    return parseInt(`${ size }${ colour }${ shape }${ hole }`, 2);
}

export function number2binary(number: number): string {
    return (number >>> 0).toString(2);
}

export interface Position {
    row: IntRange<0, 4>;
    col: IntRange<0, 4>;
    position: NgtVector3;
    piece?: Piece;
}

export type Board = [
    Position, Position, Position, Position,
    Position, Position, Position, Position,
    Position, Position, Position, Position,
    Position, Position, Position, Position,
];

export const PIECES = {
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
