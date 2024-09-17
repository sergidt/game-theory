import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GameActions } from './definitions';
import { GameEngine } from './game-engine';

@Component({
  selector: 'game-guide',
  standalone: true,
  imports: [
    NgOptimizedImage,
  ],
  template: `
      <h2>Game guide</h2>

      <div class="content">
      @switch (game.currentState()) {
        @case ('NewGame') {
          <h3>Are you ready for a new game?</h3>
          <button (click)="game.nextState(GameActions.Ready)">Ready!</button>
        }
        @case ('UserSelectingPiece') {
          <h3>Please select next opponent's piece</h3><p>
        Select the next piece for the opponent,
        clicking over one of the available pieces </p>

      <img ngSrc="assets/waiting.png"
           width="150"
           height="150"/>
        }
        @case ('CPUSelectingPiece') {
          <h3>
        The opponent is selecting the next piece for you to place</h3>
      <img ngSrc="assets/thinking.png"
           width="150"
           height="150"/>
        }
        @case ('UserPlacingPiece') {
          <h3>AI algorithm chose this piece for you:</h3><p class="piece-description">{{ game.describeSelectedPiece() }}</p><p>
        Place this piece, selecting one available position. Please, click over any pink disk </p>
           }
        @case ('CPUPlacingPiece') {
          <h3>The opponent is thinking about where to place the piece</h3>
      <img ngSrc="assets/thinking.png"
           width="150"
           height="150"/>
        }
        @case ('UserWon') {
          <h3>Congratulations! You win!</h3>
          <img ngSrc="assets/cpu-lost.jpeg"
           width="150"
           height="150"/>
        }
        @case ('CPUWon') {
          <h3>Sorry, You lose!</h3>
          <img ngSrc="assets/cpu-won.jpeg"
           width="150"
           height="150"/>
        }
        @default {
          <h3>It's a draw!</h3>
          <img ngSrc="assets/surprise.png"
           width="150"
           height="150"/>
        }
      }
      </div>
    `,
  styles: `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
      }

      .piece-description {
        font-size: 1.2em;
        color: #23b5f1;
        font-weight: bold;
      }
    `
})
export class GameGuideComponent {
  protected readonly game = inject(GameEngine);
  protected readonly GameActions = GameActions;
}
