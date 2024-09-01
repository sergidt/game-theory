import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Board } from './board.component';
import { DEPTH } from './definitions';
import { GameDialogComponent } from './dialog.component';
import { GameDescriptionComponent } from './game-description.component';
import { GameEngine, minimax, printBoard } from './game-engine';
import { GameGuideComponent } from './new-game/game-guide.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgtCanvas,
    GameDialogComponent,
    GameDescriptionComponent,
    RouterOutlet,
    GameGuideComponent
  ],
  template: `
      @if (showInstructions()) {
        <game-dialog (close)="showInstructions.set(false)">
          <game-description/>
        </game-dialog>
      }

      <div class="top-bar">
        <div class="title">Quarto</div>
        <button [style.margin-top.px]="15"
                (click)="showInstructions.set(true)">How to play
        </button>
      </div>

      <div class="main-content">
        <ngt-canvas #canvas
                    [sceneGraph]="sceneGraph"
                    [camera]="{position: [8,-6,6], fov: 90}"/>

        <div class="guide-panel">
          <new-game/>
        </div>
      </div>
    `,
  styles: [`
               :host {
                 display: block;
                 width: 100%;
                 height: 100%;
               }
             `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  protected sceneGraph = Board;
  protected showInstructions = signal(false);

  #game = inject(GameEngine);

  constructor() {
    this.#game.move({ row: 0, col: 0, piece: 2 });
    this.#game.move({ row: 0, col: 1, piece: 14 });
    this.#game.move({ row: 0, col: 2, piece: 3 });
    this.#game.move({ row: 0, col: 3, piece: 4 });
    this.#game.move({ row: 1, col: 1, piece: 6 });
    this.#game.move({ row: 1, col: 0, piece: 1 });
    this.#game.move({ row: 1, col: 3, piece: 5 });
    this.#game.move({ row: 2, col: 1, piece: 7 });
    this.#game.move({ row: 2, col: 2, piece: 13 });
    this.#game.move({ row: 2, col: 3, piece: 9 });
    this.#game.move({ row: 3, col: 0, piece: 12 });
    this.#game.move({ row: 3, col: 1, piece: 0 });
    this.#game.move({ row: 3, col: 2, piece: 10 });
    //this.#game.move({ row: 3, col: 3, piece: 15 });

    //console.log('winner', gameWinner(this.#game.board));
    //console.log('draw', gameDraw(this.#game.board));
    //console.log('eval', evaluateBoard(this.#game.board));
    printBoard(this.#game.board);

    /*
            printBoard([
                { row: 0, col: 0, coords: [57, 0, -57], piece: 15 },
                { row: 0, col: 1, coords: [57, 0, -19], piece: 0 },
                { row: 0, col: 2, coords: [57, 0, 19], piece: 0 },
                { row: 0, col: 3, coords: [57, 0, 57], piece: 15 },
                { row: 1, col: 0, coords: [19, 0, -57], piece: 0 },
                { row: 1, col: 1, coords: [19, 0, -19], piece: 15 },
                { row: 1, col: 2, coords: [19, 0, 19], piece: 0 },
                { row: 1, col: 3, coords: [19, 0, 57], piece: 15 },
                { row: 2, col: 0, coords: [-19, 0, -57], piece: 15 },
                { row: 2, col: 1, coords: [-19, 0, -19], piece: 15 },
                { row: 2, col: 2, coords: [-19, 0, 19], piece: 0 },
                { row: 2, col: 3, coords: [-19, 0, 57], piece: 0 },
                { row: 3, col: 0, coords: [-57, 0, -57], piece: 0 },
                { row: 3, col: 1, coords: [-57, 0, -19], piece: 15 },
                { row: 3, col: 2, coords: [-57, 0, 19], piece: 15 },
                { row: 3, col: 3, coords: [-57, 0, 57], piece: EMPTY },
            ]);

            console.log('Winner', gameWinner([
                { row: 0, col: 0, coords: [57, 0, -57], piece: 0 },
                { row: 0, col: 1, coords: [57, 0, -19], piece: 1 },
                { row: 0, col: 2, coords: [57, 0, 19], piece: 2 },
                { row: 0, col: 3, coords: [57, 0, 57], piece: 4 },
                { row: 1, col: 0, coords: [19, 0, -57], piece: 5 },
                { row: 1, col: 1, coords: [19, 0, -19], piece: 6 },
                { row: 1, col: 2, coords: [19, 0, 19], piece: 7 },
                { row: 1, col: 3, coords: [19, 0, 57], piece: 8 },
                { row: 2, col: 0, coords: [-19, 0, -57], piece: 9 },
                { row: 2, col: 1, coords: [-19, 0, -19], piece: 10 },
                { row: 2, col: 2, coords: [-19, 0, 19], piece: 11 },
                { row: 2, col: 3, coords: [-19, 0, 57], piece: 12 },
                { row: 3, col: 0, coords: [-57, 0, -57], piece: 13 },
                { row: 3, col: 1, coords: [-57, 0, -19], piece: 14 },
                { row: 3, col: 2, coords: [-57, 0, 19], piece: 15 },
                { row: 3, col: 3, coords: [-57, 0, 57], piece: EMPTY },
            ]));
            console.log('Can win', canWin([
                { row: 0, col: 0, coords: [57, 0, -57], piece: 0 },
                { row: 0, col: 1, coords: [57, 0, -19], piece: 1 },
                { row: 0, col: 2, coords: [57, 0, 19], piece: 2 },
                { row: 0, col: 3, coords: [57, 0, 57], piece: 4 },
                { row: 1, col: 0, coords: [19, 0, -57], piece: 5 },
                { row: 1, col: 1, coords: [19, 0, -19], piece: 6 },
                { row: 1, col: 2, coords: [19, 0, 19], piece: 7 },
                { row: 1, col: 3, coords: [19, 0, 57], piece: 8 },
                { row: 2, col: 0, coords: [-19, 0, -57], piece: 9 },
                { row: 2, col: 1, coords: [-19, 0, -19], piece: 10 },
                { row: 2, col: 2, coords: [-19, 0, 19], piece: 11 },
                { row: 2, col: 3, coords: [-19, 0, 57], piece: 12 },
                { row: 3, col: 0, coords: [-57, 0, -57], piece: 13 },
                { row: 3, col: 1, coords: [-57, 0, -19], piece: 14 },
                { row: 3, col: 2, coords: [-57, 0, 19], piece: 15 },
                { row: 3, col: 3, coords: [-57, 0, 57], piece: EMPTY },
            ], 3));

     */

    console.log('Minimax', minimax(this.#game, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, DEPTH, 8));

    //  console.log('counter', COUNTER);
  }
}
