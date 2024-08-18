import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, effect, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Board } from './board.component';
import { PIECES, Turn } from './definitions';
import { Game } from './game-engine';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgtCanvas],
  template: `
  <div class="title">
<h1>Quarto</h1>
  </div>
<div class="main-content">
      <ngt-canvas #canvas [sceneGraph]="sceneGraph"
      [camera]="{position: [8,0,0], fov: 80}"
      [shadows]="true"/>


      <div class="guide-panel">

      <h3>Description</h3>
      <p>
This is a game for two players. The board has 16 squares (4x4), and the 16 different pieces that can be constructed combinating the following four characteristics:
      </p>

      <ul>
<li>Size (big/small)</li>
<li>Colour (Dark/Light)</li>
<li>Shape (circle/ square)</li>
<li>Hole (piece with or without hole)</li>
</ul>
<h3>Objective</h3>
<p>
The aim of the game is to complete a line with four pieces that are similar at least about one of the four described characteristics.</p>
<p>The line may be vertical, horizontal or diagonal.
</p>

      <h3>How the game goes on</h3>
<p>
Players move alternatively, placing one piece on the board; once inserted, pieces cannot be moved.

One of the more special characteristics of this game is that the choice of the piece to be placed on the board is not made by the same player who places it; it is the opponent who, after doing his move, decides which will be the next piece to place.

So, each turn consists of two actions:
</p>
<p>1. Place on the board the piece given by the opponent.</p>
  <p>2. Give to the opponent the piece to be placed in the next move.</p>

<p>In the first turn of the game, the player who starts has only to choose one piece for the opponent.</p>

<h3>Winner</h3>
<p>The winner is the player who places the fourth piece of the line.</p>

<p>The game finishes in a draw when nobody reaches the objective after placing the 16 pieces.</p>

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

               p {
                text-align: justify;
               }
             `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  protected sceneGraph = Board;

  Math = Math;
  PIECES = PIECES;
  constructor() {
    console.log(
      Object.keys(PIECES).sort((a, b) => 0.5 - Math.random())
    );
  }
}
