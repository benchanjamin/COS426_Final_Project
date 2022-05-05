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
        const sourceList = ['./components/objects/Marker/pizza.gltf', "./components/objects/Marker/GLTF format//plateDeep.glb", "./components/objects/Marker/GLTF format//frappe.glb", "./components/objects/Marker/GLTF format//grapes.glb", "./components/objects/Marker/GLTF format//apple.glb", "./components/objects/Marker/GLTF format//pot.glb", "./components/objects/Marker/GLTF format//fishBones.glb", "./components/objects/Marker/GLTF format//cookingSpatula.glb", "./components/objects/Marker/GLTF format//fries.glb", "./components/objects/Marker/GLTF format//cherries.glb", "./components/objects/Marker/GLTF format//utensilFork.glb", "./components/objects/Marker/GLTF format//iceCreamScoopMint.glb", "./components/objects/Marker/GLTF format//orange.glb", "./components/objects/Marker/GLTF format//potStew.glb", "./components/objects/Marker/GLTF format//pepper.glb", "./components/objects/Marker/GLTF format//watermelon.glb", "./components/objects/Marker/GLTF format//cheese.glb", "./components/objects/Marker/GLTF format//cup.glb", "./components/objects/Marker/GLTF format//iceCreamCone.glb", "./components/objects/Marker/GLTF format//donutSprinkles.glb", "./components/objects/Marker/GLTF format//carton.glb", "./components/objects/Marker/GLTF format//knifeBlock.glb", "./components/objects/Marker/GLTF format//makiRoe.glb", "./components/objects/Marker/GLTF format//dimSum.glb", "./components/objects/Marker/GLTF format//muffin.glb", "./components/objects/Marker/GLTF format//cookingFork.glb", "./components/objects/Marker/GLTF format//pan.glb", "./components/objects/Marker/GLTF format//mortarPestle.glb", "./components/objects/Marker/GLTF format//candyBar.glb", "./components/objects/Marker/GLTF format//avocado.glb", "./components/objects/Marker/GLTF format//pear.glb", "./components/objects/Marker/GLTF format//pepperMill.glb", "./components/objects/Marker/GLTF format//sausage.glb", "./components/objects/Marker/GLTF format//gingerBreadCutter.glb", "./components/objects/Marker/GLTF format//cookingSpoon.glb", "./components/objects/Marker/GLTF format//meatPatty.glb", "./components/objects/Marker/GLTF format//styrofoam.glb", "./components/objects/Marker/GLTF format//salad.glb", "./components/objects/Marker/GLTF format//iceCream.glb", "./components/objects/Marker/GLTF format//leek.glb", "./components/objects/Marker/GLTF format//burgerCheese.glb", "./components/objects/Marker/GLTF format//meatSausage.glb", "./components/objects/Marker/GLTF format//meatCooked.glb", "./components/objects/Marker/GLTF format//sundae.glb", "./components/objects/Marker/GLTF format//wholerHam.glb", "./components/objects/Marker/GLTF format//cakeBirthday.glb", "./components/objects/Marker/GLTF format//gingerBread.glb", "./components/objects/Marker/GLTF format//pizza.glb", "./components/objects/Marker/GLTF format//bacon.glb", "./components/objects/Marker/GLTF format//hotDogRaw.glb", "./components/objects/Marker/GLTF format//celeryStick.glb", "./components/objects/Marker/GLTF format//banana.glb", "./components/objects/Marker/GLTF format//lemon.glb", "./components/objects/Marker/GLTF format//pumpkinBasic.glb", "./components/objects/Marker/GLTF format//bottleMusterd.glb", "./components/objects/Marker/GLTF format//makiSalmon.glb", "./components/objects/Marker/GLTF format//potLid.glb", "./components/objects/Marker/GLTF format//tajine.glb", "./components/objects/Marker/GLTF format//wineWhite.glb", "./components/objects/Marker/GLTF format//bagFlat.glb", "./components/objects/Marker/GLTF format//tajineLid.glb", "./components/objects/Marker/GLTF format//iceCreamScoop.glb", "./components/objects/Marker/GLTF format//mushroomHalf.glb", "./components/objects/Marker/GLTF format//makiVegetable.glb", "./components/objects/Marker/GLTF format//glass.glb", "./components/objects/Marker/GLTF format//plate.glb", "./components/objects/Marker/GLTF format//cuttingBoardRound.glb", "./components/objects/Marker/GLTF format//mortar.glb", "./components/objects/Marker/GLTF format//egg.glb", "./components/objects/Marker/GLTF format//musselOpen.glb", "./components/objects/Marker/GLTF format//strawberry.glb", "./components/objects/Marker/GLTF format//cabbage.glb", "./components/objects/Marker/GLTF format//sandwich.glb", "./components/objects/Marker/GLTF format//mussel.glb", "./components/objects/Marker/GLTF format//eggplant.glb", "./components/objects/Marker/GLTF format//chocolate.glb", "./components/objects/Marker/GLTF format//lollypop.glb", "./components/objects/Marker/GLTF format//sushiSalmon.glb", "./components/objects/Marker/GLTF format//candyBarWrapper.glb", "./components/objects/Marker/GLTF format//barrel.glb", "./components/objects/Marker/GLTF format//radish.glb", "./components/objects/Marker/GLTF format//taco.glb", "./components/objects/Marker/GLTF format//plateSauerkraut.glb", "./components/objects/Marker/GLTF format//donut.glb", "./components/objects/Marker/GLTF format//pumpkin.glb", "./components/objects/Marker/GLTF format//cupcake.glb", "./components/objects/Marker/GLTF format//utensilSpoon.glb", "./components/objects/Marker/GLTF format//eggCooked.glb", "./components/objects/Marker/GLTF format//paprika.glb", "./components/objects/Marker/GLTF format//shakerPepper.glb", "./components/objects/Marker/GLTF format//chopstickFancy.glb", "./components/objects/Marker/GLTF format//whippedCream.glb", "./components/objects/Marker/GLTF format//peanutButter.glb", "./components/objects/Marker/GLTF format//broccoli.glb", "./components/objects/Marker/GLTF format//burgerCheeseDouble.glb", "./components/objects/Marker/GLTF format//sodaBottle.glb", "./components/objects/Marker/GLTF format//pie.glb", "./components/objects/Marker/GLTF format//burger.glb", "./components/objects/Marker/GLTF format//bag.glb", "./components/objects/Marker/GLTF format//panStew.glb", "./components/objects/Marker/GLTF format//plateBroken.glb", "./components/objects/Marker/GLTF format//fish.glb", "./components/objects/Marker/GLTF format//avocadoHalf.glb", "./components/objects/Marker/GLTF format//loafBaguette.glb", "./components/objects/Marker/GLTF format//bottleKetchup.glb", "./components/objects/Marker/GLTF format//loaf.glb", "./components/objects/Marker/GLTF format//pearHalf.glb", "./components/objects/Marker/GLTF format//sodaGlass.glb", "./components/objects/Marker/GLTF format//chinese.glb", "./components/objects/Marker/GLTF format//waffle.glb", "./components/objects/Marker/GLTF format//tomatoSlice.glb", "./components/objects/Marker/GLTF format//popsicleChocolate.glb", "./components/objects/Marker/GLTF format//mushroom.glb", "./components/objects/Marker/GLTF format//shakerSalt.glb", "./components/objects/Marker/GLTF format//iceCreamCup.glb", "./components/objects/Marker/GLTF format//friesEmpty.glb", "./components/objects/Marker/GLTF format//hotDog.glb", "./components/objects/Marker/GLTF format//pizzaBox.glb", "./components/objects/Marker/GLTF format//loafRound.glb", "./components/objects/Marker/GLTF format//pizzaCutter.glb", "./components/objects/Marker/GLTF format//eggCup.glb", "./components/objects/Marker/GLTF format//cartonSmall.glb", "./components/objects/Marker/GLTF format//cauliflower.glb", "./components/objects/Marker/GLTF format//cupSaucer.glb", "./components/objects/Marker/GLTF format//cornDog.glb", "./components/objects/Marker/GLTF format//wineRed.glb", "./components/objects/Marker/GLTF format//meatRaw.glb", "./components/objects/Marker/GLTF format//cookieChocolate.glb", "./components/objects/Marker/GLTF format//steamer.glb", "./components/objects/Marker/GLTF format//cake.glb", "./components/objects/Marker/GLTF format//bowl.glb", "./components/objects/Marker/GLTF format//skewerVegetables.glb", "./components/objects/Marker/GLTF format//baconRaw.glb", "./components/objects/Marker/GLTF format//cheeseCut.glb", "./components/objects/Marker/GLTF format//burgerDouble.glb", "./components/objects/Marker/GLTF format//bread.glb", "./components/objects/Marker/GLTF format//wholeHam.glb", "./components/objects/Marker/GLTF format//chocolateWrapper.glb", "./components/objects/Marker/GLTF format//sushiEgg.glb", "./components/objects/Marker/GLTF format//popsicle.glb", "./components/objects/Marker/GLTF format//popsicleStick.glb", "./components/objects/Marker/GLTF format//sodaCanCrushed.glb", "./components/objects/Marker/GLTF format//meatTenderizer.glb", "./components/objects/Marker/GLTF format//cocktail.glb", "./components/objects/Marker/GLTF format//utensilKnife.glb", "./components/objects/Marker/GLTF format//sub.glb", "./components/objects/Marker/GLTF format//pancakes.glb", "./components/objects/Marker/GLTF format//onionHalf.glb", "./components/objects/Marker/GLTF format//cupThea.glb", "./components/objects/Marker/GLTF format//plateDinner.glb", "./components/objects/Marker/GLTF format//soy.glb", "./components/objects/Marker/GLTF format//donutChocolate.glb", "./components/objects/Marker/GLTF format//cheeseSlicer.glb", "./components/objects/Marker/GLTF format//corn.glb", "./components/objects/Marker/GLTF format//cupTea.glb", "./components/objects/Marker/GLTF format//potStewLid.glb", "./components/objects/Marker/GLTF format//lemonHalf.glb", "./components/objects/Marker/GLTF format//frikandelSpeciaal.glb", "./components/objects/Marker/GLTF format//riceBall.glb", "./components/objects/Marker/GLTF format//carrot.glb", "./components/objects/Marker/GLTF format//cookingKnifeChopping.glb", "./components/objects/Marker/GLTF format//soda.glb", "./components/objects/Marker/GLTF format//coconut.glb", "./components/objects/Marker/GLTF format//beet.glb", "./components/objects/Marker/GLTF format//plateRectangle.glb", "./components/objects/Marker/GLTF format//fryingPanLid.glb", "./components/objects/Marker/GLTF format//rollingPin.glb", "./components/objects/Marker/GLTF format//glassWine.glb", "./components/objects/Marker/GLTF format//pudding.glb", "./components/objects/Marker/GLTF format//cuttingBoard.glb", "./components/objects/Marker/GLTF format//turkey.glb", "./components/objects/Marker/GLTF format//styrofoamDinner.glb", "./components/objects/Marker/GLTF format//mincemeatPie.glb", "./components/objects/Marker/GLTF format//skewer.glb", "./components/objects/Marker/GLTF format//eggHalf.glb", "./components/objects/Marker/GLTF format//honey.glb", "./components/objects/Marker/GLTF format//chopstick.glb", "./components/objects/Marker/GLTF format//pineapple.glb", "./components/objects/Marker/GLTF format//appleHalf.glb", "./components/objects/Marker/GLTF format//cookie.glb", "./components/objects/Marker/GLTF format//can.glb", "./components/objects/Marker/GLTF format//whisk.glb", "./components/objects/Marker/GLTF format//canOpen.glb", "./components/objects/Marker/GLTF format//sodaCan.glb", "./components/objects/Marker/GLTF format//fryingPan.glb", "./components/objects/Marker/GLTF format//coconutHalf.glb", "./components/objects/Marker/GLTF format//paprikaSlice.glb", "./components/objects/Marker/GLTF format//canSmall.glb", "./components/objects/Marker/GLTF format//cuttingBoardJapanese.glb", "./components/objects/Marker/GLTF format//sausageHalf.glb", "./components/objects/Marker/GLTF format//cookingKnife.glb", "./components/objects/Marker/GLTF format//bottleOil.glb", "./components/objects/Marker/GLTF format//onion.glb", "./components/objects/Marker/GLTF format//bowlBroth.glb", "./components/objects/Marker/GLTF format//mug.glb", "./components/objects/Marker/GLTF format//bowlCereal.glb", "./components/objects/Marker/GLTF format//meatRibs.glb", "./components/objects/Marker/GLTF format//bowlSoup.glb", "./components/objects/Marker/GLTF format//croissant.glb", "./components/objects/Marker/GLTF format//cakeSlicer.glb", "./components/objects/Marker/GLTF format//tomato.glb"]
        let source = sourceList[Math.floor(Math.random() * sourceList.length)];
        loader.load(source, (gltf) => {
            //Create animation mixer and clips to run later
            let sourceChange = source.slice(0, 2) + 'assets/' + source.slice(2)
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