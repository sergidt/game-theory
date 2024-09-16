import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GameEngine } from '../game-engine';

@Component({
    selector: 'cpu-placing-piece',
    standalone: true,
    imports: [NgOptimizedImage],
    template: `
      <h3>The opponent is thinking about where to place the piece</h3>
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
export class CpuPlacingPieceComponent {
    #game = inject(GameEngine);
}
