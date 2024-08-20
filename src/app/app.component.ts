import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Board } from './board.component';
import { AppButtonComponent } from './button.component';
import { GameDialogComponent } from './dialog.component';
import { GameDescriptionComponent } from './game-description.component';
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
      <!--game-dialog/-->

      <div class="title">
        <h1>Quarto</h1>
        <app-button [text]="GameOptions.HowToPlay"
                    [selected]="viewState() === GameOptions.HowToPlay"
                    (click)="viewState.set(GameOptions.HowToPlay)"/>

        <app-button [text]="GameOptions.NewGame"
                    [selected]="viewState() === GameOptions.NewGame"
                    (click)="viewState.set(GameOptions.NewGame)"/>
      </div>

      <div class="main-content">
        <ngt-canvas #canvas
                    [sceneGraph]="sceneGraph"
                    [camera]="{position: [8,0,0], fov: 80}"
                    [shadows]="true"/>

        <div class="guide-panel">
          <h2>Quarto game</h2>

          <div class="content">

            @if (viewState() === GameOptions.HowToPlay) {
              <game-description/>
            } @else {
              <new-game/>
            }

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

    GameOptions = GameOptions;
}
