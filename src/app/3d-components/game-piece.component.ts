import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input, Signal } from '@angular/core';
import { extend, injectLoader, NgtArgs, NgtThreeEvent } from 'angular-three';
import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { DarkColor, LightColor, Piece, SelectionColor } from '../definitions';
import { GameEngine } from '../game-engine';
import { getSingleCharacteristic } from '../game.utils';

type GLTFResult = GLTF & {
    nodes: {
        imagetostl_mesh0: Mesh
    }
    materials: {
        mat0: MeshStandardMaterial
    }
}

extend({ Mesh, MeshPhysicalMaterial });

@Component({
    selector: 'game-piece',
    standalone: true,
    template: `
      @if (gltf(); as gltf) {
        <ngt-group [dispose]="null">
          <ngt-mesh [parameters]="position()"
                    (attached)="registerMesh($event)"
                    [castShadow]="true"
                    [receiveShadow]="true"
                    [geometry]="gltf.nodes.imagetostl_mesh0.geometry"
                    (click)="clicked($event)"
                    (pointerover)="pointerOver($event)"
                    (pointerout)="pointerOut($event)">
            <ngt-mesh-physical-material [color]="selected() ? 'red' : piecePointed() ? SelectionColor : color()"
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

    SelectionColor = SelectionColor;

    protected piecePointed = computed(() => this.game.pointedPiece() === this.piece().characteristics);
    protected selected = computed(() => this.piece().characteristics === this.game.selectedPiece());
    protected position = computed(() => ({ position: this.piece().position }));
    protected color = computed(() => [LightColor, DarkColor][getSingleCharacteristic(this.piece(), 'Colour')]);

    pointerOver(event: NgtThreeEvent<PointerEvent>) {
        event.stopPropagation();
        this.game.userPointingPiece(this.piece().characteristics);
    }

    pointerOut(event: NgtThreeEvent<PointerEvent>) {
        event.stopPropagation();
        this.game.piecePointedOut();
    }

    clicked(event: NgtThreeEvent<MouseEvent>) {
        event.stopPropagation();
        this.game.pieceSelectedByUser(this.piece().characteristics);
    }

    registerMesh({ node }: { node: Mesh }) {
        this.game.registerMesh(this.piece().characteristics, node);
    }
}
