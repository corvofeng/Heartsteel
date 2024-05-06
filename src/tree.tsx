import * as THREE from 'three';

import { useEffect, useRef, useState } from "react";
import { GLTF, DRACOLoader, GLTFLoader, RoomEnvironment, OrbitControls } from 'three/examples/jsm/Addons.js';

function isDebug() {
  return process.env.NODE_ENV === 'development';
}

function MyThree(props: { width: number, height: number }) {
  const refContainer = useRef(null);
  const [_, setModelData] = useState<GLTF>();
  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('jsm/libs/draco/');
    const gltfLoader = new GLTFLoader();
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(props.width, props.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    async function fetchData() {
      const gltf = await gltfLoader.loadAsync('https://model.rawforcorvofeng.cn/arcanist-zoe.glb');
      setModelData(gltf);
      console.log("Set Model gltf", gltf);
      createModelView(renderer, gltf);
    }
    fetchData().catch(console.error);

    refContainer.current && (refContainer.current as HTMLElement).appendChild(renderer.domElement);
  }, []);

  const createModelView = (renderer: THREE.WebGLRenderer, gltf: GLTF) => {
    // === THREE.JS CODE START ===
    console.log("Add gltf scene")
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, props.width / props.height, 0.1, 20);
    camera.position.set(0.1, 0.4, 1.25);
    // camera.updateProjectionMatrix();

    // gltf.scene.scale.set( 0.008, 0.008, 0.008 );
    const scale = 0.005
    gltf.scene.scale.set(scale, scale, scale);

    // function onWindowResize() {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize( window.innerWidth, window.innerHeight );
    // }
    // window.addEventListener( 'resize', onWindowResize );

    const animations = gltf.animations;
    const clock = new THREE.Clock();
    const mixer = new THREE.AnimationMixer(gltf.scene);

    let act = mixer.clipAction(animations[3])
    act.play()

    scene.add(gltf.scene);

    // In Debug Mode
    if (isDebug()) {
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
    }

    var animate = function () {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      mixer.update(clock.getDelta());
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