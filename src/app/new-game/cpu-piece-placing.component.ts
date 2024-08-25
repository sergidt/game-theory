import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'cpu-piece-placing',
    standalone: true,
    imports: [
        NgOptimizedImage
    ],
    template: `
      <h4>The opponent is thinking about where to place the piece</h4>
      <img ngSrc="assets/thinking.png"
           width="120"
           height="120"/>
    `,
    styles: `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
        align-items: center;
        justify-content: center;
      }
    `
})
export class CpuPiecePlacingComponent {

}
