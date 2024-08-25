import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input, signal, Signal } from '@angular/core';
import { extend, injectLoader, NgtArgs, NgtThreeEvent } from 'angular-three';
import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { getSingleCharacteristic, Piece } from './definitions';
import { GameActions, GameStateMachine, GameStates } from './game-state-machine';

type GLTFResult = GLTF & {
    nodes: {
        imagetostl_mesh0: Mesh
    }
    materials: {
        mat0: MeshStandardMaterial
    }
}

const DarkColor = '#1d3557';
const LightColor = '#eacdc2';

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

    protected gameStateMachine = inject(GameStateMachine);

    protected gltf = injectLoader(() => GLTFLoader, () => this.piece().path) as Signal<GLTFResult>;

    protected highlighted = signal(false);

    protected selected = computed(() => this.piece().characteristics === this.gameStateMachine.selectedPiece());
    protected position = computed(() => ({ position: this.piece().position }));
    protected color = computed(() => [LightColor, DarkColor][getSingleCharacteristic(this.piece(), 'Colour')]);
    protected readonly console = console;

    pointerOver(event: NgtThreeEvent<PointerEvent>) {
        if (this.gameStateMachine.currentState() === GameStates.UserSelectsPiece) {
            event.stopPropagation();
            this.highlighted.set(true);
        }
    }

    pointerOut(event: NgtThreeEvent<PointerEvent>) {
        if (this.gameStateMachine.currentState() === GameStates.UserSelectsPiece) {
            event.stopPropagation();
            this.highlighted.set(false);
        }
    }

    clicked(event: NgtThreeEvent<MouseEvent>) {
        if (this.gameStateMachine.currentState() === GameStates.UserSelectsPiece) {
            event.stopPropagation();
            this.gameStateMachine.toggleSelection(this.piece().characteristics);
            this.gameStateMachine.nextState(GameActions.PieceSelected);
        }
    }
}
