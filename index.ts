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
import ThreejsOverlayView from '@ubilabs/threejs-overlay-view';
import {Vector2} from 'three';
import {Mesh, MeshStandardMaterial, BoxGeometry} from 'three';


import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import ThreeJSOverlayView from "@ubilabs/threejs-overlay-view";

let map: google.maps.Map;

const mousePosition = new Vector2();

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

function initMap(): void {
    const mapDiv = document.getElementById("map") as HTMLElement;
    map = new google.maps.Map(mapDiv, mapOptions);

    map.addListener('mousemove', ev => {
        const {domEvent} = ev;
        const {left, top, width, height} = mapDiv.getBoundingClientRect();

        const x = domEvent.clientX - left;
        const y = domEvent.clientY - top;

        mousePosition.x = 2 * (x / width) - 1;
        mousePosition.y = 1 - 2 * (y / height);

        // since the actual raycasting is happening in the update function,
        // we have to make sure that it will be called for the next frame.
        overlay.requestRedraw();
    });

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

    // This is the start of overlay functions
    const VIEW_PARAMS = {
        center: {
            lat: 40.343899,
            lng: -74.660049
        },
        tilt: 67.5,
        heading: 60,
        zoom: 18
    };


    const overlay = new ThreeJSOverlayView({
        ...VIEW_PARAMS.center
    });

    overlay.onAdd = () => {
        const scene = overlay.getScene();
        const cube = new Mesh(
            new BoxGeometry(20, 20, 20),
            new MeshStandardMaterial({color: 0xff0000})
        );

        const cubeLocation = {...VIEW_PARAMS.center, altitude: 50};
        overlay.latLngAltToVector3(cubeLocation, cube.position);

        scene.add(cube);
    }

    const DEFAULT_COLOR = 0xffffff;
    const HIGHLIGHT_COLOR = 0x00ff00;

    let highlightedObject = null;

    overlay.update = () => {
        const intersections = overlay.raycast(mousePosition);
        if (highlightedObject) {
            // @ts-ignore
            highlightedObject.material.color.setHex(DEFAULT_COLOR);
        }

        if (intersections.length === 0) return;

        highlightedObject = intersections[0].object;
        // @ts-ignore
        highlightedObject.material.color.setHex(HIGHLIGHT_COLOR);
    };


    overlay.setMap(map);
}

declare global {
    interface Window {
        initMap: () => void;
    }
}
window.initMap = initMap;
export {};
