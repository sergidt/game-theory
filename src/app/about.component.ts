import { Component } from '@angular/core';

@Component({
  selector: 'about',
  standalone: true,
  template: `
      <h2>Angular Three</h2>
      <p>
      To render all the 3d elements, I used the angular Three library.</p>
      <p>Angular Three allows the users to declaratively build a scene graph using the familiar Angular template syntax. This approach enables Angular developers to leverage familiar skills and tools of Angular template to build 3D scenes, with an impressive performance.</p>
<p>
I greatly appreciate the help received from <a href="https://github.com/nartc">Chau Tran (nartc)</a>, creator of this library, and the patience he has had during the development of this project. </p>

      <h2>Game engine and IA</h2>
      <p>The game is controlled by the implementation of a <span class="hightlight">state machine</span>.</p>
      <p>A state machine is used to manage the behavior of the game through a set of defined states, transitions between those states, and actions triggered by specific inputs. It helps organize complex behaviors in a structured way.</p>

      <p>For the artificial intelligence part, a traditional algorithm has been implemented, called <span class="hightlight">minimax with alpha beta pruning</span>.</p>
      <p>Minimax is a kind of backtracking algorithm that is used in decision making and game theory to find the optimal move for a player, assuming that your opponent also plays optimally. It is widely used in board-based games. The alpha beta prunning technique is an optimization to reduce the decision tree.</p>
   `,
  styles: `
      h2 {
        border-bottom: solid 2px;
      }

      a, .hightlight {
      text-decoration: none;
        color:  #23b5f1;
      }
    `
})
export class AboutComponent {

}
