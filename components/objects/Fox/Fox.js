import * as THREE from 'three';
import { Group, Int8Attribute } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as Dat from 'dat.gui';

class Fox extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(),
            model: null,
            animation: null,
            mixer: null,
            clips: null,
            // Can select Survey Run or Walk
            action: "Survey",
            speed: 1

        };

        this.name = 'fox';
        var state = this.state;
        var gui = this.state.gui;

        var fox = this;
        const loader = new GLTFLoader();
        const source = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF/Fox.gltf";
        loader.load(source, (gltf) => {
            console.log(gltf);

            //Create animation mixer and clips to run later
            fox.state.model = gltf;
            fox.state.mesh = gltf.scene;
            fox.state.mixer = new THREE.AnimationMixer( gltf.scene );
            fox.state.clips = fox.state.model.animations;

            this.add(gltf.scene);
            this.scale.set(.05,.05,.05);
            // this.translateX(2);
            console.log("loaded");
        });

        gui.add(state, 'action', [ 'Walk', 'Run', 'Survey'] ).onChange(function (value) {
            state.mixer.stopAllAction();
            state.action = value;
        });


        document.addEventListener('keydown', function(event){
            if (event.code == 'ArrowLeft')
                state.mesh.rotation.y += 0.25;
            if (event.code == 'ArrowRight')
                state.mesh.rotation.y -= 0.25;
            if (event.code == 'ArrowUp'){
                state.mesh.position.z += 1;
                state.action = "Walk"
            }
            if (event.code == 'ArrowDown'){
                state.mesh.position.z -= 1;
                state.action = "Walk"
            }
        });

        document.addEventListener('keyup', function(event){
            if (event.code == 'ArrowUp')
                state.mixer.stopAllAction();
            state.action = "Survey"
            if (event.code == 'ArrowDown')
                state.mixer.stopAllAction();
            state.action = "Survey"
        });


        /*gui.add(state, 'speed', [0], [5] ).onChange(function (value) {
            state.mixer.stopAllAction();
            state.action = value;
        });*/

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        //this.customGuiStuff = this.state.gui.add(this.state, 'action');
    }

    update(timeStamp){
        if (this.state.model != null){
            if (this.state.action == "Run"){
                this.state.mixer.update(.03);
            }else{this.state.mixer.update(.01)}
            var clip = THREE.AnimationClip.findByName( this.state.model, this.state.action );
            var action = this.state.mixer.clipAction( clip );
            action.play();
        }
    }



    cleanUp() {
        //this.state.gui.remove(this.customGuiStuff);
        this.state.gui.destroy();
    }



}

export default Fox;