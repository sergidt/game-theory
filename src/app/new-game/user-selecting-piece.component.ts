import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'user-selecting-piece',
    standalone: true,
    template: `
      <h4>Choosing next opponent's piece</h4><p>
        Select the next piece for the opponent,
        clicking over one of the available pieces </p>

      <img ngSrc="assets/waiting.png"
           width="150"
           height="150"/>
    `,
    imports: [
        NgOptimizedImage
    ]
})
export class UserSelectingPieceComponent {

}
