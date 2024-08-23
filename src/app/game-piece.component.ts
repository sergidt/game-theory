import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, signal, Signal } from '@angular/core';
import { extend, injectLoader, NgtArgs } from 'angular-three';
import { Mesh, MeshStandardMaterial } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { getSingleCharacteristic, Piece } from './definitions';

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

extend({ Mesh, MeshStandardMaterial });

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
                    (pointerover)="highlighted.set(true)"
                    (pointerout)="highlighted.set(false)">
            <ngt-mesh-standard-material [color]="highlighted() ? '#ff9e42' : color()"/>
          </ngt-mesh>
        </ngt-group>
      }
    `,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [NgtArgs],
})
export class GamePieceComponent {
    gltf = injectLoader(() => GLTFLoader, () => this.piece().path) as Signal<GLTFResult>;

    piece = input.required<Piece>();

    protected highlighted = signal(false);
    protected position = computed(() => ({ position: this.piece().position }));
    protected color = computed(() => [LightColor, DarkColor][getSingleCharacteristic(this.piece(), 'Colour')]);
}
