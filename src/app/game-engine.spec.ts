import { BoardController, EMPTY_BOARD } from './board.controller';
import { Board, EMPTY, Move } from './definitions';
import { deepClone, getAvailablePieces, getEmptyPositions, getPossibleMoves } from './game.utils';

describe('Border Controller', () => {
    let boardController: BoardController;

    beforeEach(() => {
        boardController = new BoardController();
    });

    describe('move', () => {
        it('places a piece on an empty position', () => {
            const move: Move = { row: 0, col: 0, piece: 1 };
            boardController.move(move);
            expect(boardController.board.find(p => p.row === move.row && p.col === move.col)!.piece).toBe(move.piece);
        });

        it('overwrites a piece on a non-empty position', () => {
            const initialMove: Move = { row: 0, col: 0, piece: 1 };
            const newMove: Move = { row: 0, col: 0, piece: 2 };
            boardController.move(initialMove);
            boardController.move(newMove);
            expect(boardController.board.find(p => p.row === newMove.row && p.col === newMove.col)!.piece).toBe(newMove.piece);
        });

        it('adds the move to the moves list', () => {
            const move: Move = { row: 0, col: 0, piece: 1 };
            boardController.move(move);
            expect(boardController.moves).toContain(move);
        });

        it('does not modify the original board array', () => {
            const originalBoard = deepClone(boardController.board);
            const move: Move = { row: 0, col: 0, piece: 1 };
            boardController.move(move);
            expect(boardController.board).not.toBe(originalBoard);
        });
    });

    describe('undo', () => {
        it('removes the last move from the moves list', () => {
            const move1: Move = { row: 0, col: 0, piece: 1 };
            const move2: Move = { row: 1, col: 1, piece: 2 };
            boardController.move(move1);
            boardController.move(move2);
            boardController.undo();
            expect(boardController.moves).not.toContain(move2);
            expect(boardController.moves).toContain(move1);
        });

        it('restores the last position to empty', () => {
            const move: Move = { row: 0, col: 0, piece: 1 };
            boardController.move(move);
            boardController.undo();
            expect(boardController.board.find(p => p.row === move.row && p.col === move.col)!.piece).toBe(EMPTY);
        });

        it('does nothing if there are no moves to undo', () => {
            const originalBoard = deepClone(boardController.board);
            boardController.undo();
            expect(boardController.board).toEqual(originalBoard);
            expect(boardController.moves.length).toBe(0);
        });
    });

    describe('getPossibleMoves', () => {
        it('returns all possible moves when the board is empty', () => {
            const moves = getPossibleMoves(EMPTY_BOARD);
            expect(moves.length).toBe(16 * 16);
        });

        it('returns no moves when the board is full', () => {
            const board: Board = [
                { row: 0, col: 0, coords: [57, 0, -57], piece: 0 },
                { row: 0, col: 1, coords: [57, 0, -19], piece: 1 },
                { row: 0, col: 2, coords: [57, 0, 19], piece: 2 },
                { row: 0, col: 3, coords: [57, 0, 57], piece: 3 },
                { row: 1, col: 0, coords: [19, 0, -57], piece: 4 },
                { row: 1, col: 1, coords: [19, 0, -19], piece: 5 },
                { row: 1, col: 2, coords: [19, 0, 19], piece: 6 },
                { row: 1, col: 3, coords: [19, 0, 57], piece: 7 },
                { row: 2, col: 0, coords: [-19, 0, -57], piece: 8 },
                { row: 2, col: 1, coords: [-19, 0, -19], piece: 9 },
                { row: 2, col: 2, coords: [-19, 0, 19], piece: 10 },
                { row: 2, col: 3, coords: [-19, 0, 57], piece: 11 },
                { row: 3, col: 0, coords: [-57, 0, -57], piece: 12 },
                { row: 3, col: 1, coords: [-57, 0, -19], piece: 13 },
                { row: 3, col: 2, coords: [-57, 0, 19], piece: 14 },
                { row: 3, col: 3, coords: [-57, 0, 57], piece: 15 },
            ];
            const moves = getPossibleMoves(board);
            expect(moves.length).toBe(0);
        });

        it('returns correct moves when some positions are empty', () => {
            const board: Board = [
                { row: 0, col: 0, coords: [57, 0, -57], piece: 0 },
                { row: 0, col: 1, coords: [57, 0, -19], piece: EMPTY },
                { row: 0, col: 2, coords: [57, 0, 19], piece: 2 },
                { row: 0, col: 3, coords: [57, 0, 57], piece: EMPTY },
                { row: 1, col: 0, coords: [19, 0, -57], piece: 4 },
                { row: 1, col: 1, coords: [19, 0, -19], piece: EMPTY },
                { row: 1, col: 2, coords: [19, 0, 19], piece: 6 },
                { row: 1, col: 3, coords: [19, 0, 57], piece: EMPTY },
                { row: 2, col: 0, coords: [-19, 0, -57], piece: 8 },
                { row: 2, col: 1, coords: [-19, 0, -19], piece: EMPTY },
                { row: 2, col: 2, coords: [-19, 0, 19], piece: 10 },
                { row: 2, col: 3, coords: [-19, 0, 57], piece: EMPTY },
                { row: 3, col: 0, coords: [-57, 0, -57], piece: 12 },
                { row: 3, col: 1, coords: [-57, 0, -19], piece: EMPTY },
                { row: 3, col: 2, coords: [-57, 0, 19], piece: 14 },
                { row: 3, col: 3, coords: [-57, 0, 57], piece: EMPTY },
            ];
            const availablePieces = getAvailablePieces(board);
            const emptyPositions = getEmptyPositions(board);

            expect(availablePieces.length).toBe(8);
            expect(emptyPositions.length).toBe(8);

            const moves = getPossibleMoves(board);
            expect(moves.length).toBe(emptyPositions.length * availablePieces.length);
        });
    });
});
