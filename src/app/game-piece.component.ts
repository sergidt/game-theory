import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input, signal, Signal } from '@angular/core';
import { extend, injectLoader, NgtArgs, NgtThreeEvent } from 'angular-three';
import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { GameActions, GameStates, Piece, } from './definitions';
import { GameEngine } from './game-engine';
import { getSingleCharacteristic } from './game.utils';

type GLTFResult = GLTF & {
  nodes: {
    imagetostl_mesh0: Mesh
  }
  materials: {
    mat0: MeshStandardMaterial
  }
}

const DarkColor = '#2F5CBB';
const LightColor = '#ffe7e2';

extend({ Mesh, MeshPhysicalMaterial });

@Component({
  selector: 'game-piece',
  standalone: true,
  template: `
      @if (gltf(); as gltf) {
        <ngt-group [dispose]="null">
          <ngt-mesh [parameters]="position()"
                    [castShadow]="true"
                    [receiveShadow]="true"
                    [geometry]="gltf.nodes.imagetostl_mesh0.geometry"
                    (click)="clicked($event)"
                    (pointerover)="pointerOver($event)"
                    (pointerout)="pointerOut($event)">
            <ngt-mesh-physical-material [color]="selected() ? 'red' : highlighted() ? '#ff9e42' : color()"
                                        [metalness]="0.8"
                                        [roughness]="0.8"
                                        [clearcoat]="0.67"
                                        [clearcoatRoughness]="0.16"/>
          </ngt-mesh>
        </ngt-group>
      }
    `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtArgs],
})
export class GamePieceComponent {
  piece = input.required<Piece>();

  protected game = inject(GameEngine);

  protected gltf = injectLoader(() => GLTFLoader, () => this.piece().path) as Signal<GLTFResult>;

  protected highlighted = signal(false);

  protected selected = computed(() => this.piece().characteristics === this.game.selectedPiece()?.characteristics);
  protected position = computed(() => ({ position: this.piece().position }));
  protected color = computed(() => [LightColor, DarkColor][getSingleCharacteristic(this.piece(), 'Colour')]);
  protected readonly console = console;

  pointerOver(event: NgtThreeEvent<PointerEvent>) {
    if (this.game.currentState() === GameStates.UserSelectingPiece) {
      event.stopPropagation();
      this.highlighted.set(true);
    }
  }

  pointerOut(event: NgtThreeEvent<PointerEvent>) {
    if (this.game.currentState() === GameStates.UserSelectingPiece) {
      event.stopPropagation();
      this.highlighted.set(false);
    }
  }

  clicked(event: NgtThreeEvent<MouseEvent>) {
    if (this.game.currentState() === GameStates.UserSelectingPiece) {
      event.stopPropagation();
      this.game.toggleSelection(this.piece());
      this.game.nextState(GameActions.PieceSelected);
    }
  }
}


/*
    anime({
        targets: [event.object.position],
        z: 57,
        y: 0,
        easing: "easeInQuad",
        duration: 1000,
        direction: "normal",
      });
*/


