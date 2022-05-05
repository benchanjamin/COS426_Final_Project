/**
 * @license
 * Copyright 2021 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */
import {Fox, Marker} from './components/objects';
import {Vector2, Vector3} from 'three';
import {Mesh, MeshStandardMaterial, BoxGeometry} from 'three';
import ThreeJSOverlayView from "@ubilabs/threejs-overlay-view";
import * as Dat from 'dat.gui';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {random} from "gsap/gsap-core";


let map;
let coords = [
    {lat: 40.343976045616934, lng: -74.65633457372397},
    {lat: 40.34759851090708, lng: -74.65444991836445},
    {lat: 40.349153790790474, lng: -74.65177169580478},
    {lat: 40.34668462786897, lng: -74.65361797205118},
    {lat: 40.350711753138256, lng: -74.65050890117351},
    {lat: 40.34579955055668, lng: -74.65236397231686},
    {lat: 40.34478352718533, lng: -74.65610057205218}
];
let locationNames = [
    'Butler College',
    'Campus Club',
    'Carl A. Fields Center',
    'Center for Jewish Life',
    'EQuad',
    'Fine Hall',
    'First College'
]
let mainCharacter;
let currentMarker = null;
const mousePosition = new Vector2();
let currentScore = 0;
let currentBuilding = null;
const mapOptions = {
    tilt: 90,
    heading: 180,
    zoom: 21,
    center: {lat: 40.34691702328191, lng: -74.65530646968027},
    mapId: "95303993b7018d90",
    // disable interactions due to animation loop and moveCamera
    disableDefaultUI: false,
    gestureHandling: "greedy",
    keyboardShortcuts: false,
    clickableIcons: false,
    streetViewControl: true,
    fullscreenControl: false,
    // mapTypeId: 'satellite'
};

function initMap() {

    window.state = {
        gui: new Dat.GUI(),
        updateList: [],
    }

    window.addToUpdateList = (object) => {
        this.state.updateList.push(object);
    }

    const mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);

    window.VIEW_PARAMS = {
        center: {
            lat: map.getCenter().lat(),
            lng: map.getCenter().lng()
        },
        tilt: 90,
        heading: 60,
        zoom: 21
    };


    const scoreDiv = document.createElement("div");
    const scoreText = document.createElement("button");
    scoreText.classList.add("ui-box");
    scoreText.setAttribute('id', 'score');
    scoreText.innerText = `Score: ${currentScore}`;
    scoreDiv.appendChild(scoreText);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(scoreDiv);

    const buildingDiv = document.createElement("div");
    const building = document.createElement("button");
    building.classList.add("ui-box");
    building.setAttribute('id', 'building');
    building.innerText = `Go to default`;
    buildingDiv.appendChild(building);
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(buildingDiv);


    // This is the start of overlay functions
    const overlay = new ThreeJSOverlayView({
        ...VIEW_PARAMS.center
    });

    overlay.onAdd = () => {


        mainCharacter = helperFunctions.spawnMainCharacter(overlay)

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
            mainCharacter.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading() + 180);
            if (event.code == 'ArrowRight')
                adjustMap("rotate", amountRotate);
            mainCharacter.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading() + 180);
            if (event.code == 'ArrowDown' && !event.shiftKey) {
                let mapCenterVector3 = new Vector3();
                overlay.latLngAltToVector3({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, mapCenterVector3);
                if (Math.abs((mapCenterVector3.x - mainCharacter.position.x) ** 2 + (mapCenterVector3.y - mainCharacter.position.y) ** 2) > 0) {
                    let setLatLng = {
                        lat: 0,
                        lng: 0,
                        altitude: 0
                    };
                    overlay.vector3ToLatLngAlt(mainCharacter.position, setLatLng)
                    map.setCenter(setLatLng);
                }
                mainCharacter.state.action = "Run";
                adjustMap("move", amountMove);
                overlay.latLngAltToVector3({
                    lat: map.getCenter().lat(),
                    lng: map.getCenter().lng(),
                    altitude: 0
                }, mainCharacter.position);
                mainCharacter.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading());
            }
            if (event.code == 'ArrowUp' && !event.shiftKey) {
                let mapCenterVector3 = new Vector3();
                overlay.latLngAltToVector3({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, mapCenterVector3);
                if (Math.abs((mapCenterVector3.x - mainCharacter.position.x) ** 2 + (mapCenterVector3.y - mainCharacter.position.y) ** 2) > 0) {
                    let setLatLngAlt = {
                        lat: 0,
                        lng: 0,
                        altitude: 0
                    };
                    overlay.vector3ToLatLngAlt(mainCharacter.position, setLatLngAlt)
                    map.setCenter(setLatLngAlt);
                }
                mainCharacter.state.action = "Run";
                adjustMap("move", -amountMove);
                overlay.latLngAltToVector3({
                    lat: map.getCenter().lat(),
                    lng: map.getCenter().lng(),
                    altitude: 0
                }, mainCharacter.position);
                mainCharacter.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading() - 180);
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
    let animationRunning = true;

    overlay.update = () => {

        if (animationRunning) {
            for (const obj of this.state.updateList) {
                if (typeof obj.update !== 'undefined') {
                    obj.update();
                    overlay.requestRedraw();
                }
            }
        }

        if (currentMarker === null && $("#building").text() === "Go to default") {
            helperFunctions.spawnMarker(overlay);
        }

        if (currentMarker !== null && helperFunctions.distanceVector2D(mainCharacter.position, currentMarker.position) < 20) {
            helperFunctions.updateScore();
            helperFunctions.spawnMarker(overlay);
        }

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

    static spawnMainCharacter(overlay) {
        const scene = overlay.getScene();
        let mainCharacter = new Fox(window);
        const mainCharacterLocation = {...window.VIEW_PARAMS.center, altitude: 0};
        mainCharacter.scale.set(0.5, 0.5, 0.5);
        mainCharacter.rotation.x = (helperFunctions.degrees_to_radians(90));
        mainCharacter.rotation.y = helperFunctions.degrees_to_radians(-180);
        overlay.latLngAltToVector3(mainCharacterLocation, mainCharacter.position);
        scene.add(mainCharacter);

        return mainCharacter;
    }

    static spawnMarker(overlay) {
        if (currentMarker !== null) {
            let scene = overlay.getScene();
            scene.remove(currentMarker);
        }

        let randomIndex = Math.floor(Math.random() * coords.length)

        // randomly choose a coordinate from coordinates list
        let marker = new Marker(window);
        marker.name = locationNames[randomIndex];

        // set marker location
        let markerLocation = {...coords[randomIndex], altitude: 40}
        overlay.latLngAltToVector3(markerLocation, marker.position);

        // add to scene
        let scene = overlay.getScene();
        scene.add(marker);

        // add to global scope
        currentMarker = marker;

        // add to building name
        currentBuilding = marker.name;
        if (locationNames.length > 0) {
            $("#building").text("Go to " + marker.name);
        }
        else {
            $("#building").text("Congrats, you found all the buildings!")
        }

        // remove element from both lists using splice
        coords.splice(randomIndex, 1);
        locationNames.splice(randomIndex, 1);
    }

    static distanceVector2D(v1, v2) {
        let dx = v1.x - v2.x;
        let dy = v1.y - v2.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    static updateScore() {
        currentScore += 1;
        $("#score").text("Score: " + currentScore);
    }
}

window.initMap = initMap;
