import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Board } from './board.component';
import { GameDialogComponent } from './dialog.component';
import { GameDescriptionComponent } from './game-description.component';
import { NewGameComponent } from './new-game/new-game.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        NgtCanvas,
        GameDialogComponent,
        GameDescriptionComponent,
        RouterOutlet,
        NewGameComponent
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
                    [camera]="{position: [8,0,0], fov: 80}"
                    [shadows]="true"/>

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
}
