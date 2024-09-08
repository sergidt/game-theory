import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { extend, injectLoader, NgtArgs, NgtSelection, NgtVector3 } from 'angular-three';
import { NgtsCameraControls, NgtsOrbitControls } from 'angular-three-soba/controls';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import { AmbientLight, CylinderGeometry, Mesh, MeshStandardMaterial, ShapeGeometry } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { PIECES } from './definitions';
import { GameEngine } from './game-engine';
import { GamePieceComponent } from './game-piece.component';
import { getEmptyPositions } from './game.utils';

extend({ Mesh, ShapeGeometry, MeshStandardMaterial, CylinderGeometry, AmbientLight });

@Component({
  selector: 'board',
  standalone: true,
  template: `
      <ngt-ambient-light [intensity]="1"/>
      <ngt-group #group
                 [parameters]="{scale: 0.020, rotation: [1.57, 3.14, 0.93]}">
        <ngt-primitive #board
                       *args="[board()?.scene]"/>

        <ngt-group>
          @for (piece of pieces; track $index) {
            <game-piece [piece]="piece"/>
          }
        </ngt-group>

        @if (showAvailablePositions()) {
        <ngt-group>
          @for (position of torusPositions; track $index; let i = $index) {
            <ngt-mesh [parameters]="{rotation: [0, 0, 0], position}"
                      (pointerover)="torusIndexHovered.set(i)"
                      (pointerout)="torusIndexHovered.set(-1)">
              <ngt-mesh-standard-material [color]="torusIndexHovered() === i ? 'indianred': 'white'"/>
              <ngt-cylinder-geometry *args="torusGeometryArgs"/>
            </ngt-mesh>
          }
        </ngt-group>
        }
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
  Math = Math;

  game = inject(GameEngine);

  showAvailablePositions = signal(true);

  torusPositions: Array<NgtVector3> = getEmptyPositions(this.game.board).map(p => p.coords);

  torusIndexHovered = signal(-1);

  torusGeometryArgs = [17, 17, 10, 100];

  board = injectLoader(
    () => GLTFLoader, () => '/assets/board.glb',
    {
      //  onLoad: ({ scene }: { scene: NgtGroup }) => {
      //    if (scene['add'] !== undefined) {
      //      scene.add(new THREE.AxesHelper(200));
      //    }
      //  }
    }
  );
}

