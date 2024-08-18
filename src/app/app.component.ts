import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, signal, OnInit, Signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Board } from './board.component';
import { PIECES, Turn } from './definitions';
import { Game } from './game-engine';
import { GameDescriptionComponent } from "./game-description.component";
import { AppButtonComponent} from "./button.component";

export enum GameOptions {
  HowToPlay = 'How to play',
  Game =  'Game'
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgtCanvas, GameDescriptionComponent, AppButtonComponent],
  template: `
  <div class="title">
<h1>Quarto</h1>
<app-button [text]="GameOptions.HowToPlay"
[viewState]="viewState()"
(click)="viewState.set(GameOptions.HowToPlay)"/>
<app-button [text]="GameOptions.Game"
[viewState]="viewState()"
(click)="viewState.set(GameOptions.Game)"/>
  </div>
<div class="main-content">
  <ngt-canvas #canvas [sceneGraph]="sceneGraph"
    [camera]="{position: [8,0,0], fov: 80}"
    [shadows]="true"/>


  <div class="guide-panel">
<game-description/>
  </div>
</div>
       `,
  styles: [`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

    .title {
    position: absolute;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 1000;
    width: calc(100% - 600px);
    }

    .main-content {
    display: flex;
    height: 100%;
    align-items: center;
    }

    .guide-panel {
    display: block;
    width: 600px;
    max-width: 600px;
    height: 98%;
    padding: 0 20px;
    border-radius: 8px 0 0 8px;
    box-shadow: 2px 2px 10px 1px rgba(145,145,145,0.4);
    border: solid 1px #DDDDDD;
    box-sizing: border-box;
    overflow-y: auto;
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  protected sceneGraph = Board;

  Math = Math;
  PIECES = PIECES;

  GameOptions = GameOptions;

  viewState = signal<GameOptions>(GameOptions.HowToPlay);
}
