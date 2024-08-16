import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, input, Signal, signal } from '@angular/core';
import { createAttachFunction, extend, injectLoader, NgtArgs, NgtGroup, NgtColor, NgtGLTFLike, NgtVector3, NgtEuler } from 'angular-three';
import { BufferGeometry, Color, ColorRepresentation, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, ShapeGeometry } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import * as THREE from 'three';

type GLTFResult = GLTF & {
  nodes: {
    imagetostl_mesh0: Mesh
  }
  materials: {
    mat0: MeshStandardMaterial
  }
}

extend({ Mesh, Color });

@Component({
  selector: 'game-piece',
  standalone: true,
  template: `
@if (gltf(); as gltf) {
  <ngt-group  [dispose]="null" >
      <ngt-mesh
      [parameters]="options()"
        [castShadow]="true"
        [receiveShadow]="true"
        [geometry]="gltf.nodes.imagetostl_mesh0.geometry"
        [material]="gltf.materials.mat0">
      <ngt-color *args="[]" [attach]="attachColor"/>
</ngt-mesh>
    </ngt-group>
    <!--ngt-primitive *args="[ gltf.scene.clone() ]" [parameters]="options()">
      <ngt-color *args="[color()]" [attach]="attachColor"/>
    </!--ngt-primitive-->
  }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtArgs],
})
export class GamePieceComponent {
  url = input.required<string>();
  options = input({} as Partial<NgtGroup>);
  index = input.required<number>();
  gltf = injectLoader(() => GLTFLoader, this.url) as Signal<GLTFResult>;

  attachColor = createAttachFunction<Color, Mesh>(({ parent, child }) => {
    const mesh = parent as Mesh<BufferGeometry, MeshStandardMaterial>;
    const oldColor = mesh.material['color'];
    mesh.material.color.set(['white', 'red'][this.index() % 2]);
    return () => mesh.material.color.set(oldColor);
  });
}
