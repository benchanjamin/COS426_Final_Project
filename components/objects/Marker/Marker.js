import * as THREE from 'three';
import {Group, Int8Attribute} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as Dat from "dat.gui";

class Marker extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            name: null,
            model: null,
            mesh: null,
        };

        let state = this.state;
        state.name = 'marker';
        let gui = this.state.gui;

        let marker = this;
        const loader = new GLTFLoader();
        // const source = "https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf";
        const sourceList = ["./components/objects/Marker/pizza.gltf", "./components/objects/Marker/GLTFs/frappe.glb", "./components/objects/Marker/GLTFs/grapes.glb", "./components/objects/Marker/GLTFs/apple.glb", "./components/objects/Marker/GLTFs/fishBones.glb", "./components/objects/Marker/GLTFs/fries.glb", "./components/objects/Marker/GLTFs/cherries.glb", "./components/objects/Marker/GLTFs/orange.glb", "./components/objects/Marker/GLTFs/potStew.glb", "./components/objects/Marker/GLTFs/pepper.glb", "./components/objects/Marker/GLTFs/watermelon.glb", "./components/objects/Marker/GLTFs/cheese.glb", "./components/objects/Marker/GLTFs/iceCreamCone.glb", "./components/objects/Marker/GLTFs/donutSprinkles.glb", "./components/objects/Marker/GLTFs/makiRoe.glb", "./components/objects/Marker/GLTFs/dimSum.glb", "./components/objects/Marker/GLTFs/muffin.glb", "./components/objects/Marker/GLTFs/cookingFork.glb", "./components/objects/Marker/GLTFs/candyBar.glb", "./components/objects/Marker/GLTFs/avocado.glb", "./components/objects/Marker/GLTFs/pear.glb", "./components/objects/Marker/GLTFs/sausage.glb", "./components/objects/Marker/GLTFs/meatPatty.glb", "./components/objects/Marker/GLTFs/salad.glb", "./components/objects/Marker/GLTFs/iceCream.glb", "./components/objects/Marker/GLTFs/leek.glb", "./components/objects/Marker/GLTFs/burgerCheese.glb", "./components/objects/Marker/GLTFs/meatSausage.glb", "./components/objects/Marker/GLTFs/meatCooked.glb", "./components/objects/Marker/GLTFs/sundae.glb", "./components/objects/Marker/GLTFs/wholerHam.glb", "./components/objects/Marker/GLTFs/cakeBirthday.glb", "./components/objects/Marker/GLTFs/gingerBread.glb", "./components/objects/Marker/GLTFs/pizza.glb", "./components/objects/Marker/GLTFs/bacon.glb", "./components/objects/Marker/GLTFs/hotDogRaw.glb", "./components/objects/Marker/GLTFs/celeryStick.glb", "./components/objects/Marker/GLTFs/banana.glb", "./components/objects/Marker/GLTFs/lemon.glb", "./components/objects/Marker/GLTFs/pumpkinBasic.glb", "./components/objects/Marker/GLTFs/makiSalmon.glb", "./components/objects/Marker/GLTFs/mushroomHalf.glb", "./components/objects/Marker/GLTFs/makiVegetable.glb", "./components/objects/Marker/GLTFs/egg.glb", "./components/objects/Marker/GLTFs/musselOpen.glb", "./components/objects/Marker/GLTFs/strawberry.glb", "./components/objects/Marker/GLTFs/cabbage.glb", "./components/objects/Marker/GLTFs/sandwich.glb", "./components/objects/Marker/GLTFs/mussel.glb", "./components/objects/Marker/GLTFs/eggplant.glb", "./components/objects/Marker/GLTFs/chocolate.glb", "./components/objects/Marker/GLTFs/lollypop.glb", "./components/objects/Marker/GLTFs/sushiSalmon.glb", "./components/objects/Marker/GLTFs/candyBarWrapper.glb", "./components/objects/Marker/GLTFs/radish.glb", "./components/objects/Marker/GLTFs/taco.glb", "./components/objects/Marker/GLTFs/plateSauerkraut.glb", "./components/objects/Marker/GLTFs/donut.glb", "./components/objects/Marker/GLTFs/pumpkin.glb", "./components/objects/Marker/GLTFs/cupcake.glb", "./components/objects/Marker/GLTFs/eggCooked.glb", "./components/objects/Marker/GLTFs/paprika.glb", "./components/objects/Marker/GLTFs/peanutButter.glb", "./components/objects/Marker/GLTFs/broccoli.glb", "./components/objects/Marker/GLTFs/burgerCheeseDouble.glb", "./components/objects/Marker/GLTFs/pie.glb", "./components/objects/Marker/GLTFs/burger.glb", "./components/objects/Marker/GLTFs/panStew.glb", "./components/objects/Marker/GLTFs/fish.glb", "./components/objects/Marker/GLTFs/avocadoHalf.glb", "./components/objects/Marker/GLTFs/loafBaguette.glb", "./components/objects/Marker/GLTFs/loaf.glb", "./components/objects/Marker/GLTFs/pearHalf.glb", "./components/objects/Marker/GLTFs/chinese.glb", "./components/objects/Marker/GLTFs/waffle.glb", "./components/objects/Marker/GLTFs/tomatoSlice.glb", "./components/objects/Marker/GLTFs/popsicleChocolate.glb", "./components/objects/Marker/GLTFs/mushroom.glb", "./components/objects/Marker/GLTFs/hotDog.glb", "./components/objects/Marker/GLTFs/loafRound.glb", "./components/objects/Marker/GLTFs/eggCup.glb", "./components/objects/Marker/GLTFs/cauliflower.glb", "./components/objects/Marker/GLTFs/cornDog.glb", "./components/objects/Marker/GLTFs/meatRaw.glb", "./components/objects/Marker/GLTFs/cookieChocolate.glb", "./components/objects/Marker/GLTFs/steamer.glb", "./components/objects/Marker/GLTFs/cake.glb", "./components/objects/Marker/GLTFs/skewerVegetables.glb", "./components/objects/Marker/GLTFs/baconRaw.glb", "./components/objects/Marker/GLTFs/cheeseCut.glb", "./components/objects/Marker/GLTFs/burgerDouble.glb", "./components/objects/Marker/GLTFs/bread.glb", "./components/objects/Marker/GLTFs/wholeHam.glb", "./components/objects/Marker/GLTFs/sushiEgg.glb", "./components/objects/Marker/GLTFs/popsicle.glb", "./components/objects/Marker/GLTFs/meatTenderizer.glb", "./components/objects/Marker/GLTFs/sub.glb", "./components/objects/Marker/GLTFs/pancakes.glb", "./components/objects/Marker/GLTFs/onionHalf.glb", "./components/objects/Marker/GLTFs/cupThea.glb", "./components/objects/Marker/GLTFs/donutChocolate.glb", "./components/objects/Marker/GLTFs/corn.glb", "./components/objects/Marker/GLTFs/cupTea.glb", "./components/objects/Marker/GLTFs/potStewLid.glb", "./components/objects/Marker/GLTFs/lemonHalf.glb", "./components/objects/Marker/GLTFs/frikandelSpeciaal.glb", "./components/objects/Marker/GLTFs/riceBall.glb", "./components/objects/Marker/GLTFs/carrot.glb", "./components/objects/Marker/GLTFs/coconut.glb", "./components/objects/Marker/GLTFs/beet.glb", "./components/objects/Marker/GLTFs/pudding.glb", "./components/objects/Marker/GLTFs/turkey.glb", "./components/objects/Marker/GLTFs/styrofoamDinner.glb", "./components/objects/Marker/GLTFs/mincemeatPie.glb", "./components/objects/Marker/GLTFs/eggHalf.glb", "./components/objects/Marker/GLTFs/honey.glb", "./components/objects/Marker/GLTFs/pineapple.glb", "./components/objects/Marker/GLTFs/appleHalf.glb", "./components/objects/Marker/GLTFs/cookie.glb", "./components/objects/Marker/GLTFs/coconutHalf.glb", "./components/objects/Marker/GLTFs/sausageHalf.glb", "./components/objects/Marker/GLTFs/onion.glb", "./components/objects/Marker/GLTFs/bowlBroth.glb", "./components/objects/Marker/GLTFs/bowlCereal.glb", "./components/objects/Marker/GLTFs/meatRibs.glb", "./components/objects/Marker/GLTFs/bowlSoup.glb", "./components/objects/Marker/GLTFs/croissant.glb", "./components/objects/Marker/GLTFs/cakeSlicer.glb", "./components/objects/Marker/GLTFs/tomato.glb"]
        let source = sourceList[Math.floor(Math.random() * sourceList.length)];
        let sourceChange = 'https://raw.githubusercontent.com/benchanjamin/COS426_Final_Project/main' + source.slice(1)
        loader.load(sourceChange, (gltf) => {
            //Create animation mixer and clips to run later
            //let sourceChange = source.slice(0, 2) + 'assets/' + source.slice(2)
            //let sourceChange =  'https://raw.githubusercontent.com/benchanjamin/COS426_Final_Project/main' + source.slice(1)
            // https://raw.githubusercontent.com/benchanjamin/COS426_Final_Project/main/components/objects/Marker/GLTFs/apple.glb
            console.log(sourceChange);
            marker.state.model = gltf;
            marker.state.mesh = gltf.scene;
            // marker.state.mixer = new THREE.AnimationMixer( gltf.scene );
            // marker.state.clips = marker.state.model.animations;

            this.add(gltf.scene);
            if (source === './components/objects/Marker/pizza.gltf') {
                this.scale.set(10, 10, 10);
            } else {
                this.scale.set(75, 75, 75);
            }
            gltf.scene.rotation.x = Math.PI / 2; // Rotations are in radians.
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

    update() {
        this.rotation.z -= 0.05;
    }
}

export default Marker;