import { Component, inject } from '@angular/core';
import { GameEngine } from '../game-engine';

@Component({
    selector: 'user-placing-piece',
    standalone: true,
    template: `
      <h3>AI algorithm chose this piece for you:</h3><p class="piece-description">{{ game.describeSelectedPiece() }}</p><p>
        Place this piece, selecting one available position. Please, click over any pink disk </p>
    `,
    styles: `
      .piece-description {
        font-size: 1.2em;
        color: #23b5f1;
        font-weight: bold;
      }
    `
})
export class UserPlacingPieceComponent {
    game = inject(GameEngine);
}
