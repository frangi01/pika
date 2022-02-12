import * as THREE from 'three';
import Stats from './imports/stats.module';
import { GUI } from './imports/lil-gui.module.min';
import { GLTFLoader } from './imports/GLTFLoader.js';

import * as MyFn from './imports/functions';
let container;
let camera;
let scene;
let clock;
let model;
let renderer;
let stats;
let mixer;
let animations;
let actions;
let previousAction, activeAction;
let face;
const states = [ 'Idle', 'Walking', 'Dance'];
const emotes = [ 'Jump'];

init();
animate();


function init() {

  container = document.createElement( 'div' );
	document.body.appendChild( container );
  
  container.addEventListener("dblclick", function () { fadeToAction( states[Math.floor(Math.random() * 2) + 1].toString(), 0.1 ); });
  container.addEventListener("click", function () { fadeToAction( 'Jump', 0.5 ); });
  
  camera = MyFn.camera();
  
  scene = MyFn.scene();
  
  clock = new THREE.Clock();

  // lights
  const hemiLight = MyFn.hemiL();
  scene.add( hemiLight );
  const dirLight = MyFn.dirL();
  scene.add( dirLight );

  // ground
  const mesh = MyFn.mesh();
  scene.add( mesh );
  const grid = MyFn.grid();
  scene.add( grid );

  // model
  const loader = new GLTFLoader();
  loader.load('pika.glb', function (gltf) {
    model = gltf.scene;
    scene.add( model );
    initAnimations(gltf.animations, model);
  }, undefined, function ( e ) {

    console.error( e );

  });

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( devicePixelRatio );
  renderer.setSize( innerWidth, innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild( renderer.domElement );

  addEventListener( 'resize', MyFn.onWindowResize(camera, renderer) );
  
  // stats
  stats = new Stats();
  //container.appendChild( stats.dom );

}



function animate() {
  const delta = clock.getDelta();
  if (mixer) { mixer.update( delta ); }
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  stats.update();
}


function initAnimations(animations, model) {
  // init animations
  mixer = new THREE.AnimationMixer( model );
  actions = {};

  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i];
    const action = mixer.clipAction( clip );
    actions[clip.name] = action;

    if (emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name) >= 4) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  }
  activeAction = actions[ 'Idle' ];
  activeAction.play();
}

function fadeToAction( name, duration ) {
  previousAction = activeAction;
  activeAction = actions[ name ];
  if ( previousAction !== activeAction ) {
    previousAction.fadeOut( duration );
  }
  
  activeAction
    .reset()
    .setEffectiveTimeScale( 1 )
    .setEffectiveWeight( 1 )
    .fadeIn( duration )
    .play();
  
  mixer.addEventListener('finished', () => {
    fadeToAction( 'Idle', 0.5 );
  });
  
}

