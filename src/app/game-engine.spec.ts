import { Board, EMPTY } from './definitions';
import { getPossibleMoves } from './game-engine';

describe('getPossibleMoves', () => {
    it('returns all possible moves when the board is empty', () => {
        const board: Board = [
            { row: 0, col: 0, position: [57, 0, -57], piece: EMPTY },
            { row: 0, col: 1, position: [57, 0, -19], piece: EMPTY },
            { row: 0, col: 2, position: [57, 0, 19], piece: EMPTY },
            { row: 0, col: 3, position: [57, 0, 57], piece: EMPTY },
            { row: 1, col: 0, position: [19, 0, -57], piece: EMPTY },
            { row: 1, col: 1, position: [19, 0, -19], piece: EMPTY },
            { row: 1, col: 2, position: [19, 0, 19], piece: EMPTY },
            { row: 1, col: 3, position: [19, 0, 57], piece: EMPTY },
            { row: 2, col: 0, position: [-19, 0, -57], piece: EMPTY },
            { row: 2, col: 1, position: [-19, 0, -19], piece: EMPTY },
            { row: 2, col: 2, position: [-19, 0, 19], piece: EMPTY },
            { row: 2, col: 3, position: [-19, 0, 57], piece: EMPTY },
            { row: 3, col: 0, position: [-57, 0, -57], piece: EMPTY },
            { row: 3, col: 1, position: [-57, 0, -19], piece: EMPTY },
            { row: 3, col: 2, position: [-57, 0, 19], piece: EMPTY },
            { row: 3, col: 3, position: [-57, 0, 57], piece: EMPTY },
        ];
        const moves = getPossibleMoves(board);
        expect(moves.length).toBe(16 * 16);
    });

    it('returns no moves when the board is full', () => {
        const board: Board = [
            { row: 0, col: 0, position: [57, 0, -57], piece: 0 },
            { row: 0, col: 1, position: [57, 0, -19], piece: 1 },
            { row: 0, col: 2, position: [57, 0, 19], piece: 2 },
            { row: 0, col: 3, position: [57, 0, 57], piece: 3 },
            { row: 1, col: 0, position: [19, 0, -57], piece: 4 },
            { row: 1, col: 1, position: [19, 0, -19], piece: 5 },
            { row: 1, col: 2, position: [19, 0, 19], piece: 6 },
            { row: 1, col: 3, position: [19, 0, 57], piece: 7 },
            { row: 2, col: 0, position: [-19, 0, -57], piece: 8 },
            { row: 2, col: 1, position: [-19, 0, -19], piece: 9 },
            { row: 2, col: 2, position: [-19, 0, 19], piece: 10 },
            { row: 2, col: 3, position: [-19, 0, 57], piece: 11 },
            { row: 3, col: 0, position: [-57, 0, -57], piece: 12 },
            { row: 3, col: 1, position: [-57, 0, -19], piece: 13 },
            { row: 3, col: 2, position: [-57, 0, 19], piece: 14 },
            { row: 3, col: 3, position: [-57, 0, 57], piece: 15 },
        ];
        const moves = getPossibleMoves(board);
        expect(moves.length).toBe(0);
    });

    it('returns correct moves when some positions are empty', () => {
        const board: Board = [
            { row: 0, col: 0, position: [57, 0, -57], piece: 0 },
            { row: 0, col: 1, position: [57, 0, -19], piece: EMPTY },
            { row: 0, col: 2, position: [57, 0, 19], piece: 2 },
            { row: 0, col: 3, position: [57, 0, 57], piece: EMPTY },
            { row: 1, col: 0, position: [19, 0, -57], piece: 4 },
            { row: 1, col: 1, position: [19, 0, -19], piece: EMPTY },
            { row: 1, col: 2, position: [19, 0, 19], piece: 6 },
            { row: 1, col: 3, position: [19, 0, 57], piece: EMPTY },
            { row: 2, col: 0, position: [-19, 0, -57], piece: 8 },
            { row: 2, col: 1, position: [-19, 0, -19], piece: EMPTY },
            { row: 2, col: 2, position: [-19, 0, 19], piece: 10 },
            { row: 2, col: 3, position: [-19, 0, 57], piece: EMPTY },
            { row: 3, col: 0, position: [-57, 0, -57], piece: 12 },
            { row: 3, col: 1, position: [-57, 0, -19], piece: EMPTY },
            { row: 3, col: 2, position: [-57, 0, 19], piece: 14 },
            { row: 3, col: 3, position: [-57, 0, 57], piece: EMPTY },
        ];
        const moves = getPossibleMoves(board);
        expect(moves.length).toBe(8 * 16);
    });
});
