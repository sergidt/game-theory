import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core';
import { extend, NgtArgs, NgtSelection, NgtThreeEvent } from 'angular-three';
import { AmbientLight, CylinderGeometry, Mesh, MeshStandardMaterial } from 'three';
import { Position } from './definitions';
import { GameEngine } from './game-engine';

export const DiscArgs = [17, 17, 10, 100];

extend({ Mesh, MeshStandardMaterial, CylinderGeometry, AmbientLight });

@Component({
  selector: 'position-slot',
  standalone: true,
  template: `
      <ngt-mesh [parameters]="{rotation: [0, 0, 0], position: position().coords}"
                (pointerover)="slotPointerOver($event)"
                (pointerout)="slotPointerOut($event)"
                (click)="slotClicked($event)">
        <ngt-mesh-standard-material [color]="this.game.availablePositionHovered() === position() ? 'indianred': 'pink'"/>
        <ngt-cylinder-geometry *args="discArgs"/>
      </ngt-mesh>
    `,
  imports: [NgtArgs, NgtSelection],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionSlotComponent {
  game = inject(GameEngine);

  position = input.required<Position>();
  discArgs = DiscArgs;

  slotPointerOver(event: NgtThreeEvent<MouseEvent>) {
    event.stopPropagation();
    this.game.hoverAvailablePosition(this.position());
  }

  slotPointerOut(event: NgtThreeEvent<MouseEvent>) {
    event.stopPropagation();
    this.game.hoverAvailablePosition(null);
  }

  slotClicked(event: NgtThreeEvent<MouseEvent>) {
    event.stopPropagation();
    this.game.userMove(this.position())
  }
}

