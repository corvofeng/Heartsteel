import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { useEffect, useRef, useState } from "react";
import { GLTF, DRACOLoader, GLTFLoader, RoomEnvironment, OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import 'react-circular-progressbar/dist/styles.css';

export interface HSAttr {
  width: number;
  height: number;
  scale: number;
  action: string;
  debugMode: boolean;
  modelPath: string;
  visible?: boolean; // 新增属性，用于控制显示和隐藏
}

function MyThree(props: HSAttr) {
  const refContainer = useRef(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: props.width, height: props.height });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) { // Mobile breakpoint
        setDimensions({
          width: props.width * 0.6, // Scale down for mobile
          height: props.height * 0.6,
        });
      } else {
        setDimensions({ width: props.width, height: props.height });
      }
    };

    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [props.width, props.height]);

  useEffect(() => {
    if (!props.visible) return; // 如果不可见，跳过初始化逻辑

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('jsm/libs/draco/');
    const gltfLoader = new GLTFLoader();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(dimensions.width, dimensions.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    let container: HTMLElement;
    if (refContainer.current) {
      container = refContainer.current as HTMLElement;
    } else {
      return;
    }

    async function fetchData() {
      const gltf = await gltfLoader.loadAsync(props.modelPath, onprogress = (event) => {
        const { loaded, total } = event;
        setProgressPercentage((loaded / total) * 100);
      });
      createModelView(container, renderer, gltf);
    }
    fetchData().catch(console.error);
    container.appendChild(renderer.domElement);

    return () => {
      for (let i = container.children.length - 1; i >= 0; i--) {
        container.removeChild(container.children[i]);
      }
    };
  }, [dimensions, props.visible]);

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

    return gui;
  };

  const createModelView = (container: HTMLElement, renderer: THREE.WebGLRenderer, gltf: GLTF) => {
    // === THREE.JS CODE START ===
    console.log("Add gltf scene");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, dimensions.width / dimensions.height, 0.1, 20);
    camera.position.set(0.1, 0.1, 1.25);

    const scale = props.scale;
    gltf.scene.scale.set(scale, scale, scale);

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
    if (props.action && actions.has(props.action)) {
      activeAction = actions.get(props.action) as THREE.AnimationAction;
      activeAction.play();
    }

    // For Debug animation
    let beforeAnimate = () => { }, afterAnimate = () => { };
    // In Debug Mode
    if (props.debugMode) {
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
      });
      const stats = new Stats();
      container.appendChild(stats.dom);
      beforeAnimate = () => {
        stats.begin();
      };
      afterAnimate = () => {
        stats.end();
      };
    }

    const animate = function () {
      beforeAnimate();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      mixer.update(clock.getDelta());
      afterAnimate();
    };
    animate();
  };

  if (!props.visible) {
    return null; // 如果不可见，直接返回 null
  }

  return (
    <div style={{
       width: dimensions.width, height: dimensions.height,
       position: "fixed",
       bottom: 0,
       left: 0, 
       zIndex: 2,
     }}>
      <div className="heart" ref={refContainer}></div>
      {progressPercentage < 99.9 && (
      <progress style={{
        position: "fixed",
        bottom: 0,
        left: 0,
      }}
       max="100" value={progressPercentage}>{progressPercentage}%</progress>
      )}
    </div>
  );
}

export {
  MyThree
}