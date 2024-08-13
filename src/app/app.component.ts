import { NgtArgs, NgtCanvas, injectLoader } from 'angular-three';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Board } from './board.component';
import { GLTFLoader } from 'three-stdlib';
import { Game } from './game-engine';
import { Turn } from './definitions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgtCanvas],
  template: `
    <ngt-canvas [sceneGraph]="sceneGraph" >
    <ngt-ambient-light [intensity]="1"/>
    </ngt-canvas>
    `,
  styles: [`
      :host {
               display: block;
               width: 100%;
               height: 800px;
            }
`],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit{
  protected sceneGraph = Board;

  ngOnInit(): void {

    new Game(Turn.User);

  }
}
