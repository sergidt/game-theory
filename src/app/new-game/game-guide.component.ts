import { Component, inject } from '@angular/core';
import { GameActions } from '../definitions';
import { GameEngine } from '../game-engine';
import { CpuPiecePlacingComponent } from './cpu-piece-placing.component';
import { CpuPieceSelectionComponent } from './cpu-piece-selection.component';
import { UserPiecePlacingComponent } from './user-piece-placing.component';
import { UserPieceSelectionComponent } from './user-piece-selection.component';

@Component({
  selector: 'game-guide',
  standalone: true,
  imports: [
    UserPieceSelectionComponent,
    CpuPieceSelectionComponent,
    UserPiecePlacingComponent,
    CpuPiecePlacingComponent,
  ],
  template: `
      <h2>Game guide</h2>
<div>{{game.currentState()}}</div>
      @switch (game.currentState()) {
        @case ('NewGame') {
          <div>Are you ready to start a new game?</div>
          <button (click)="game.nextState(GameActions.Ready)">Ready!</button>
        }
        @case ('UserSelectingPiece') {
          <user-piece-selection/>
        }
        @case ('CPUSelectingPiece') {
          <cpu-piece-selection/>
        }
        @case ('UserPlacingPiece') {
          <user-piece-placing/>
        }
        @case ('CPUPlacingPiece') {
          <cpu-piece-placing/>
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
