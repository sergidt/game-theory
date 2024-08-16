import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, viewChild, ElementRef } from '@angular/core';
import { extend, injectLoader, NgtArgs, NgtPrimitive, NgtSelection, NgtVector3 } from 'angular-three';
import { NgtsCameraControls, NgtsOrbitControls } from 'angular-three-soba/controls';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import { Color, Group, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, ShapeGeometry, SRGBColorSpace, TextureLoader } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { Colour, Position } from './definitions';
import * as THREE from 'three';
import { GamePieceComponent } from "./game-piece.component";

export interface PieceDefinition {
  path: string;
  initialPosition: NgtVector3;
}



const PIECES: PieceDefinition[] = [
  { path: '/assets/round-big-hole.glb', initialPosition: [80, -12, -130] },
  { path: '/assets/round-big-no-hole.glb', initialPosition:[50, -12, -130]},
  { path: '/assets/square-big-hole.glb', initialPosition: [20, -12, -130] },
  { path: '/assets/square-big-no-hole.glb', initialPosition:    [-10, -12, -130] },
  { path: '/assets/round-small-hole.glb', initialPosition:   [80, -12, -160]},
  { path: '/assets/round-small-no-hole.glb', initialPosition: [50, -12, -160]},
  { path: '/assets/square-small-hole.glb', initialPosition:   [20, -12, -160]},
  { path: '/assets/square-small-no-hole.glb', initialPosition:  [-10, -12, -160] },
  //
  { path: '/assets/round-big-hole.glb', initialPosition: [-40, -12, -130] },
  { path: '/assets/round-big-no-hole.glb', initialPosition:[-70, -12, -130]},
  { path: '/assets/square-big-hole.glb', initialPosition: [-100, -12, -130] },
  { path: '/assets/square-big-no-hole.glb', initialPosition:    [-130, -12, -130] },
  { path: '/assets/round-small-hole.glb', initialPosition:   [-40, -12, -160]},
  { path: '/assets/round-small-no-hole.glb', initialPosition: [-70, -12, -160]},
  { path: '/assets/square-small-hole.glb', initialPosition:   [-100, -12, -160]},
  { path: '/assets/square-small-no-hole.glb', initialPosition:  [-130, -12, -160] }

];





extend({ Mesh, ShapeGeometry, MeshBasicMaterial });

@Component({
  selector: 'board',
  standalone: true,
  template: `
      <ngt-group [parameters]="{scale: 0.020, rotation: [-100, MATH.PI / 1.2, 0]}">
        <ngt-primitive #board *args="[board()?.scene]"/>

        <ngt-group >
        @for (piece of pieces; track $index; let i = $index) {
                  <game-piece [url]="piece.path"
                  [index]="i"
                  [color]="i < 8 ? 'red' : 'white'"
                  [options]="{position: piece.initialPosition}"
                  />

        }
          </ngt-group>
      </ngt-group>

      <ngts-orbit-controls/>
      <ngts-environment [options]="{preset: 'city'}"/>
    `,
  imports: [NgtArgs, NgtsOrbitControls, NgtsEnvironment, NgtSelection, NgtsCameraControls, GamePieceComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  pieces = PIECES;
  MATH = Math;

  texture = injectLoader(() => TextureLoader, () => '/assets/wood.jpg');

  meshRef = viewChild.required<ElementRef<Mesh>>('mesh');

  board = injectLoader(() => GLTFLoader, () => '/assets/board.glb');
}


