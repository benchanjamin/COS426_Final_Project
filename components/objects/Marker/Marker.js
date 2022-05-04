import * as THREE from 'three';
import { Group, Int8Attribute } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as Dat from "dat.gui";

class Marker extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            name: null,
            model: null,
            animation: null,
            mixer: null,
            clips: null,
            // Can select Survey Run or Walk
            action: "Survey",
            speed: 1
        };

        let state = this.state;
        state.name = 'marker';
        let gui = this.state.gui;

        let marker = this;
        const loader = new GLTFLoader();
        const source = "https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf";
        loader.load(source, (gltf) => {
            //Create animation mixer and clips to run later
            marker.state.model = gltf;
            marker.state.mesh = gltf.scene;
            // marker.state.mixer = new THREE.AnimationMixer( gltf.scene );
            // marker.state.clips = marker.state.model.animations;

            this.add(gltf.scene);
            this.scale.set(10,10,10);
            gltf.scene.rotation.x = Math.PI; // Rotations are in radians.
            // this.translateX(2);
            console.log("marker loaded");
        });

        // gui.add(state, 'action', [ 'Walk', 'Run', 'Survey'] ).onChange(function (value) {
        //     state.mixer.stopAllAction();
        //     state.action = value;
        // });


        // document.addEventListener('keydown', function(event){
        //     if (event.code == 'ArrowLeft')
        //         // state.mesh.rotation.y += 0.25;
        //         if (event.code == 'ArrowRight')
        //             // state.mesh.rotation.y -= 0.25;
        //             if (event.code == 'ArrowUp'){
        //                 state.mesh.position.z += 1;
        //                 state.action = "Walk"
        //             }
        //     if (event.code == 'ArrowDown'){
        //         state.mesh.position.z -= 1;
        //         state.action = "Walk"
        //     }
        // });
        //
        // document.addEventListener('keyup', function(event){
        //     if (event.code == 'ArrowUp')
        //         state.mixer.stopAllAction();
        //     state.action = "Survey"
        //     if (event.code == 'ArrowDown')
        //         state.mixer.stopAllAction();
        //     state.action = "Survey"
        // });

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }
}

export default Marker;