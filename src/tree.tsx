import * as THREE from 'three';

import { useEffect, useRef, useState } from "react";
import { GLTF, DRACOLoader, GLTFLoader, RoomEnvironment, OrbitControls } from 'three/examples/jsm/Addons.js';

function MyThree(props: { width: number, height: number }) {
  const refContainer = useRef(null);
  const [_, setModelData] = useState<GLTF>();
  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('jsm/libs/draco/');
    const gltfLoader = new GLTFLoader();
    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(props.width, props.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    async function fetchData() {
      const gltf = await gltfLoader.loadAsync('models/arcanist-zoe.glb');
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
    var camera = new THREE.PerspectiveCamera( 50, props.width / props.height, 0.1, 20 );
    
    // var camera = new THREE.PerspectiveCamera(70, props.width/props.height, 0.1, 1000);


    camera.position.set( 0, 0.3, 1.25 );
    // camera.updateProjectionMatrix();

    // gltf.scene.scale.set( 0.008, 0.008, 0.008 );
    gltf.scene.scale.set( 0.004, 0.004, 0.004 );

    // gltf.scene.scale.multiplyScalar(1 / 100); // adjust scalar factor to match your scene scale
    // gltf.scene.position.x = 20; // once rescaled, position the model where needed
    // gltf.scene.position.z = -20;

    // use ref as a mount point of the Three.js scene instead of the document.body
    // var geometry = new THREE.BoxGeometry(1, 1, 1);
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // var cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    // function onWindowResize() {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize( window.innerWidth, window.innerHeight );
    // }
    // window.addEventListener( 'resize', onWindowResize );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.target.set( 0, 0.35, 0 );
    controls.update();

    const animations = gltf.animations;
    const clock = new THREE.Clock();

    const mixer = new THREE.AnimationMixer( gltf.scene );
    let act = mixer.clipAction( animations[ 3 ] )
    act.play()


    scene.add(gltf.scene);

    const environment = new RoomEnvironment( renderer );
		const pmremGenerator = new THREE.PMREMGenerator( renderer );
    scene.background = new THREE.Color( 0xbbbbbb );
		scene.environment = pmremGenerator.fromScene( environment ).texture;

    // camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      mixer.update(clock.getDelta());
    };
    animate();
    // renderer.render(scene, camera);
  }

  // if (model === undefined) {
  //   return <div>Loading...</div>;
  // } else {
    return (
      <div ref={refContainer}></div>
    );
  // }
}

export default MyThree