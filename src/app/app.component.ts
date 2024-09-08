import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { AboutComponent } from "./about.component";
import { Board } from './board.component';
import { DEPTH } from './definitions';
import { GameDialogComponent } from './dialog.component';
import { GameDescriptionComponent } from './game-description.component';
import { GameEngine } from './game-engine';
import { minimaxPromisified } from './minimax';
import { GameGuideComponent } from './new-game/game-guide.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgtCanvas,
    GameDialogComponent,
    GameDescriptionComponent,
    RouterOutlet,
    GameGuideComponent,
    AboutComponent
  ],
  template: `
  @let show = showDialog();

      @if (show !== 'None') {
        <game-dialog (close)="showDialog.set('None')">
        @if(show === 'Instructions') {
        <game-description/>
        } @else {
          <about/>
        }
        </game-dialog>
      }

      <div class="top-bar">
        <div class="title">Quarto</div>
        <button [style.margin-top.px]="15"
                (click)="showDialog.set('Instructions')">How to play
        </button>
        <button [style.margin-top.px]="15"
                (click)="showDialog.set('About')">About
        </button>
      </div>

      <div class="main-content">
        <ngt-canvas #canvas
                    [sceneGraph]="sceneGraph"
                    [camera]="{position: [8,-6,6], fov: 40}"/>

        <div class="guide-panel">
          <game-guide/>
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
  protected showDialog: WritableSignal<'None' | 'Instructions' | 'About'> = signal('None');

  #game = inject(GameEngine);

  constructor() {
    this.init();
  }

  async init() {
    console.time('minimax');
    const value = await minimaxPromisified(this.#game, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, DEPTH, 8);
    console.timeEnd('minimax');
    console.log('Minimax', value);
  }
}
