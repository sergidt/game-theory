import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DEPTH, Move } from '../definitions';
import { GameEngine } from '../game-engine';
import { minimaxPromisified } from '../minimax';

@Component({
    selector: 'cpu-placing-piece',
    standalone: true,
    imports: [
        NgOptimizedImage
    ],
    template: `
      <h4>The opponent is thinking about where to place the piece</h4>
      <img ngSrc="assets/thinking.png"
           width="140"
           height="140"/>
    `,
    styles: `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
        align-items: center;
        justify-content: center;
      }
    `
})
export class CpuPlacingPieceComponent implements OnInit {
    #game = inject(GameEngine);

    ngOnInit() {
        minimaxPromisified(this.#game, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, DEPTH, this.#game.selectedPiece()?.characteristics)
            .then(([move, value]: [Move | undefined, number]) => {
                if (move)
                    this.#game.move(move);
            });
    }
}
