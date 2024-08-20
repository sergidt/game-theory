import { Component, input } from '@angular/core';
import { AppButtonComponent } from './button.component';

@Component({
    selector: 'game-dialog',
    standalone: true,
    imports: [
        AppButtonComponent
    ],
    template: `
      <div class="dialog">
        <h2>{{ title() }}</h2>
        <p>lasdhfkladsfh</p>
        <app-button text=" ahldhf "/>
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
        font-weight: 600;
        color: #382b22;
        padding: 0 1em;
        background: #fff0f0;
        border: 2px solid #b18597;
        border-radius: 0.75em;

        h2 {
          margin-block-start: 4px;
        }
      }
    `
})
export class GameDialogComponent {
    title = input('Dialog title');
}
