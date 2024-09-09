import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { extend, injectLoader, NgtArgs, NgtSelection } from 'angular-three';
import { NgtsCameraControls, NgtsOrbitControls } from 'angular-three-soba/controls';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import { AmbientLight, CylinderGeometry, Mesh, MeshStandardMaterial } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { AvailablePositionComponent } from './available-position.component';
import { PIECES, Position } from './definitions';
import { GameEngine } from './game-engine';
import { GamePieceComponent } from './game-piece.component';
import { getEmptyPositions } from './game.utils';

extend({ Mesh, MeshStandardMaterial, CylinderGeometry, AmbientLight });

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

        @if (game.showAvailablePositions()) {
          <ngt-group>
            @for (position of availablePositions; track $index) {
              <available-position [position]="position"/>
            }
          </ngt-group>
        }
      </ngt-group>

      <ngts-orbit-controls/>
      <ngts-environment [options]="{preset: 'city'}"/>
    `,
    imports: [NgtArgs, NgtsOrbitControls, NgtsEnvironment, NgtSelection, NgtsCameraControls, GamePieceComponent, AvailablePositionComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
    pieces = PIECES;
    game = inject(GameEngine);

    availablePositions: Array<Position> = getEmptyPositions(this.game.board);

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

