/**
 * @license
 * Copyright 2021 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */
import {Fox, Marker, Blocky} from './components/objects';
import {Vector2, Vector3} from 'three';
import {
    AmbientLight,
    DirectionalLight,
} from "three";
import ThreeJSOverlayView from "@ubilabs/threejs-overlay-view";
import * as Dat from 'dat.gui';


let map;
let pause = false;
let coords = [
    {lat: 40.343976045616934, lng: -74.65633457372397},
    {lat: 40.34759851090708, lng: -74.65444991836445},
    {lat: 40.349153790790474, lng: -74.65177169580478},
    {lat: 40.34668462786897, lng: -74.65361797205118},
    {lat: 40.350711753138256, lng: -74.65050890117351},
    {lat: 40.34579955055668, lng: -74.65236397231686},
    {lat: 40.34478352718533, lng: -74.65610057205218},
    {lat: 40.35030090667399, lng: -74.65274518999759},
    {lat: 40.34691702328191, lng: -74.65530646968027},
    {lat: 40.34956080912481, lng: -74.65595567330864},
    {lat: 40.34610602786555, lng: -74.65264530091227},
    {lat: 40.347777407020686, lng: -74.66143412554321},
    {lat: 40.34796187587709, lng: -74.65781638535157},
    {lat: 40.348501551479494, lng: -74.66218745569728},
    {lat: 40.34415029916429, lng: -74.65822212183382}
];
let locationNames = [
    'Butler College',
    'Campus Club',
    'Carl A. Fields Center',
    'Center for Jewish Life',
    'EQuad',
    'Fine Hall',
    'First College',
    'Friend Center',
    'Frist Campus Center',
    'Green Hall',
    'Lewis Library',
    'Mathey College',
    'Murray-Dodge Hall',
    'Rocky College',
    'Whitman College'
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
    center: {lat: 40.34656555133785, lng: -74.65691193394235},
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
        //gui: new Dat.GUI(),
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
    // scoreText.setAttribute('style', '');
    scoreDiv.appendChild(scoreText);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(scoreDiv);

    const buildingDiv = document.createElement("div");
    const building = document.createElement("button");
    building.classList.add("ui-box");
    building.setAttribute('id', 'building');
    // building.setAttribute('style', '');
    building.innerText = `Go to default`;
    buildingDiv.appendChild(building);
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(buildingDiv);


    // This is the start of overlay functions
    const overlay = new ThreeJSOverlayView({
        ...VIEW_PARAMS.center
    });

    let scene = overlay.getScene();
    const ambientLight = new AmbientLight(0xffffff, 1); // Soft white light.
    scene.add(ambientLight);

    const directionalLight1 = new DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, -1, 2);
    scene.add(directionalLight1);

    const directionalLight2 = new DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-1, 1, -2);
    scene.add(directionalLight2);


    const directionalLight3 = new DirectionalLight(0xffffff, 0.4);
    directionalLight3.position.set(0, 0, -2);
    scene.add(directionalLight3);


    const directionalLight4 = new DirectionalLight(0xffffff, 0.4);
    directionalLight4.position.set(0, 0, 2);
    scene.add(directionalLight4);

    overlay.onAdd = () => {


        mainCharacter = helperFunctions.spawnMainCharacter(overlay)

        for (let i = 0; i < 30; i++) {
            setTimeout(function () {
                helperFunctions.spawnAdversaryCharacter(overlay)
            }, i / 60 * 1000);

        }

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
            const amountMoveInKM = 0.005;
            if (event.code == 'ArrowLeft') {
                let mapCenterVector3 = new Vector3();
                overlay.latLngAltToVector3({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, mapCenterVector3);
                if (Math.abs((mapCenterVector3.x - mainCharacter.group.position.x) ** 2 + (mapCenterVector3.y - mainCharacter.group.position.y) ** 2) > 0) {
                    let setLatLng = {
                        lat: 0,
                        lng: 0,
                        altitude: 0
                    };
                    overlay.vector3ToLatLngAlt(mainCharacter.group.position, setLatLng)
                    map.setCenter(setLatLng);
                }
                adjustMap("rotate", -amountRotate);
                // mainCharacter.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading() + 180);
            }
            if (event.code == 'ArrowRight') {
                let mapCenterVector3 = new Vector3();
                overlay.latLngAltToVector3({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, mapCenterVector3);
                if (Math.abs((mapCenterVector3.x - mainCharacter.group.position.x) ** 2 + (mapCenterVector3.y - mainCharacter.group.position.y) ** 2) > 0) {
                    let setLatLng = {
                        lat: 0,
                        lng: 0,
                        altitude: 0
                    };
                    overlay.vector3ToLatLngAlt(mainCharacter.group.position, setLatLng)
                    map.setCenter(setLatLng);
                }
                adjustMap("rotate", amountRotate);
                // mainCharacter.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading() + 180);
            }
            if (event.code == 'ArrowDown' && !event.shiftKey && !mainCharacter.state.pause) {
                let mapCenterVector3 = new Vector3();
                let setLatLng = {
                    lat: 0,
                    lng: 0,
                    altitude: 0
                };
                overlay.latLngAltToVector3({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, mapCenterVector3);
                if (Math.abs((mapCenterVector3.x - mainCharacter.group.position.x) ** 2 + (mapCenterVector3.y - mainCharacter.group.position.y) ** 2) > 0) {

                    overlay.vector3ToLatLngAlt(mainCharacter.group.position, setLatLng)
                    map.setCenter(setLatLng);
                }
                // mainCharacter.state.action = "Run";
                adjustMap("move", -amountMoveInKM);
                let targetPosition = new Vector3();
                overlay.latLngAltToVector3({
                    lat: map.getCenter().lat(),
                    lng: map.getCenter().lng(),
                    altitude: 0
                }, targetPosition);

                let differenceVector = targetPosition.sub(mainCharacter.group.position);
                let blender = 1 / 60.0;
                let towardMove = differenceVector.multiplyScalar(blender)

                for (let i = 1; i <= 60; i++) {

                    setTimeout(function () {
                        mainCharacter.group.position.add(towardMove)
                    }, i / 40 * 500);
                }
                mainCharacter.group.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading());
            }
            if (event.code == 'ArrowUp' && !event.shiftKey && !mainCharacter.state.pause) {
                let mapCenterVector3 = new Vector3();
                let setLatLngAlt = {
                    lat: 0,
                    lng: 0,
                    altitude: 0
                };
                overlay.latLngAltToVector3({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, mapCenterVector3);
                if (Math.abs((mapCenterVector3.x - mainCharacter.group.position.x) ** 2 + (mapCenterVector3.y - mainCharacter.group.position.y) ** 2) > 0) {
                    overlay.vector3ToLatLngAlt(mainCharacter.group.position, setLatLngAlt)
                    map.setCenter(setLatLngAlt);
                }
                // mainCharacter.state.action = "Run";
                adjustMap("move", amountMoveInKM);
                let targetPosition = new Vector3();
                overlay.latLngAltToVector3({
                    lat: map.getCenter().lat(),
                    lng: map.getCenter().lng(),
                    altitude: 0
                }, targetPosition);

                let differenceVector = targetPosition.sub(mainCharacter.group.position);
                let blender = 1 / 60.0;
                let towardMove = differenceVector.multiplyScalar(blender)

                for (let i = 1; i <= 60; i++) {
                    setTimeout(function () {
                        mainCharacter.group.position.add(towardMove)
                    }, i / 60 * 500);

                }
                mainCharacter.group.rotation.y = helperFunctions.degrees_to_radians(-map.getHeading() - 180);
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
                    const R = 6378.1
                    let previousLat = helperFunctions.degrees_to_radians(map.getCenter().lat());
                    let previousLng = helperFunctions.degrees_to_radians(map.getCenter().lng());
                    let bearing = helperFunctions.degrees_to_radians(map.getHeading());
                    let newLat = Math.asin(Math.sin(previousLat) * Math.cos(amount / R) +
                        Math.cos(previousLat) * Math.sin(amount / R) * Math.cos(bearing))
                    let newLng = previousLng + Math.atan2(Math.sin(bearing) * Math.sin(amount / R) *
                        Math.cos(previousLat),
                        Math.cos(amount / R) - Math.sin(previousLat) * Math.sin(newLat))
                    map.panTo({
                        lat: helperFunctions.radians_to_degrees(newLat),
                        lng: helperFunctions.radians_to_degrees(newLng)
                    });
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
            // console.log(mainCharacter.group.position);
            // console.log(mainCharacter.params);
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

        if (currentMarker !== null && helperFunctions.distanceVector2D(mainCharacter.group.position, currentMarker.position) < 10) {
            helperFunctions.updateScore(1);
            helperFunctions.spawnMarker(overlay);
        }

        if (currentMarker !== null && !mainCharacter.state.pause) {
            for (const obj of this.state.updateList) {
                if (typeof obj.update !== 'undefined' && obj.userData.name === 'adversary') {

                    for (var objToCollide of this.state.updateList) {
                        if (typeof objToCollide.update !== 'undefined' && objToCollide.userData.name === 'adversary') {
                            if (helperFunctions.distanceVector2D(objToCollide.position, obj.position) < 16) {
                                let diffVector = new Vector3();
                                diffVector.subVectors(objToCollide.position, obj.position);
                                diffVector.z = 0;
                                diffVector.normalize().multiplyScalar(-0.25);
                                obj.position.add(diffVector);

                            }

                        }
                    }

                    let diffVector = new Vector3();
                    diffVector.subVectors(currentMarker.position, obj.position);
                    diffVector.z = 0;
                    diffVector.normalize();
                    // var currCount = obj.state.internalCounter % 120;
                    // if (currCount >= 90) {
                    //     // reset to 0
                    //     if (obj.state.internalCounter == 119) {
                    //         obj.state.internalCounter = 0;
                    //     }
                    //     //saveStartCounter = counter
                    //     //console.log(currCount);
                    //     diffVector.x += (Math.random() - 0.5) * 10;
                    //     diffVector.y += (Math.random() - 0.5) * 10;
                    // }

                    // for (let i = 1; i <= 60; i++) {
                    //     // setTimeout(function () {
                    //
                    //     // }, i / 60 * 500);
                    // }
                    obj.position.add(diffVector.multiplyScalar(0.2));

                    if (helperFunctions.distanceVector2D(currentMarker.position, obj.position) < 3) {
                        helperFunctions.updateScore(0);
                        helperFunctions.spawnMarker(overlay);
                    }
                    // obj.rotation.lookAt(currentMarker.position)
                    // console.log(obj.position);
                    let angle = Math.atan2(diffVector.y, diffVector.x) + helperFunctions.degrees_to_radians(90);
                    obj.rotation.y = angle;
                    var diffAngles = angle - obj.rotation.y;

                    obj.update();
                    overlay.requestRedraw();
                    obj.state.internalCounter = obj.state.internalCounter + 1;
                }
            }
        }

        // const intersections = overlay.raycast(mousePosition);
        // if (highlightedObject) {
        //     highlightedObject.material.color.setHex(DEFAULT_COLOR);
        // }
        // if (intersections.length === 0)
        //     return;
        // highlightedObject = intersections[0].object;
        // if (highlightedObject) {
        //     console.log(highlightedObject.name);
        // }
        // if (highlightedObject.name === 'fox') {
        //     highlightedObject.material.color.setHex(HIGHLIGHT_COLOR);
        //     highlightedObject.position.x = 100;
        //     console.log(highlightedObject.position)
        // }

        // highlightedObject = intersections[0].object;
        // highlightedObject.material.color.setHex(HIGHLIGHT_COLOR);


    };

    overlay.setMap(map);

}

class helperFunctions {
    static degrees_to_radians(degrees) {
        let pi = Math.PI;
        return degrees * (pi / 180);
    }

    static radians_to_degrees(radians) {
        let pi = Math.PI;
        return radians * (180 / pi);
    }

    static spawnMainCharacter(overlay) {
        const scene = overlay.getScene();
        let mainCharacter = new Blocky(scene, window);
        mainCharacter.userData.name = 'mainCharacter'

        const mainCharacterLocation = {...window.VIEW_PARAMS.center, altitude: 0};
        // mainCharacter.scale.set(10000, 100000, 10000);
        mainCharacter.group.rotation.x = (helperFunctions.degrees_to_radians(90));
        mainCharacter.group.rotation.y = helperFunctions.degrees_to_radians(-180);
        overlay.latLngAltToVector3(mainCharacterLocation, mainCharacter.group.position);
        overlay.latLngAltToVector3(mainCharacterLocation, mainCharacter.group.position);
        scene.add(mainCharacter);

        return mainCharacter;
    }

    static spawnAdversaryCharacter(overlay) {
        const scene = overlay.getScene();
        let adversary = new Fox(window, true);
        adversary.userData.name = 'adversary'

        const adversaryLocation = {
            lat: map.getCenter().lat() + (Math.random() - 0.5) * 0.01,
            lng: map.getCenter().lng() + (Math.random() - 0.5) * 0.01,
            altitude: 0
        };
        adversary.scale.set(0.5, 0.5, 0.5);
        adversary.rotation.x = (helperFunctions.degrees_to_radians(90));
        adversary.rotation.y = (Math.random() - 0.5) * helperFunctions.degrees_to_radians(-180);
        overlay.latLngAltToVector3(adversaryLocation, adversary.position);

        // if (currentMarker !== null) {
        //     // walk towards current marker
        //     // let scene = overlay.getScene();
        //     //scene.remove(currentMarker);
        // }
        scene.add(adversary);

        return adversary;
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
        let markerLocation = {...coords[randomIndex], altitude: 20}

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
        } else {
            $("#building").text("All the food has been eaten!")
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

    static updateScore(increment) {
        currentScore += increment;
        $("#score").text("Score: " + currentScore);
    }
}

window.initMap = initMap;
