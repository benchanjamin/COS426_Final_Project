import * as THREE from 'three';
import {Group, Int8Attribute} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {update} from "@tweenjs/tween.js";

class helperFunctions {
    static degrees_to_radians(degrees) {
        let pi = Math.PI;
        return degrees * (pi / 180);
    }
}

class Fox extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            model: null,
            animation: null,
            mixer: null,
            clips: null,
            action: "Run",
            survey: true

        };

        this.name = 'fox';

        let fox = this;
        const loader = new GLTFLoader();
        const source = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF/Fox.gltf";
        loader.load(source, (gltf) => {
            console.log(gltf);

            //Create animation mixer and clips to run later
            fox.state.model = gltf;
            fox.state.mixer = new THREE.AnimationMixer(gltf.scene);
            fox.state.clips = fox.state.model.animations;

            this.add(gltf.scene);
            this.scale.set(.5, .5, .5);
            this.rotation.x = (helperFunctions.degrees_to_radians(90));
            this.rotation.y = helperFunctions.degrees_to_radians( -180)
            // this.rotateY(helperFunctions.degrees_to_radians(180));
            // this.translateX(2);
            console.log("loaded");
        });
        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        this.state.gui.add(this.state, 'survey');
    }

    update = (timeStamp, bool) => {
        if (this.state.model != null) {
            if (this.state.action == "Run") {
                this.state.mixer.update(.03);
            } else {
                this.state.mixer.update(.01)
            }
            const clip = THREE.AnimationClip.findByName(this.state.model, this.state.action);
            const action = this.state.mixer.clipAction(clip);
            action.play();
            return true;
        }
    }


}

export default Fox;
