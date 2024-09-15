import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { extend, injectLoader, NgtArgs, NgtSelection } from 'angular-three';
import { NgtsCameraControls, NgtsOrbitControls } from 'angular-three-soba/controls';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import { AmbientLight, CylinderGeometry, Mesh, MeshStandardMaterial } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { PIECES } from '../definitions';
import { GameEngine } from '../game-engine';
import { GamePieceComponent } from './game-piece.component';
import { PositionSlotComponent } from './position-slot.component';

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

        @if (showPositionSlots()) {
          <ngt-group>
            @for (position of game.userAvailablePositions(); track $index) {
              <position-slot [position]="position"/>
            }
          </ngt-group>
        }
      </ngt-group>

      <ngts-orbit-controls/>
      <ngts-environment [options]="{preset: 'city'}"/>
    `,
    imports: [NgtArgs, NgtsOrbitControls, NgtsEnvironment, NgtSelection, NgtsCameraControls, GamePieceComponent, PositionSlotComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
    pieces = PIECES;
    game = inject(GameEngine);

    showPositionSlots = computed(() => ['UserPlacingPiece', 'UserWon', 'CPUWon'].includes(this.game.currentState()));

    board = injectLoader(() => GLTFLoader, () => '/assets/board.glb');
}

