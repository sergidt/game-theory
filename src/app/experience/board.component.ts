import { CUSTOM_ELEMENTS_SCHEMA, Component, viewChild, ElementRef, ChangeDetectionStrategy, AfterViewInit, AfterContentInit } from '@angular/core';
import { extend, injectBeforeRender, injectLoader, NgtArgs } from 'angular-three';
import { Mesh, BoxGeometry, MeshBasicMaterial, ShapeGeometry, BufferGeometry } from 'three';
import {GLTFLoader, STLLoader} from 'three-stdlib';

extend({ Mesh, ShapeGeometry, MeshBasicMaterial });

@Component({
  selector: 'board',
  standalone: true,
  template: `
      <ngt-primitive *args="[gltfResult()?.scene]">
</ngt-primitive>
  `,
  imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  gltfResult = injectLoader(
    () => GLTFLoader, () => '/assets/board.glb',
  {
    onLoad: (geometry) => console.log('Model loaded!', geometry)
  });
}

