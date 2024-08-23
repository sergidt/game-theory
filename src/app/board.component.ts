import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { extend, injectLoader, NgtArgs, NgtGroup, NgtSelection, NgtVector3 } from 'angular-three';
import { NgtsCameraControls, NgtsOrbitControls } from 'angular-three-soba/controls';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import * as THREE from 'three';
import { Mesh, MeshStandardMaterial, ShapeGeometry, TorusGeometry } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { PIECES } from './definitions';
import { GamePieceComponent } from './game-piece.component';

extend({ Mesh, ShapeGeometry, MeshStandardMaterial, TorusGeometry });

@Component({
    selector: 'board',
    standalone: true,
    template: `
      <ngt-group #group
                 [parameters]="{scale: 0.020, rotation: [Math.PI / 4, Math.PI  , Math.PI / 6]}">
        <ngt-primitive #board
                       *args="[board()?.scene]"/>

        <ngt-group>
          @for (piece of pieces; track $index) {
            <game-piece [piece]="piece"/>
          }
        </ngt-group>

        <ngt-group>
          @for (position of torusPositions; track $index; let i = $index) {
            <ngt-mesh [parameters]="{rotation: [Math.PI / 2, 0, 0], position}"
                      (pointerover)="torusIndexHovered.set(i)"
                      (pointerout)="torusIndexHovered.set(-1)">
              <ngt-mesh-standard-material [color]="torusIndexHovered() === i ? 'indianred': 'white'"/>
              <ngt-torus-geometry *args="torusGeometryArgs"/>
            </ngt-mesh>
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
    Math = Math;

    torusPositions: Array<NgtVector3> = [];

    torusIndexHovered = signal(-1);

    torusGeometryArgs = [17, 1.8, 100, 100];

    board = injectLoader(
        () => GLTFLoader, () => '/assets/board.glb',
        {
            onLoad: ({ scene }: { scene: NgtGroup }) => {
                if (scene['add'] !== undefined) {
                    scene.add(new THREE.AxesHelper(200));
                }
            }
        }
    );
}

