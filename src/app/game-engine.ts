import { Injectable, signal, WritableSignal } from '@angular/core';
import { Board, number2binary, PieceProperties, Position } from './definitions';
import { GameState, GameStates } from './state-machine';

@Injectable({ providedIn: 'root' })
export class GameEngine {
    #board: Board = [
        { row: 0, col: 0, position: [57, 0, -57] }, { row: 0, col: 1, position: [57, 0, -19] }, { row: 0, col: 2, position: [57, 0, 19] },
        { row: 0, col: 3, position: [57, 0, 57] },
        { row: 1, col: 0, position: [19, 0, -57] }, { row: 1, col: 1, position: [19, 0, -19] }, { row: 1, col: 2, position: [19, 0, 19] },
        { row: 1, col: 3, position: [19, 0, 57] },
        { row: 2, col: 0, position: [-19, 0, -57] }, { row: 2, col: 1, position: [-19, 0, -19] }, { row: 2, col: 2, position: [-19, 0, 19] },
        { row: 2, col: 3, position: [-19, 0, 57] },
        { row: 3, col: 0, position: [-57, 0, -57] }, { row: 3, col: 1, position: [-57, 0, -19] }, { row: 3, col: 2, position: [-57, 0, 19] },
        { row: 3, col: 3, position: [-57, 0, 57] },
    ];

    #moves: WritableSignal<Position[]> = signal<Position[]>([]);

    currentState = signal<GameState>(GameStates.NewGame);

    get board() {
        return this.#board;
    }

    move(position: Position) {
        this.#board.splice(this.#board.findIndex((p: Position) => p.row === position.row), 0, position);
    }

    undo() {
        const lastMove = this.#moves().pop();

        if (lastMove) {
            this.move({ position: lastMove.position, row: lastMove.row, col: lastMove.col });
            lastMove.piece!;
        }
    }
}

function getPossibleMoves(board: Board): Array<Position> {
    return board.filter(p => !p.piece);
}

export function getNextMove(depth: number = 3,
    game: GameEngine,
    alpha = Number.NEGATIVE_INFINITY,
    beta = Number.POSITIVE_INFINITY,
    isMaximizingPlayer = true): number {
    return 0;
    // Base case: evaluate board
    if (depth === 0)
        return evaluateBoard(game.board);

    // Recursive case: search possible moves
    let bestMove = null; // best move not set yet
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

function evaluateBoard(board: Board) {
    const rows = Array.from(new Array(4), (_, i) => board.slice(i * 4, i * 4 + 4));
    const columns = Array.from(new Array(4), (_, i) => [board[i], board[i + 4], board[i + 8], board[i + 12]]);
    const diagonal1 = [board[0], board[5], board[10], board[15]];
    const diagonal2 = [board[3], board[6], board[9], board[12]];

    return rows.concat(columns).concat([diagonal1], [diagonal2])
               .map(pieces => evaluatePositions(pieces)).reduce((acc, cur) => acc + cur, 0);
}

function evaluatePositions(positions: Position[]) {
    const filledPositions = positions.filter(p => !!p.piece);

    //console.log('Evaluating:\n', filledPositions.map(p => PIECES[p.piece!]).join('\n'));

    const value = filledPositions.reduce((acc, cur) => acc & cur.piece?.characteristics!, filledPositions.length ? 15 : 0);

    const commonFeatures = number2binary(value)
        .split('')
        .reduce((acc: string[], cur, currentIndex) => cur === '1' ? [...acc, PieceProperties[currentIndex]] : acc, []);
    // console.log('Common features:', commonFeatures);
    return commonFeatures.length;
}
