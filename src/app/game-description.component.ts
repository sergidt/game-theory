import { Component } from '@angular/core';

@Component({
    selector: 'game-description',
    standalone: true,
    imports: [],
    template: `
      <h2>Description</h2><p>
        This is a game for two players. The board has 16 squares (4x4), and the 16 different pieces that can be constructed combinating the following four characteristics: </p>

      <ul>
        <li>Size (big / small)</li>
        <li>Colour (dark / light)</li>
        <li>Shape (circle / square)</li>
        <li>Hole (piece with or without hole)</li>
      </ul><h2>Objective</h2>
      <p>The aim of the game is to complete a line with four pieces that are similar at least about one of the four described characteristics.</p>
      <p>The line may be vertical, horizontal or diagonal. </p>

      <h2>How the game goes on</h2><p>Players move alternatively, placing one piece on the board; once inserted, pieces cannot be moved.
                                      One of the more special characteristics of this game is that the choice of the piece to be placed on the board is not made by the same player who places it; it is the opponent who, after doing his move, decides which will be the next piece to place.
                                      So, each turn consists of two actions: </p>

      <p>1. Place on the board the piece given by the opponent.</p><p>2. Give to the opponent the piece to be placed in the next move.</p>
      <p>In the first turn of the game, the player who starts has only to choose one piece for the opponent.</p><h2>Winner</h2>
      <p>The winner is the player who places the fourth piece of the line.</p>
      <p>The game finishes in a draw when nobody reaches the objective after placing the 16 pieces.</p>
    `,
    styles: `
      h2 {
        border-bottom: solid 2px;
      }
    `
})
export class GameDescriptionComponent {

}
