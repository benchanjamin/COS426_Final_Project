/**
 * @license
 * Copyright 2021 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    AmbientLight,
    DirectionalLight,
    Matrix4,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Raycaster,
} from "three";
import {Easing, Tween, update} from "@tweenjs/tween.js";
import ThreejsOverlayView from '@ubilabs/threejs-overlay-view';
import {Mesh, MeshStandardMaterial, BoxGeometry} from 'three';


import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import ThreeJSOverlayView from "@ubilabs/threejs-overlay-view";

let map: google.maps.Map;

const mapOptions = {
    tilt: 90,
    heading: 180,
    zoom: 18,
    center: {lat: 40.343899, lng: -74.660049},
    mapId: "95303993b7018d90",
    // disable interactions due to animation loop and moveCamera
    disableDefaultUI: true,
    gestureHandling: "greedy",
    keyboardShortcuts: false,
    clickableIcons: false,
    streetViewControl: true,
    fullscreenControl: false,
};

const VIEW_PARAMS = {
    center: {
        lat: 40.343899,
        lng: -74.660049
    },
    tilt: 67.5,
    heading: 60,
    zoom: 18
};

function initMap(): void {
    const mapDiv = document.getElementById("map") as HTMLElement;
    map = new google.maps.Map(mapDiv, mapOptions);


    document.addEventListener('keydown', function (event) {
        const amount = 10;
        if (event.code == 'ArrowLeft')
            adjustMap("rotate", -amount);
        if (event.code == 'ArrowRight')
            adjustMap("rotate", amount);
        if (event.code == 'ArrowDown')
            adjustMap("move", amount);
        if (event.code == 'ArrowUp')
            adjustMap("move", -amount);
        if (event.code == 'ArrowDown' && event.shiftKey)
            adjustMap("tilt", amount);
        if (event.code == 'ArrowUp' && event.shiftKey)
            adjustMap("tilt", -amount);
    });

    const adjustMap = function (mode: string, amount: number) {
        switch (mode) {
            case "tilt":
                map.setTilt(map.getTilt()! + amount);
                break;
            case "rotate":
                map.setHeading(map.getHeading()! + amount);
                break;
            case "move":
                map.panBy(0, amount);
                break;
            default:
                break;
        }
    };

    const overlay = new ThreeJSOverlayView({
        ...VIEW_PARAMS.center
    });

    const scene = overlay.getScene();
    const cube = new Mesh(
        new BoxGeometry(20, 20, 20),
        new MeshStandardMaterial({color: 0xff0000})
    );

    const cubeLocation = {...VIEW_PARAMS.center, altitude: 50};
    overlay.latLngAltToVector3(cubeLocation, cube.position);

    scene.add(cube);
    overlay.setMap(map);
}

declare global {
    interface Window {
        initMap: () => void;
    }
}
window.initMap = initMap;
export {};
