import { Component, input } from '@angular/core';
import { AppButtonComponent } from '../button.component';
import { GameState } from '../state-machine';
import { CpuPiecePlacingComponent } from './cpu-piece-placing.component';
import { CpuPieceSelectionComponent } from './cpu-piece-selection.component';
import { GameEndComponent } from './game-end.component';
import { ShufflePiecesComponent } from './shuffle-pieces.component';
import { UserPiecePlacingComponent } from './user-piece-placing.component';
import { UserPieceSelectionComponent } from './user-piece-selection.component';

@Component({
    selector: 'new-game',
    standalone: true,
    imports: [
        ShufflePiecesComponent,
        UserPieceSelectionComponent,
        CpuPieceSelectionComponent,
        UserPiecePlacingComponent,
        CpuPiecePlacingComponent,
        GameEndComponent,
        AppButtonComponent
    ],
    template: `
      @switch (gameState()) {
        @case ('NewGame') {
          <div>New game. Are you ready to start?</div>
          <app-button text="Ready!"/>
        }
        @case ('ShufflePieces') {
          <shuffle-pieces/>
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
        @default {
          <game-end/>
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
    gameState = input.required<GameState>();

}
