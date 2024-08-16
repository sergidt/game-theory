import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Board } from './board.component';
import { Turn } from './definitions';
import { Game } from './game-engine';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NgtCanvas],
    template: `
      <ngt-canvas [sceneGraph]="sceneGraph">
       <!--ngt-point-light [position]="[1,1,0]" [intensity]="0.5"/>
       <ngt-point-light [position]="[-1,1,0]" [intensity]="0.5"/-->
      </ngt-canvas>
    `,
    styles: [`
               :host {
                 display: flex;
                 flex-direction: column;
                 align-items: flex-end;
                 width: 100%;
                 height: 80vh;
               }
             `],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
    protected sceneGraph = Board;

    ngOnInit(): void {

        new Game(Turn.User);

    }
}
