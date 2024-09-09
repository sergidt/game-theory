import { Component, inject } from '@angular/core';
import { GameActions } from '../definitions';
import { GameEngine } from '../game-engine';
import { CpuPlacingPieceComponent } from './cpu-placing-piece.component';
import { CpuSelectingPieceComponent } from './cpu-selecting-piece.component';
import { UserPlacingPieceComponent } from './user-placing-piece.component';
import { UserSelectingPieceComponent } from './user-selecting-piece.component';

@Component({
    selector: 'game-guide',
    standalone: true,
    imports: [
        UserSelectingPieceComponent,
        CpuSelectingPieceComponent,
        UserPlacingPieceComponent,
        CpuPlacingPieceComponent,
    ],
    template: `
      <h2>Game guide</h2>
      <div>{{ game.currentState() }}</div>
      @switch (game.currentState()) {
        @case ('NewGame') {
          <div>Are you ready to start a new game?</div>
          <button (click)="game.nextState(GameActions.Ready)">Ready!</button>
        }
        @case ('UserSelectingPiece') {
          <user-selecting-piece/>
        }
        @case ('CPUSelectingPiece') {
          <cpu-selecting-piece/>
        }
        @case ('UserPlacingPiece') {
          <user-placing-piece/>
        }
        @case ('CPUPlacingPiece') {
          <cpu-placing-piece/>
        }
        @case ('UserWon') {
          <div>Congratulations! You win!</div>
        }
        @case ('CPUWon') {
          <div>Sorry, You lose!</div>
        }
        @default {
          <div>It's a draw!</div>
        }
      }
    `,
    styles: `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
      }
    `
})
export class GameGuideComponent {
    protected readonly game = inject(GameEngine);
    protected readonly GameActions = GameActions;
}
