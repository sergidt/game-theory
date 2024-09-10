import { DEPTH, IntRange, Move } from './definitions';
import { BoardController } from './game-engine';
import { evaluateBoard, gameDraw, gameWinner, getPossibleMoves } from './game.utils';

export function minimax(boardController: BoardController, alpha: number, beta: number, maximizingPlayer: boolean, depth = DEPTH,
    piece?: IntRange<0, 16>): [Move | undefined, number] {
    let bestMove: Move | undefined = undefined;

    // if terminal state (winner or draw) or max depth reached
    if (gameWinner(boardController.board).win || gameDraw(boardController.board) || depth === 0) {
        return [bestMove, evaluateBoard(boardController.board)];
    }

    let value = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    const possibleMoves = getPossibleMoves(boardController.board, piece);

    for (let i = 0; i < possibleMoves.length; i++) {
        boardController.move(possibleMoves[i]);

        const [_, childEval] = minimax(boardController, alpha, beta, !maximizingPlayer, depth - 1);

        if (maximizingPlayer) {
            if (childEval > value) {
                value = childEval;
                bestMove = possibleMoves[i];
            }

            alpha = Math.max(alpha, childEval);
        } else {
            if (childEval < value) {
                value = childEval;
                bestMove = possibleMoves[i];
            }

            beta = Math.min(beta, childEval);
        }
        boardController.undo();

        if (beta <= alpha) {
            break;
        }
    }
    return [bestMove, value];
}

// minimax as Promise
export async function minimaxPromisified(...params: Parameters<typeof minimax>): Promise<[Move | undefined, number]> {
    return new Promise(resolve => resolve(minimax(...params)));
}

