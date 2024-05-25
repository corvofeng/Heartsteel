import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { useEffect, useRef, useState } from "react";
import { GLTF, DRACOLoader, GLTFLoader, RoomEnvironment, OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { isDebug } from './utils/debug.tsx';


function MyThree(props: { width: number, height: number, hsAction: string }) {
  const [_, setModelData] = useState<GLTF>();
  let refContainer = useRef(null);
  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('jsm/libs/draco/');
    const gltfLoader = new GLTFLoader();
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(props.width, props.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    let container: HTMLElement
    if (refContainer.current) {
      container = refContainer.current as HTMLElement;
    } else {
      return
    }

    async function fetchData() {
      const gltf = await gltfLoader.loadAsync('https://model.rawforcorvofeng.cn/arcanist-zoe.glb');
      setModelData(gltf);
      console.log("Set Model gltf", gltf);
      createModelView(container, renderer, gltf);
    }
    fetchData().catch(console.error);
    container.appendChild(renderer.domElement);

    return () => {
      for (let i = container.children.length - 1; i >= 0; i--) {
        container.removeChild(container.children[i]);
      }
    }
  }, []);

  const createGUI = (actions: Map<string, THREE.AnimationAction>, activeAction: THREE.AnimationAction) => {
    const gui = new GUI({ width: 280 });
    const states: string[] = [];

    actions.forEach((_, key) => {
      states.push(key);
    });
    const api = { state: activeAction.getClip().name };
    const statesFolder = gui.addFolder('States');
    const clipCtrl = statesFolder.add(api, 'state').options(states);

    let previousAction: THREE.AnimationAction;

    clipCtrl.onChange(function () {
      fadeToAction(api.state, 0.5);
    });

    function fadeToAction(name: string, duration: number) {
      previousAction = activeAction;
      activeAction = actions.get(name) as THREE.AnimationAction;

      if (previousAction !== activeAction) {
        previousAction.fadeOut(duration);
      }
      activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();
    }


    // const params = {
    //   edgeStrength: 3.0,
    //   edgeGlow: 0.0,
    //   edgeThickness: 1.0,
    //   pulsePeriod: 0,
    //   rotate: false,
    //   usePatternTexture: false
    // };

    // gui.add(params, 'edgeStrength', 0.01, 10).onChange(function (value) {
    // });
    // gui.add(params, 'edgeGlow', 0.0, 1).onChange(function (value) {
    // });

    return gui
  }

  const createModelView = (container: HTMLElement, renderer: THREE.WebGLRenderer, gltf: GLTF) => {
    // === THREE.JS CODE START ===
    console.log("Add gltf scene")
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, props.width / props.height, 0.1, 20);
    camera.position.set(0.1, 0.1, 1.25);
    // camera.updateProjectionMatrix();

    // gltf.scene.scale.set( 0.008, 0.008, 0.008 );
    const scale = 0.0035
    gltf.scene.scale.set(scale, scale, scale);

    // function onWindowResize() {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize( window.innerWidth, window.innerHeight );
    // }
    // window.addEventListener( 'resize', onWindowResize );

    const actions = new Map<string, THREE.AnimationAction>();
    const animations = gltf.animations;
    const clock = new THREE.Clock();
    const mixer = new THREE.AnimationMixer(gltf.scene);
    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      actions.set(animation.name, mixer.clipAction(animation));
    }
    scene.add(gltf.scene);

    let activeAction: THREE.AnimationAction = actions.values().next().value as THREE.AnimationAction;
    if (props.hsAction && actions.has(props.hsAction)) {
      activeAction = actions.get(props.hsAction) as THREE.AnimationAction;
      activeAction.play();
    }

    // For Debug animation
    let beforeAnimate = () => { }, afterAnimate = () => { };
    // In Debug Mode
    if (isDebug()) {
      createGUI(actions, activeAction);
      const environment = new RoomEnvironment(renderer);
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(environment).texture;
      scene.background = new THREE.Color(0xbbbbbb);

      const controls = new OrbitControls(camera, renderer.domElement);
      console.log(controls.object.position);
      controls.enableDamping = true;
      controls.minDistance = 1;
      controls.maxDistance = 10;
      controls.target.set(0, 0.35, 0);
      controls.update();
      controls.addEventListener("change", () => {
        console.log(controls.object.position);
      })
      const stats = new Stats();
      container.appendChild(stats.dom);
      beforeAnimate = () => {
        stats.begin();
      }
      afterAnimate = () => {
        stats.end();
      }
    }

    var animate = function () {
      beforeAnimate();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      mixer.update(clock.getDelta());
      afterAnimate();
    };
    animate();
  }

  // if (model === undefined) {
  //   return <div>Loading...</div>;
  // } else {
  return (
    <div className="heart" ref={refContainer}></div>
  );
  // }
}

export default MyThree