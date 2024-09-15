import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { BoardComponent } from './3d-components/board.component';
import { AboutComponent } from './dialogs/about.component';
import { GameDialogComponent } from './dialogs/dialog.component';
import { GameDescriptionComponent } from './dialogs/game-description.component';
import { GameGuideComponent } from './game-guide/game-guide.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        NgtCanvas,
        GameDialogComponent,
        GameDescriptionComponent,
        RouterOutlet,
        GameGuideComponent,
        AboutComponent
    ],
    template: `
      @let show = showDialog();

      @if (show !== 'None') {
        <game-dialog (close)="showDialog.set('None')">
          @if (show === 'Instructions') {
            <game-description/>
          } @else {
            <about/>
          }
        </game-dialog>
      }

      <div class="top-bar">
        <div class="title">Quarto</div>
        <div class="buttons">
          <button [style.margin-top.px]="15"
                  (click)="showDialog.set('Instructions')">How to play
          </button>
          <button [style.margin-top.px]="15"
                  (click)="showDialog.set('About')">About
          </button>
        </div>
      </div>

      <div class="main-content">
        <ngt-canvas #canvas
                    [sceneGraph]="sceneGraph"
                    [camera]="{position: [8,-6,6], fov: 40}"/>

        <div class="guide-panel">
          <game-guide/>
        </div>
      </div>
    `,
    styles: [`
               :host {
                 display: block;
                 width: 100%;
                 height: 100%;
               }
             `],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
    protected sceneGraph = BoardComponent;
    protected showDialog: WritableSignal<'None' | 'Instructions' | 'About'> = signal('None');
}
