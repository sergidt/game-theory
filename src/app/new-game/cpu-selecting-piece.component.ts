import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'cpu-selecting-piece',
    standalone: true,
    imports: [
        NgOptimizedImage
    ],
    template: `
      <p>
        The opponent selected this piece for you to place</p>
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
export class CpuSelectingPieceComponent {

}
