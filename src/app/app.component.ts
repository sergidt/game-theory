import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Board } from './board.component';
import { AppButtonComponent } from './button.component';
import { GameDialogComponent } from './dialog.component';
import { GameDescriptionComponent } from './game-description.component';
import { GameEngine } from './game-engine';
import { NewGameComponent } from './new-game/new-game.component';

export enum GameOptions {
    HowToPlay = 'How to play',
    NewGame = 'New game'
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NgtCanvas, AppButtonComponent, GameDialogComponent, GameDescriptionComponent, RouterOutlet, NewGameComponent],
    template: `
      @if (showInstructions()) {
        <game-dialog (close)="showInstructions.set(false)">
          <game-description/>
        </game-dialog>
      }
      <div class="top-bar">
        <div class="title">Quarto</div>
        <app-button [text]="GameOptions.HowToPlay"
                    [style.margin-top.px]="15"
                    (click)="showInstructions.set(true)"/>
      </div>

      <div class="main-content">
        <ngt-canvas #canvas
                    [sceneGraph]="sceneGraph"
                    [camera]="{position: [8,0,0], fov: 80}"
                    [shadows]="true"/>

        <div class="guide-panel">
          <h2>Quarto game</h2>

          <div class="content">
            <new-game [gameState]="game.currentState()"/>
          </div>
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
    protected viewState = signal<GameOptions>(GameOptions.NewGame);
    protected game = inject(GameEngine);

    GameOptions = GameOptions;

    showInstructions = signal(false);
}
