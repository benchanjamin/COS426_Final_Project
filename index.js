/**
 * @license
 * Copyright 2021 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */
import {Fox} from './components/objects';
import {Vector2, Vector3} from 'three';
import {Mesh, MeshStandardMaterial, BoxGeometry} from 'three';
import ThreeJSOverlayView from "@ubilabs/threejs-overlay-view";
import * as Dat from 'dat.gui';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";


let map, fox, loader;
const mousePosition = new Vector2();
const mapOptions = {
    tilt: 90,
    heading: 180,
    zoom: 21,
    center: {lat: 40.34691702328191, lng: -74.65530646968027},
    mapId: "95303993b7018d90",
    // disable interactions due to animation loop and moveCamera
    disableDefaultUI: true,
    gestureHandling: "greedy",
    keyboardShortcuts: false,
    clickableIcons: false,
    streetViewControl: true,
    fullscreenControl: false,
};

function initMap() {


    this.state = {
        gui: new Dat.GUI(),
        updateList: [],
    }

    this.addToUpdateList = (object) => {
        this.state.updateList.push(object);
    }

    const mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);

    const VIEW_PARAMS = {
        center: {
            lat: map.getCenter().lat(),
            lng: map.getCenter().lng()
        },
        tilt: 90,
        heading: 60,
        zoom: 21
    };


    // This is the start of overlay functions
    const overlay = new ThreeJSOverlayView({
        ...VIEW_PARAMS.center
    });

    overlay.onAdd = () => {

        const scene = overlay.getScene();

        // const cube = new Mesh(new BoxGeometry(20, 20, 20), new MeshStandardMaterial({color: 0xff0000}));
        fox = new Fox(this);
        const foxLocation = {...VIEW_PARAMS.center, altitude: 20};
        fox.scale.set(0.5, 0.5, 0.5);
        fox.rotation.x = (helperFunctions.degrees_to_radians(90));
        fox.rotation.y = helperFunctions.degrees_to_radians(-180);
        // overlay.latLngAltToVector3(foxLocation, fox.position);
        scene.add(fox);

        loader = new GLTFLoader();
        const source =
            "https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf";
        loader.load(source, (gltf) => {
            // Butler College Coords
            let commonCoords = {lat: 40.343976045616934, lng: -74.65633457372397};
            gltf.scene.scale.set(10, 10, 10);
            gltf.scene.rotation.x = Math.PI; // Rotations are in radians.
            overlay.latLngAltToVector3(gltf.scene.location, gltf.scene.location)
            scene.add(gltf.scene);
        });

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
            const amountTilt = 10;
            const amountRotate = 10;
            const amountMove = 30;
            if (event.code == 'ArrowLeft')
                adjustMap("rotate", -amountRotate);
                fox.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading() + 180);
            if (event.code == 'ArrowRight')
                adjustMap("rotate", amountRotate);
                fox.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading() + 180);
            if (event.code == 'ArrowDown' && !event.shiftKey) {
                let mapCenterVector3 = new Vector3();
                overlay.latLngAltToVector3({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, mapCenterVector3);
                if (Math.abs((mapCenterVector3.x - fox.position.x) ** 2 + (mapCenterVector3.y - fox.position.y) ** 2) > 0) {
                    let setLatLng = {
                        lat: 0,
                        lng: 0,
                        altitude: 0
                    };
                    overlay.vector3ToLatLngAlt(fox.position, setLatLng)
                    map.setCenter(setLatLng);
                    map.setZoom(21);
                }
                fox.state.action = "Run";
                adjustMap("move", amountMove);
                // map.center = fox.position;
                overlay.latLngAltToVector3({
                    lat: map.getCenter().lat(),
                    lng: map.getCenter().lng(),
                    altitude: 0
                }, fox.position);
                fox.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading());
            }
            if (event.code == 'ArrowUp' && !event.shiftKey) {
                let mapCenterVector3 = new Vector3();
                overlay.latLngAltToVector3({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, mapCenterVector3);
                if (Math.abs((mapCenterVector3.x - fox.position.x) ** 2 + (mapCenterVector3.y - fox.position.y) ** 2) > 0) {
                    let setLatLngAlt = {
                        lat: 0,
                        lng: 0,
                        altitude: 0
                    };
                    overlay.vector3ToLatLngAlt(fox.position, setLatLngAlt)
                    map.setCenter(setLatLngAlt);
                    map.setZoom(21);
                }
                fox.state.action = "Run";
                adjustMap("move", -amountMove);
                overlay.latLngAltToVector3({
                    lat: map.getCenter().lat(),
                    lng: map.getCenter().lng(),
                    altitude: 0
                }, fox.position);
                fox.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading() - 180);
            }
            if (event.code == 'ArrowDown' && event.shiftKey) {
                adjustMap("tilt", amountTilt);
            }
            if (event.code == 'ArrowUp' && event.shiftKey) {
                adjustMap("tilt", -amountTilt);
            }
        });
        const adjustMap = function (mode, amount) {
            switch (mode) {
                case "tilt":
                    map.setTilt(map.getTilt() + amount);
                    break;
                case "rotate":
                    map.setHeading(map.getHeading() + amount);
                    break;
                case "move":
                    map.panBy(0, amount);
                    break;
                default:
                    break;
            }
        };

    };
    const DEFAULT_COLOR = 0xffffff;
    const HIGHLIGHT_COLOR = 0x00ff00;
    let highlightedObject = null;

    overlay.update = () => {

        if (true) {
            for (const obj of this.state.updateList) {
                obj.update();
                overlay.requestRedraw();
            }
        }


        // if (true) {
        //     for (const obj of this.state.updateList) {
        //         obj.update();
        //         overlay.requestRedraw();
        //     }
        // }

        // if (fox.state.action === "Survey") {
        //     for (const obj of this.state.updateList) {
        //         obj.update();
        //         overlay.requestRedraw();
        //     }
        // }


        const intersections = overlay.raycast(mousePosition);
        if (highlightedObject) {
            highlightedObject.material.color.setHex(DEFAULT_COLOR);
        }
        if (intersections.length === 0)
            return;
        highlightedObject = intersections[0].object;
        highlightedObject.material.color.setHex(HIGHLIGHT_COLOR);


    };

    overlay.setMap(map);

}

class helperFunctions {
    static degrees_to_radians(degrees) {
        let pi = Math.PI;
        return degrees * (pi / 180);
    }
}

window.initMap = initMap;
