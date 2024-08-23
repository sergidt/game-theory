import { Component, output } from '@angular/core';

@Component({
    selector: 'game-dialog',
    standalone: true,
    template: `
      <div class="dialog">
        <ng-content/>
        <button (click)="close.emit()">
          Close
        </button>
      </div>
    `,
    styles: `
      :host {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 1000;
      }

      .dialog {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-weight: 600;
        color: #382b22;
        padding: 0 1em 2em 1em;
        background: #ffffff;
        border: 2px solid #b18597;
        border-radius: 0.75em;
        max-width: 800px;

        h2 {
          margin-block-start: 4px;
        }
      }
    `
})
export class GameDialogComponent {
    close = output();
}
