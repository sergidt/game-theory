import { CUSTOM_ELEMENTS_SCHEMA, Component, viewChild, ElementRef, ChangeDetectionStrategy, AfterViewInit, AfterContentInit } from '@angular/core';
import { extend, injectBeforeRender, injectLoader, NgtArgs } from 'angular-three';
import { Mesh, BoxGeometry, MeshBasicMaterial, ShapeGeometry, BufferGeometry } from 'three';
import { GLTFLoader, STLLoader } from 'three-stdlib';
import { NgtsOrbitControls } from "angular-three-soba/controls";
import { NgtsEnvironment } from "angular-three-soba/staging";
import * as THREE from 'three';

extend({ Mesh, ShapeGeometry, MeshBasicMaterial });

@Component({
  selector: 'board',
  standalone: true,
  template: `
  <ngt-group [parameters]="{scale: 0.022, rotation: [-100, -60 , 0]}">
      <ngt-primitive *args="[board()?.scene]"/>

      <ngt-primitive *args="[roundBig1()?.scene]"
        color="black"
         [position]="[57,0, 57]"/>
      <ngt-primitive *args="[roundBig2()?.scene]"
        color="black"
        [position]="[57,0, 20]"/>
      <ngt-primitive *args="[roundSmall1()?.scene]"
        color="black"
        [position]="[57,0, -19]"/>
      <ngt-primitive *args="[roundSmall2()?.scene]"
        color="black"
        [position]="[57,0, -57]"/>

      <!-- SQUARE -->
      <ngt-primitive *args="[squareBig1()?.scene]"
      color="red"
      [position]="[-57,0, -57]"
      [scale]="0.8"
      />
      <ngt-primitive *args="[squareBig2()?.scene]"
        color="red"
        [position]="[-57,0, -20]"
           [scale]="0.8"/>
      <ngt-primitive *args="[squareSmall1()?.scene]"
        color="red"
        [position]="[-57,0, 19]"
           [scale]="0.8"/>
      <ngt-primitive *args="[squareSmall2()?.scene]"
        color="red"
        [position]="[-57,0, 57]"
           [scale]="0.8"/>
      </ngt-group>
<ngts-orbit-controls/>
<ngts-environment [options]="{preset: 'city'}"/>
  `,
  imports: [NgtArgs, NgtsOrbitControls, NgtsEnvironment],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  board = injectLoader(
    () => GLTFLoader, () => '/assets/board.glb',
    {
      onLoad: (geometry) => console.log('Board loaded!', geometry)
    });

  // Round models

  roundBig1 = injectLoader(
    () => GLTFLoader, () => '/assets/round-big-1.glb',
    {
      onLoad: (geometry) => console.log('Round Big 1 loaded!', geometry)
    });

  roundBig2 = injectLoader(
    () => GLTFLoader, () => '/assets/round-big-2.glb',
    {
      onLoad: (geometry) => console.log('Round Bing 2 loaded!', geometry)
    });

  roundSmall1 = injectLoader(
    () => GLTFLoader, () => '/assets/round-small-1.glb',
    {
      onLoad: (geometry) => console.log('Round Small 1 loaded!', geometry)
    });

  roundSmall2 = injectLoader(
    () => GLTFLoader, () => '/assets/round-small-2.glb',
    {
      onLoad: (geometry) => console.log('Round Small 2 loaded!', geometry)
    });

  // Square models

  squareBig1 = injectLoader(
    () => GLTFLoader, () => '/assets/square-big-1.glb',
    {
      onLoad: (geometry) => console.log('Square Big 1 loaded!', geometry)
    });

  squareBig2 = injectLoader(
    () => GLTFLoader, () => '/assets/square-big-2.glb',
    {
      onLoad: (geometry) => console.log('Square Bing 2 loaded!', geometry)
    });

  squareSmall1 = injectLoader(
    () => GLTFLoader, () => '/assets/square-small-1.glb',
    {
      onLoad: (geometry) => console.log('Square Small 1 loaded!', geometry)
    });

  squareSmall2 = injectLoader(
    () => GLTFLoader, () => '/assets/square-small-2.glb',
    {
      onLoad: (geometry) => console.log('Square Small 2 loaded!', geometry)
    });
}

