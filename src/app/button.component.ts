import { Component, input } from '@angular/core';

@Component({
    selector: 'app-button',
    standalone: true,
    template: `
      <button class="custom-button"
              [class.selected]="selected()">{{ text() }}
      </button>
    `,
    styles: `
      button {
        position: relative;
        display: inline-block;
        cursor: pointer;
        outline: none;
        border: 0;
        vertical-align: middle;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;

        &.custom-button {
          font-weight: 600;
          color: #382b22;
          padding: 0 1.5em;
          background: #fff0f0;
          border: 2px solid #b18597;
          border-radius: 0.75em;
          transform-style: preserve-3d;
          transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), background 150ms cubic-bezier(0, 0, 0.58, 1);

          &::before {
            position: absolute;
            content: '';
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #f9c4d2;
            border-radius: inherit;
            box-shadow: 0 0 0 2px #b18597, 0 0.625em 0 0 #ffe3e2;
            transform: translate3d(0, 0.75em, -1em);
            transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
          }

          &:hover:not(.selected) {
            background: #ffe9e9;
            transform: translate(0, 0.25em);

            &::before {
              box-shadow: 0 0 0 2px #b18597, 0 0.5em 0 0 #ffe3e2;
              transform: translate3d(0, 0.5em, -1em);
            }
          }

          &:active, &.selected {
            background: #ffe9e9;
            transform: translate(0em, 0.75em);

            &::before {
              box-shadow: 0 0 0 2px #b18597, 0 0 #ffe3e2;
              transform: translate3d(0, 0, -1em);
            }
          }
        }
      }
    `
})
export class AppButtonComponent {
    text = input.required<string>();

    selected = input(false);
}
