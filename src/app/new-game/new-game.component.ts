import { Component, inject } from '@angular/core';
import { GameActions, GameStateMachine } from '../game-state-machine';
import { CpuPiecePlacingComponent } from './cpu-piece-placing.component';
import { CpuPieceSelectionComponent } from './cpu-piece-selection.component';
import { UserPiecePlacingComponent } from './user-piece-placing.component';
import { UserPieceSelectionComponent } from './user-piece-selection.component';

@Component({
    selector: 'new-game',
    standalone: true,
    imports: [
        UserPieceSelectionComponent,
        CpuPieceSelectionComponent,
        UserPiecePlacingComponent,
        CpuPiecePlacingComponent,
    ],
    template: `
      <h2>Quarto game</h2>
      
      @switch (gameStateMachine.currentState()) {
        @case ('NewGame') {
          <div>Are you ready to start a new game?</div>
          <button (click)="gameStateMachine.getNextState(GameActions.Ready)">Ready!</button>
        }
        @case ('UserSelectsPiece') {
          <user-piece-selection/>
        }
        @case ('CPUSelectsPiece') {
          <cpu-piece-selection/>
        }
        @case ('UserPlacesPiece') {
          <user-piece-placing/>
        }
        @case ('CPUSelectsPiece') {
          <cpu-piece-placing/>
        }
        @case ('UserWins') {
          <div>Congratulations! You win!</div>
        }
        @case ('CPUWins') {
          <div>Sorry! You lose!</div>
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
export class NewGameComponent {
    protected readonly gameStateMachine = inject(GameStateMachine);
    protected readonly GameActions = GameActions;
}
