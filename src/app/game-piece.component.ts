import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, Signal } from '@angular/core';
import { createAttachFunction, extend, injectLoader, NgtArgs } from 'angular-three';
import { BufferGeometry, Color, Mesh, MeshStandardMaterial } from 'three';
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

extend({ Mesh, Color });

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
                    [material]="gltf.materials.mat0">
            <ngt-color *args="[]"
                       [attach]="attachColor"/>
          </ngt-mesh>
        </ngt-group>
      }
    `,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [NgtArgs],
})
export class GamePieceComponent {
    piece = input.required<Piece>();

    position = computed(() => ({ position: this.piece().position }));
    gltf = injectLoader(() => GLTFLoader, () => this.piece().path) as Signal<GLTFResult>;

    attachColor = createAttachFunction<Color, Mesh>(({ parent, child }) => {
        const mesh = parent as Mesh<BufferGeometry, MeshStandardMaterial>;
        const oldColor = mesh.material['color'];
        const color = getSingleCharacteristic(this.piece(), 'Colour');
        console.log('piece', this.piece(), 'color', color, [LightColor, DarkColor][color]);
        mesh.material.color.set([LightColor, DarkColor][color]);
        return () => mesh.material.color.set(oldColor);
    });
}
