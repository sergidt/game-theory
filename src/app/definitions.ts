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

/*
Piece Characteristics:
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
 */

export interface Piece {
    path: string;
    position: NgtVector3;
    placed: boolean;
    characteristics: IntRange<0, 16>;
}

export const PIECES: Piece[] = [
    {
        path: '/assets/round-big-hole.glb?dark=yes', position: [80, -12, -130], placed: false,
        characteristics: getPiece(Size.Big, Colour.Dark, Shape.Round, Hole.Yes)
    },
    {
        path: '/assets/round-big-hole.glb?dark=no', position: [50, -12, -130], placed: false,
        characteristics: getPiece(Size.Big, Colour.Light, Shape.Round, Hole.Yes)
    },
    {
        path: '/assets/round-big-no-hole.glb?dark=yes', position: [20, -12, -130], placed: false,
        characteristics: getPiece(Size.Big, Colour.Dark, Shape.Round, Hole.No)
    },
    {
        path: '/assets/round-big-no-hole.glb?dark=no', position: [-10, -12, -130], placed: false,
        characteristics: getPiece(Size.Big, Colour.Light, Shape.Round, Hole.No)
    },
    {
        path: '/assets/square-big-hole.glb?dark=yes', position: [-40, -12, -130], placed: false,
        characteristics: getPiece(Size.Big, Colour.Dark, Shape.Square, Hole.Yes)
    },
    {
        path: '/assets/square-big-hole.glb?dark=no', position: [-70, -12, -130], placed: false,
        characteristics: getPiece(Size.Big, Colour.Light, Shape.Square, Hole.Yes)
    },
    {
        path: '/assets/square-big-no-hole.glb?dark=yes', position: [-100, -12, -130], placed: false,
        characteristics: getPiece(Size.Big, Colour.Dark, Shape.Square, Hole.No)
    },
    {
        path: '/assets/square-big-no-hole.glb?dark=no', position: [-130, -12, -130], placed: false,
        characteristics: getPiece(Size.Big, Colour.Light, Shape.Square, Hole.No)
    },
    {
        path: '/assets/round-small-hole.glb?dark=yes', position: [80, -12, -160], placed: false,
        characteristics: getPiece(Size.Small, Colour.Dark, Shape.Round, Hole.Yes)
    },
    {
        path: '/assets/round-small-hole.glb?dark=no', position: [50, -12, -160], placed: false,
        characteristics: getPiece(Size.Small, Colour.Light, Shape.Round, Hole.Yes)
    },
    {
        path: '/assets/round-small-no-hole.glb?dark=yes', position: [20, -12, -160], placed: false,
        characteristics: getPiece(Size.Small, Colour.Dark, Shape.Round, Hole.No)
    },
    {
        path: '/assets/round-small-no-hole.glb?dark=no', position: [-10, -12, -160], placed: false,
        characteristics: getPiece(Size.Small, Colour.Light, Shape.Round, Hole.Yes)
    },
    {
        path: '/assets/square-small-hole.glb?dark=yes', position: [-40, -12, -160], placed: false,
        characteristics: getPiece(Size.Small, Colour.Dark, Shape.Square, Hole.Yes)
    },
    {
        path: '/assets/square-small-hole.glb?dark=no', position: [-70, -12, -160], placed: false,
        characteristics: getPiece(Size.Small, Colour.Light, Shape.Square, Hole.No)
    },
    {
        path: '/assets/square-small-no-hole.glb?dark=yes', position: [-100, -12, -160], placed: false,
        characteristics: getPiece(Size.Small, Colour.Dark, Shape.Square, Hole.No)
    },
    {
        path: '/assets/square-small-no-hole.glb?dark=no', position: [-130, -12, -160], placed: false,
        characteristics: getPiece(Size.Small, Colour.Light, Shape.Square, Hole.No)
    },
];

export function getPiece(size: Size, colour: Colour, shape: Shape, hole: Hole): IntRange<0, 16> {
    const value = parseInt(`${ size }${ colour }${ shape }${ hole }`, 2);

    if (value < 0 || value > 16) {
        throw new Error('Invalid piece characteristics');
    }

    return value as IntRange<0, 16>;
}

export function number2binary(number: number): string {
    return (number >>> 0).toString(2).padStart(4, '0');
}

export const CharacteristicIndices = {
    Size: 0,
    Colour: 1,
    Shape: 2,
    Hole: 3
};

export function getSingleCharacteristic(piece: Piece, characteristic: 'Size' | 'Colour' | 'Shape' | 'Hole'): 0 | 1 {
    const characteristicValue = Number(number2binary(piece.characteristics).at(CharacteristicIndices[characteristic])!);
    if (characteristicValue !== 0 && characteristicValue !== 1) {
        throw new Error('Invalid characteristic');
    }
    return characteristicValue as 0 | 1;
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


