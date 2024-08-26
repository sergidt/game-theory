import { Injectable, signal, WritableSignal } from '@angular/core';
import { Board, EMPTY, IntRange, Movement, number2binary, PieceProperties, Position } from './definitions';

@Injectable({ providedIn: 'root' })
export class GameEngine {
    #board: Board = [
        { row: 0, col: 0, coords: [57, 0, -57], piece: -1 },
        { row: 0, col: 1, coords: [57, 0, -19], piece: -1 },
        { row: 0, col: 2, coords: [57, 0, 19], piece: -1 },
        { row: 0, col: 3, coords: [57, 0, 57], piece: -1 },
        { row: 1, col: 0, coords: [19, 0, -57], piece: -1 },
        { row: 1, col: 1, coords: [19, 0, -19], piece: -1 },
        { row: 1, col: 2, coords: [19, 0, 19], piece: -1 },
        { row: 1, col: 3, coords: [19, 0, 57], piece: -1 },
        { row: 2, col: 0, coords: [-19, 0, -57], piece: -1 },
        { row: 2, col: 1, coords: [-19, 0, -19], piece: -1 },
        { row: 2, col: 2, coords: [-19, 0, 19], piece: -1 },
        { row: 2, col: 3, coords: [-19, 0, 57], piece: -1 },
        { row: 3, col: 0, coords: [-57, 0, -57], piece: -1 },
        { row: 3, col: 1, coords: [-57, 0, -19], piece: -1 },
        { row: 3, col: 2, coords: [-57, 0, 19], piece: -1 },
        { row: 3, col: 3, coords: [-57, 0, 57], piece: -1 },
    ];

    #moves: WritableSignal<Movement[]> = signal<Movement[]>([]);

    get board() {
        return this.#board;
    }

    moves = () => this.#moves();

    /**
     * Move a piece to a new position.
     * The piece is provided in the position object.
     * @param move
     */
    move(move: Movement) {
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

export function deepClone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
}

export const getEmptyPositions = (board: Board) => board.filter(p => p.piece === EMPTY);

export function getPossibleMoves(board: Board): Array<Movement> {
    const emptyPositions = getEmptyPositions(board);
    const availablePieces = getAvailablePieces(board);
    const availableMoves: Array<Movement> = [];
    emptyPositions.forEach(({ col, row }) => availablePieces.forEach(piece => availableMoves.push({ row, col, piece })));
    return availableMoves;
}

/*
export function getNextMove(depth: number = 3,
    game: GameEngine,
    alpha = Number.NEGATIVE_INFINITY,
    beta = Number.POSITIVE_INFINITY,
    isMaximizingPlayer = true): number {
    let bestMove = undefined;
    return 1;
    // Base case: evaluate board
    if (depth === 0)
        return evaluateBoard(game.board);
    debugger;
    // best move not set yet
    const possibleMoves = getPossibleMoves(game.board);

    // Set a default best move value
    let bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    // Search through all possible moves
    for (let i = 0; i < possibleMoves.length; i++) {
        const move = possibleMoves[i];
        // Make the move, but undo before exiting loop
        game.move(move);
        // Recursively get the value from this move
        const value = getNextMove(depth - 1, game, alpha, beta, !isMaximizingPlayer);
        // Log the value of this move
        console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
            bestMove, bestMoveValue);

        if (isMaximizingPlayer) {
            // Look for moves that maximize position
            if (value > bestMoveValue) {
                bestMoveValue = value;
                bestMove = move;
            }
            alpha = Math.max(alpha, value);
        } else {
            // Look for moves that minimize position
            if (value < bestMoveValue) {
                bestMoveValue = value;
                bestMove = move;
            }
            beta = Math.min(beta, value);
        }
        // Undo previous move
        game.undo();
        // Check for alpha beta pruning
        if (beta <= alpha) {
            console.log('Prune', alpha, beta);
            break;
        }
    }
}

 */

const getRows = (board: Board) => Array.from(new Array(4), (_, i) => board.slice(i * 4, i * 4 + 4));
const getColumns = (board: Board) => Array.from(new Array(4), (_, i) => [board[i], board[i + 4], board[i + 8], board[i + 12]]);
const getDiagonal1 = (board: Board) => [board[0], board[5], board[10], board[15]];
const getDiagonal2 = (board: Board) => [board[3], board[6], board[9], board[12]];

function evaluateBoard(board: Board): number {
    const rows = getRows(board);
    const columns = getColumns(board);
    const diagonal1 = getDiagonal1(board);
    const diagonal2 = getDiagonal2(board);

    return rows.concat(columns).concat([diagonal1], [diagonal2])
               .map(pieces => evaluatePositions(pieces)).reduce((acc, cur) => acc + cur, 0);
}

function evaluatePositions(positions: Position[]) {
    const filledPositions = positions.filter(p => !!p.piece);

    //console.log('Evaluating:\n', filledPositions.map(p => PIECES[p.piece!]).join('\n'));

    const value = filledPositions.reduce((acc, cur) => acc & cur.piece, filledPositions.length ? 15 : 0);

    const commonFeatures = number2binary(value)
        .split('')
        .reduce((acc: string[], cur, currentIndex) => cur === '1' ? [...acc, PieceProperties[currentIndex]] : acc, []);
    // console.log('Common features:', commonFeatures);
    return commonFeatures.length;
}

export function getAvailablePieces(board: Board): Array<IntRange<0, 16>> {
    const pieces = new Set<IntRange<0, 16>>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const placedPieces = board.filter(p => p.piece !== EMPTY).map(p => p.piece);
    placedPieces.forEach(p => pieces.delete(p as IntRange<0, 16>));
    return Array.from(pieces);
}

export function gameWinner(board: Board): boolean {
    const rows = getRows(board);
    const columns = getColumns(board);
    const diagonal1 = getDiagonal1(board);
    const diagonal2 = getDiagonal2(board);

    return rows.concat(columns).concat([diagonal1], [diagonal2])
               .map(pieces => evaluatePositions(pieces)).reduce((acc, cur) => acc + cur, 0) === 4;
}

export function gameDraw(board: Board): boolean {
    return board.every(p => !!p.piece) && !gameWinner(board);
}

export function minimax(game: GameEngine, depth: number, alpha: number, beta: number, maximizing_player: boolean): [Movement | undefined, number] {
    // if terminal state (game over) or max depth (depth == 0)
    if (gameWinner(game.board) || gameDraw(game.board) || depth === 0) {
        return [undefined, evaluatePositions(game.board)];
    }

    let bestMove;
    if (maximizing_player) {
        // find move with the best possible score
        let maxEval = -Infinity;
        let possibleMoves = getPossibleMoves(game.board);

        for (let i = 0; i < possibleMoves.length; i++) {
            game.move(possibleMoves[i]);
            let [childBestMove, childEval] = minimax(game, depth - 1, alpha, beta, false);
            if (childEval > maxEval) {
                maxEval = childEval;
                bestMove = possibleMoves[i];
            }
            game.undo();

            // alpha beta pruning
            alpha = Math.max(alpha, childEval);
            if (beta <= alpha) {
                break;
            }
        }
        return [bestMove, maxEval];

    } else {
        // find move with the worst possible score (for maximizer)
        let minEval = +Infinity;
        let possibleMoves = getPossibleMoves(game.board);
        for (let i = 0; i < possibleMoves.length; i++) {

            game.move(possibleMoves[i]);
            let [childBestMove, childEval] = minimax(game, depth - 1, alpha, beta, true);
            if (childEval < minEval) {
                minEval = childEval;
                bestMove = possibleMoves[i];
            }
            game.undo();

            // alpha beta pruning
            beta = Math.min(beta, childEval);
            if (beta <= alpha) {
                break;
            }
        }
        return [bestMove, minEval];
    }
}


