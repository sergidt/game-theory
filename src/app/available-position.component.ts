import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core';
import { extend, NgtArgs, NgtSelection } from 'angular-three';
import { AmbientLight, CylinderGeometry, Mesh, MeshStandardMaterial } from 'three';
import { Position } from './definitions';
import { GameEngine } from './game-engine';

export const DiscArgs = [17, 17, 10, 100];

extend({ Mesh, MeshStandardMaterial, CylinderGeometry, AmbientLight });

@Component({
    selector: 'available-position',
    standalone: true,
    template: `
      <ngt-mesh [parameters]="{rotation: [0, 0, 0], position: position().coords}"
                (pointerover)="game.hoverAvailablePosition(position())"
                (pointerout)="game.hoverAvailablePosition(null)">
        <ngt-mesh-standard-material [color]="this.game.availablePositionHovered() === position() ? 'indianred': 'pink'"/>
        <ngt-cylinder-geometry *args="discArgs"/>
      </ngt-mesh>
    `,
    imports: [NgtArgs, NgtSelection],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailablePositionComponent {

    position = input.required<Position>();

    game = inject(GameEngine);

    discArgs = DiscArgs;
}

