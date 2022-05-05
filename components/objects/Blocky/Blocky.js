import {Group, MeshLambertMaterial, BoxGeometry, Mesh, SphereGeometry} from 'three';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter.js';
import gsap from "gsap";
import * as Dat from 'dat.gui';
import {IcosahedronGeometry, CylinderGeometry, ConeGeometry} from 'three';
import {MeshPhysicalMaterial, DodecahedronGeometry} from 'three';
import {MeshPhongMaterial} from 'three';
import * as THREE from "three";

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180)
}

const random = (min, max, float = false) => {
    const val = Math.random() * (max - min) + min;

    if (float) {
        return val;
    }

    return Math.floor(val);
}

// Material
//const material = new THREE.MeshLambertMaterial({ color: 0xffffff })

// Figure
class Blocky extends Group {
    constructor(parent, params) {
        super();
        // positioning coords and rotation
        this.params = {
            // x: -1.5,
            // y: 0,
            // z: 1.5,
            // ry: degreesToRadians(0),
            // x: -2.5,
            // y: 3,
            // z: -0.5,
            // ry: 0,
            // ...params
            // ...params.VIEW_PARAMS.center,
            // altitude: 0
            ...this.position
            // y: this.position.y,
            // z: this.position.z
        };

        this.name = 'blockFigure'

        // Init state
        this.state = {
            gui: new Dat.GUI(),
            pause: true,
            parent: parent,
            running: false,
            headMesh: null,
            bodyMesh: null,
            armMesh: [],
            legMesh: [],
            magicScale: 1000,
            //timeLine: null,
            settings: {
                // originalParams: JSON.parse(JSON.stringify(this.params)),
                animationType: 'Walk',
                lastAnimation: '',
                armType: 'cylindrical',
                armColor: 0,
                bodyType: 'blocky',
                bodyColor: 0,
                legType: 'blocky',
                legColor: 0,
                headType: 'icosahedron',
                headHue: random(0, 360),
                headColor: 0,
                bodyHue: random(0, 360),
                headLightness: random(40, 65),
            },
            materialOptions: {
                transmission: 1,
                thickness: 1.5,
                roughness: 0.67,
                envMapIntensity: 1.5,
                clearcoat: 1,
                clearcoatRoughness: 0.12
            },
            exportMeshNow: false
        };

        var gui = this.state.gui;

        var settings = this.state.settings;
        var options = this.state;

        // need to add the fields for each of the properties
        this.group = new Group();
        parent.add(this.group);


        // used within GUI calls
        var OG = this;

        gui.add(options, "exportMeshNow").onChange((value) => {
            options.exportMeshNow = value;
            if (options.exportMeshNow == true) {
                OG.export()
            }
        });

        gui.add(options, 'pause').onChange(function (value) {
           options.pause = value;
        });

        // gui.add(options, "materialOptions").onChange((value) => {
        //     options.materialOptions = value;
        //     if (options.exportMeshNow == true) {
        //         OG.export()
        //     }
        // });

        gui.add(settings, 'headType', ['blocky', 'cylindrical', 'spherical', 'icosahedron', 'conic', 'dodecahedron']).onChange(function (value) {
            // cleanUp loop, clear's scene on changes
            // upon re-render for change
            OG.state.parent.remove(OG.group);
            OG.arms = [];
            OG.legs = [];
            OG.state.settings.headType = value;

            OG.init()
            // after changes complete
            OG.state.parent.add(OG.group);
        });

        gui.addColor(settings, 'headColor').onChange(function (value) {
            // cleanUp loop, clear's scene on changes
            // upon re-render for change
            OG.state.parent.remove(OG.group);
            OG.arms = [];
            OG.legs = [];
            OG.state.settings.headColor = value;
            OG.headMaterial = new MeshLambertMaterial({color: value});

            OG.init()
            // after changes complete
            OG.state.parent.add(OG.group);
        });

        gui.add(settings, 'bodyType', ['blocky', 'cylindrical', 'spherical', 'icosahedron']).onChange(function (value) {
            // cleanUp loop, clear's scene on changes
            // upon re-render for change
            OG.state.parent.remove(OG.group);
            OG.arms = [];
            OG.legs = [];
            OG.state.settings.bodyType = value;

            OG.init()
            // after changes complete
            OG.state.parent.add(OG.group);
        });

        gui.addColor(settings, 'bodyColor').onChange(function (value) {
            // cleanUp loop, clear's scene on changes
            // upon re-render for change
            OG.state.parent.remove(OG.group);
            OG.arms = [];
            OG.legs = [];
            OG.bodyMaterial = new MeshLambertMaterial({color: value});

            OG.init()
            // after changes complete
            OG.state.parent.add(OG.group);
        });

        gui.add(settings, 'armType', ['blocky', 'cylindrical']).onChange(function (value) {
            // cleanUp loop, clear's scene on changes
            // upon re-render for change
            OG.state.parent.remove(OG.group);
            OG.arms = [];
            OG.legs = [];
            OG.state.settings.armType = value;

            OG.init()
            // after changes complete
            OG.state.parent.add(OG.group);
        });

        gui.addColor(settings, 'armColor').onChange(function (value) {
            // cleanUp loop, clear's scene on changes
            // upon re-render for change
            OG.state.parent.remove(OG.group);
            OG.arms = [];
            OG.legs = [];
            OG.armMaterial = new MeshLambertMaterial({color: value});

            OG.init()
            // after changes complete
            OG.state.parent.add(OG.group);
        });

        gui.add(settings, 'legType', ['blocky', 'cylindrical']).onChange(function (value) {
            // cleanUp loop, clear's scene on changes
            // upon re-render for change
            // OG.state.parent.remove(OG.group);
            OG.arms = [];
            OG.legs = [];
            OG.state.settings.legType = value;

            OG.init()
            // after changes complete
            OG.state.parent.add(OG.group);
        });

        gui.addColor(settings, 'legColor').onChange(function (value) {
            // cleanUp loop, clear's scene on changes
            // upon re-render for change
            // OG.state.parent.remove(OG.group);
            OG.arms = [];
            OG.legs = [];
            OG.legMaterial = new MeshLambertMaterial({color: value});

            OG.init()
            // after changes complete
            OG.state.parent.add(OG.group);
        });

        // Create group and add to scene
        this.group = new Group();
        parent.add(this.group);

        // Position according to params
        this.group.position.x = this.params.x;
        this.group.position.y = this.params.y;
        this.group.position.z = this.params.z;
        this.group.rotation.ry = this.params.ry
        // could make it bigger/smaller here
        // this.group.scale.set(5, 5, 5)

        // Material
        // this.headHue = random(0, 360);
        // this.bodyHue = random(0, 360);
        // this.headLightness = random(40, 65);
        this.headMaterial = new MeshPhongMaterial({color: `hsl(${settings.headHue}, 30%, ${settings.headLightness}%)`});
        this.armMaterial = new MeshLambertMaterial({color: `hsl(${settings.headHue}, 30%, ${settings.headLightness}%)`});
        this.bodyMaterial = new MeshLambertMaterial({color: `hsl(${settings.bodyHue}, 85%, 50%)`});
        this.arms = [];
        this.legs = [];
        params.addToUpdateList(this);
        this.init();
    }


    createBody() {
        if (this.state.headMesh != null) {
            this.group.remove(this.body);
            this.body.remove(this.state.bodyMesh);
        }
        this.body = new Group();
        var geometry = null;
        if (this.state.settings.bodyType == "spherical") {
            geometry = new IcosahedronGeometry(0.82, 2);
        } else if (this.state.settings.bodyType == "blocky") {
            geometry = new BoxGeometry(1, 1.5, 1);
        } else if (this.state.settings.bodyType == "cylindrical") {
            geometry = new CylinderGeometry(0.65, 0.65, 1.5);
        } else if (this.state.settings.bodyType == "icosahedron") {
            geometry = new IcosahedronGeometry(0.95, 0);
        } //else if (this.state.settings.bodyType == "torus"){
        //     geometry = new TorusGeometry(1, 0.3, 1.6, 10)
        // }
        const bodyMesh = new Mesh(geometry, this.bodyMaterial);
        this.state.bodyMesh = bodyMesh;
        this.body.add(this.state.bodyMesh);
        this.group.add(this.body);
        this.createLegs();
    }

    createHead() {
        // Create a new group for the head
        //console.log(this.head);
        if (this.state.headMesh != null) {
            this.group.remove(this.head);
            this.head.remove(this.state.headMesh);
        }
        this.head = new Group();
        var geometry = null;
        // Create the main cube of the head and add to the group
        // const geometry = new BoxGeometry(1.4, 1.4, 1.4);
        if (this.state.settings.headType == "spherical") {
            geometry = new IcosahedronGeometry(0.85, 2);
        } else if (this.state.settings.headType == "blocky") {
            geometry = new BoxGeometry(1.4, 1.4, 1.4);
        } else if (this.state.settings.headType == "cylindrical") {
            geometry = new CylinderGeometry(0.8, 0.8, 1.4);
        } else if (this.state.settings.headType == "icosahedron") {
            geometry = new IcosahedronGeometry(0.85);
        } else if (this.state.settings.headType == 'conic') {
            geometry = new ConeGeometry(0.85, 1.5);
        } else if (this.state.settings.headType == 'dodecahedron') {
            geometry = new DodecahedronGeometry(0.85);
        }

        this.state.headMesh = new Mesh(geometry, this.headMaterial);
        this.head.add(this.state.headMesh);
        // Add the head group to the figure
        this.group.add(this.head);
        // Position the head group
        this.head.position.y = 1.65;
        if (this.state.settings.headType == 'conic') {
            this.head.position.y += 0.2
        }
        // Add the eyes
        this.createEyes();
    }

    createArms() {
        if (this.state.armMesh.length > 0) {
            this.body.remove(this.state.armMesh[0]);
            this.body.remove(this.state.armMesh[1]);
            this.state.armMesh[0].remove(this.state.armMesh[0].children[0]);
            this.state.armMesh[1].remove(this.state.armMesh[1].children[0]);
            this.arms = [];
            this.state.armMesh = [];
        }
        const height = 0.85;
        for (let i = 0; i < 2; i++) {
            const armGroup = new Group();
            if (this.state.settings.armType == "blocky") {
                var geometry = new BoxGeometry(0.25, height, 0.25);
            } else if (this.state.settings.armType == "cylindrical") {
                var geometry = new CylinderGeometry(0.18, 0.18, height);
            }

            const arm = new Mesh(geometry, this.armMaterial);
            const m = i % 2 === 0 ? 1 : -1;
            // Add arm to group
            armGroup.add(arm);
            // Add group to figure
            this.body.add(armGroup);
            // Translate the arm by half the height
            arm.position.y = height * -0.5;
            // Position the arm relative to the figure
            armGroup.position.x = m * 0.8;
            armGroup.position.y = 0.6;
            // Rotate the arm
            armGroup.rotation.z = degreesToRadians(30 * m);
            // Push to the array
            this.arms.push(armGroup);
        }
        this.state.armMesh.push(this.arms[0]);
        this.state.armMesh.push(this.arms[1]);
    }

    createEyes() {
        const eyes = new Group();
        const geometry = new SphereGeometry(0.15, 12, 8);
        const material = new MeshLambertMaterial({color: 0x44445c});
        for (let i = 0; i < 2; i++) {
            const eye = new Mesh(geometry, material);
            const m = i % 2 === 0 ? 1 : -1;
            eyes.add(eye);
            eye.position.x = 0.36 * m;
        }
        this.head.add(eyes);
        eyes.position.y = 0.1;
        if (this.state.settings.headType == 'icosahedron') {
            eyes.position.z = 0.55;
        } else if (this.state.settings.headType == 'conic') {
            eyes.position.z = 0.35;
            eyes.position.y -= 0.3
        } else if (this.state.settings.headType == 'dodecahedron') {
            eyes.position.z = 0.55;
        } else {
            eyes.position.z = 0.7;
        }
    }

    createLegs() {
        // const legs = new Group();
        // const geometry = new BoxGeometry(0.25, 0.8, 0.25);
        if (this.state.legMesh.length > 0) {
            this.body.remove(this.state.legMesh[0]);
            this.body.remove(this.state.legMesh[1]);
            this.state.legMesh[0].remove(this.state.legMesh[0].children[0]);
            this.state.legMesh[1].remove(this.state.legMesh[1].children[0]);
            this.arms = [];
            this.state.legMesh = [];
        }
        for (let i = 0; i < 2; i++) {
            const legGroup = new Group();
            if (this.state.settings.legType == "blocky") {
                var geometry = new BoxGeometry(0.25, 0.8, 0.25);
            } else if (this.state.settings.legType == "cylindrical") {
                var geometry = new CylinderGeometry(0.18, 0.18, 0.8);
            }

            const leg = new Mesh(geometry, this.legMaterial);
            const m = i % 2 === 0 ? 1 : -1;
            legGroup.add(leg);
            this.body.add(legGroup);
            leg.position.x = m * 0.22;
            leg.position.y = -1.45;
            legGroup.rotation.x = 0;
            this.legs.push(legGroup);
        }
        this.state.legMesh.push(this.legs[0]);
        this.state.legMesh.push(this.legs[1]);
    }

    bounce() {
        // this.group.position.y = this.position.y;
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1
            arm.rotation.z = this.params.armRotation * m;
        });
        this.legs.forEach((leg, index) => {
            const m = index % 2 === 0 ? 1 : -1
            leg.rotation.z = this.params.legRotation * m;
        });
    };

    walk() {
        // this.group.position.y = this.params.y;
        this.legs.forEach((leg, index) => {
            const m = index % 2 === 0 ? 1 : -1
            leg.rotation.x = this.params.legRotation * m;
        });
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1
            arm.rotation.x = this.params.armRotation * m;
        });

    };

    run() {
        // this.group.position.y = this.params.y;
        this.legs.forEach((leg, index) => {
            const m = index % 2 === 0 ? 1 : -1
            leg.rotation.x = this.params.legRotation * m - 0.2;
        });
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1
            arm.rotation.x = this.params.armRotation * m - 0.2;
        });

    };

    dance() {
        this.legs.forEach((leg, index) => {
            const m = index % 2 === 0 ? 1 : 0
            leg.rotation.z = this.params.legRotation + degreesToRadians(60) * m;
        });
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : 2
            arm.rotation.z = this.params.armRotation + degreesToRadians(90) * m;
        });

    };

    animate() {
        if (!this.state.running) {
            this.state.running = true;

        } else {
            if (this.state.lastAnimation == this.state.animationType) {
                return;
            }
            // gsap.killTweensOf(this.params);
        }
        // if (this.timeLine) {
        //     this.timeLine.clear()
        //     //this.timeLine = null;
        // }
        // this.timeLine = gsap.timeline()
        console.log(this.state.settings.animationType)
        //Bounce
        if (this.state.settings.animationType == 'Bounce') {
            gsap.set(this.params, {
                y: 0,
                legRotation: degreesToRadians(0)
            });
            gsap.to(this.params, {
                ry: degreesToRadians(360),
                repeat: -1,
                duration: 20
            });
            gsap.to(this.params, {
                y: 3,
                armRotation: degreesToRadians(90),
                legRotation: degreesToRadians(30),
                repeat: -1,
                yoyo: true,
                duration: 0.5
            });
            // provided timestep advancing
            gsap.ticker.add(() => {
                this.bounce()
            });
        }
        //Walk
        if (this.state.settings.animationType == 'Walk') {
            this.arms.forEach((arm, index) => {
                const m = index % 2 === 0 ? 1 : -1
                arm.rotation.z = .1 * m;
            });
            gsap.set(this.params, {
                legRotation: degreesToRadians(-30),
                armRotation: degreesToRadians(20),
            });
            gsap.to(this.params, {
                repeat: -1,
                duration: 0.25,
                yoyo: true
            });
            gsap.to(this.params, {
                armRotation: degreesToRadians(-20),
                legRotation: degreesToRadians(30),
                repeat: -3,
                yoyoEase: 'none',
                duration: 0.5
            });
            // provided timestep advancing
            gsap.ticker.add(() => {
                this.walk()
            });
        }

        //Run
        if (this.state.settings.animationType == 'Run') {
            this.arms.forEach((arm, index) => {
                const m = index % 2 === 0 ? 1 : -1
                arm.rotation.z = .1 * m;
            });
            this.body.rotation.x += .2;
            this.head.position.z = .2;
            gsap.set(this.params, {
                y: .05,
                legRotation: degreesToRadians(-50),
                armRotation: degreesToRadians(-30),
            });
            gsap.to(this.params, {
                y: 0,
                repeat: -1,
                duration: 0.1,
                yoyoEase: 'power3'
            });
            gsap.to(this.params, {
                armRotation: degreesToRadians(30),
                legRotation: degreesToRadians(50),
                repeat: -3,
                yoyoEase: 'none',
                duration: 0.2
            });

            // provided timestep advancing
            gsap.ticker.add(() => {
                this.run()
            });
        }

        //Dance
        if (this.state.settings.animationType == 'Dance') {
            this.arms.forEach((arm, index) => {
                const m = index % 2 === 0 ? 1 : -1
                arm.rotation.z = .1 * m;
            });
            gsap.set(this.params, {
                y: 0,
                legRotation: degreesToRadians(0),
                armRotation: degreesToRadians(0),
            });
            gsap.to(this.params, {
                y: 1,
                repeat: -1,
                duration: .3,
                yoyo: true
            });
            gsap.to(this.params, {
                legRotation: degreesToRadians(-60),
                armRotation: degreesToRadians(90),
                repeat: -3,
                yoyoEase: 'none',
                duration: 0.6
            });

            // provided timestep advancing
            gsap.ticker.add(() => {
                this.dance()
            });
        }
        this.state.lastAnimation = this.state.animationType;
    }


    init() {
        this.createBody();
        this.createHead();

        this.createArms();
        // console.log(this);
        this.animate();
        //for exporting gltf file of mesh, can be enable
        // will likely integrate with gui for user-selected
        // mesh saving
        //this.export();
    }

    export() {
        const exporter = new GLTFExporter();

        function downloadJSON(json, filename) {
            saveString(JSON.stringify(json), filename);
        }

        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);

        function save(blob, filename) {
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }

        function saveString(text, filename) {
            save(new Blob([text], {type: 'text/plain'}), filename);
        }

        // Parse the input and generate the glTF output
        exporter.parse(
            this,
            // called when the gltf has been generated
            function (gltf) {
                //console.log( gltf );
                downloadJSON(gltf, 'blockFigure.gltf');
            },
        );
    }

    cleanUp() {
        this.parent.remove(this.group);
        this.state.gui.destroy();
    }

    update() {
        // console.log('update');
        // if (this.state.model != null){
        //     if (this.state.action == "Run"){
        //         this.state.mixer.update(.03);
        //     }else{this.state.mixer.update(.01)}
        //     var clip = THREE.AnimationClip.findByName( this.state.model, this.state.action );
        //     var action = this.state.mixer.clipAction( clip );
        //     action.play();
        // }
    }


}

export default Blocky;