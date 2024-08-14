import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { extend, injectLoader, NgtArgs, NgtSelection } from 'angular-three';
import { NgtsCameraControls, NgtsOrbitControls } from 'angular-three-soba/controls';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import {  Color, Group, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, ShapeGeometry, SRGBColorSpace, TextureLoader } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { Colour } from './definitions';
import * as THREE from 'three';

extend({ Mesh, ShapeGeometry, MeshBasicMaterial });

@Component({
    selector: 'board',
    standalone: true,
    template: `
      <ngt-group [parameters]="{scale: 0.022, rotation: [-100, -60 , 0]}">
        <ngt-primitive *args="[board()?.scene]"/>


        <!--DARK PIECES -->
        <ngt-primitive *args="[roundBigDark1()?.scene]" [position]="[57,0, 57]"/>
        <ngt-primitive *args="[roundBigDark2()?.scene]" [position]="[57,0, 20]"/>
        <ngt-primitive *args="[roundSmallDark1()?.scene]" [position]="[57,0, -19]"/>
        <ngt-primitive *args="[roundSmallDark2()?.scene]" [position]="[57,0, -57]"/>

        <ngt-primitive *args="[squareBigDark1()?.scene]" [position]="[-57,0, -57]"/>
        <ngt-primitive *args="[squareBigDark2()?.scene]" [position]="[-57,0, -20]"/>
        <ngt-primitive *args="[squareSmallDark1()?.scene]" [position]="[-57,0, 19]"/>
        <ngt-primitive *args="[squareSmallDark2()?.scene]" [position]="[-57,0, 57]"/>

                       <!-- LIGHT PIECES -->

        <!--ngt-primitive *args="[roundBigLight1()?.scene]" [position]="[20,0, 57]"/>
        <ngt-primitive *args="[roundBigLight2()?.scene]" [position]="[20,0, 20]"/>
        <ngt-primitive *args="[roundSmallLight1()?.scene]" [position]="[20,0, -19]"/>
        <ngt-primitive *args="[roundSmallLight2()?.scene]" [position]="[20,0, -57]"/>

        <ngt-primitive *args="[squareBigLight1()?.scene]" [position]="[-18,0, -57]"/>
        <ngt-primitive *args="[squareBigLight2()?.scene]" [position]="[-18,0, -20]"/>
        <ngt-primitive *args="[squareSmallLight1()?.scene]" [position]="[-18,0, 19]"/>
        <ngt-primitive *args="[squareSmallLight2()?.scene]" [position]="[-18,0, 57]"/-->
      </ngt-group>

      <ngts-orbit-controls/>
      <ngts-environment [options]="{preset: 'city'}"/>
    `,
    imports: [NgtArgs, NgtsOrbitControls, NgtsEnvironment, NgtSelection, NgtsCameraControls],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
texture = injectLoader(() => TextureLoader, () => '/assets/wood.jpg',
{
  onLoad: console.log
});

    board = injectLoader(() => GLTFLoader, () => '/assets/board.glb');


    roundBigDark1 = injectLoader(() => GLTFLoader, () => '/assets/round-big-1.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene, '42407D')
    });

    roundBigDark2 = injectLoader(() => GLTFLoader, () => '/assets/round-big-2.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene, '42407D')
    });

    roundSmallDark1 = injectLoader(() => GLTFLoader, () => '/assets/round-small-1.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene, '42407D')
    });

    roundSmallDark2 = injectLoader(() => GLTFLoader, () => '/assets/round-small-2.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene, '42407D')
    });

    squareBigDark1 = injectLoader(() => GLTFLoader, () => '/assets/square-big-1.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene, '42407D')
    });

    squareBigDark2 = injectLoader(() => GLTFLoader, () => '/assets/square-big-2.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene, '42407D')
    });

    squareSmallDark1 = injectLoader(() => GLTFLoader, () => '/assets/square-small-1.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene, '42407D')
    });

    squareSmallDark2 = injectLoader(() => GLTFLoader, () => '/assets/square-small-2.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene, '42407D')
    });

    // Light

    roundBigLight1 = injectLoader(() => GLTFLoader, () => '/assets/round-big-1.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene)
    });

    roundBigLight2 = injectLoader(() => GLTFLoader, () => '/assets/round-big-2.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene)
    });

    roundSmallLight1 = injectLoader(() => GLTFLoader, () => '/assets/round-small-1.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene)
    });

    roundSmallLight2 = injectLoader(() => GLTFLoader, () => '/assets/round-small-2.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene)
    });

    squareBigLight1 = injectLoader(() => GLTFLoader, () => '/assets/square-big-1.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene)
    });

    squareBigLight2 = injectLoader(() => GLTFLoader, () => '/assets/square-big-2.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene)
    });

    squareSmallLight1 = injectLoader(() => GLTFLoader, () => '/assets/square-small-1.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene)
    });

    squareSmallLight2 = injectLoader(() => GLTFLoader, () => '/assets/square-small-2.glb', {
      onLoad:  ({scene}: {scene: Group}) => this.setMaterialColor(scene)
    });

    log(event: Event) {
        console.log(event);
    }

    setMaterialColor(scene: Group, color: string = 'FEEEAD')  {
      console.log(scene);
//console.log(this.texture());
      const mesh = scene.getObjectByName('imagetostl_mesh0') as Mesh;
      const materials: Material|Material[] = mesh.material;
      const texture = this.texture();
      //texture!.colorSpace = THREE.SRGBColorSpace;
      const material = new MeshBasicMaterial({map: texture});
      mesh.material = material;
     // material.color.setHex(parseInt(color, 16));
    }
}


