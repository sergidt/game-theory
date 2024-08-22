import { Component, input } from '@angular/core';
import { GameState } from '../state-machine';

@Component({
    selector: 'game-end',
    standalone: true,
    imports: [],
    template: `
      @if (gameState() === 'UserWins') {
        <div>Congratulations! You win!</div>
      } @else if (gameState() === 'CPUWins') {
        <div>Sorry! You lose!</div>
      } @else {
        <div>It's a draw!</div>
      }
    `,
    styles: ``
})
export class GameEndComponent {
    gameState = input.required<GameState>();
}
