import * as THREE from 'three';
import Stats from './stats.module';
import { GUI } from './lil-gui.module.min';
import { GLTFLoader } from './GLTFLoader.js';


export function camera() {
    let camera = new THREE.PerspectiveCamera( 35, innerWidth / innerHeight, 0.25, 100 );
    camera.position.set( 0, 1, 5 );
    camera.lookAt( new THREE.Vector3( 0, 1, 0 ) );
    return camera;
}

export function scene() {
    let scene = new THREE.Scene();
	scene.background = new THREE.Color( "rgb(26,26,26)" );
	scene.fog = new THREE.Fog( "rgb(26,26,26)", 4, 50 );
    return scene;
}

// lights

export function hemiL() {
    const hemiLight = new THREE.HemisphereLight( 0xffffff, "rgb(0,0,0)" );
	hemiLight.position.set( 0, 20, 0 );
    return hemiLight;
}
export function dirL() {
    const dirLight = new THREE.DirectionalLight( 0xffffff );
	dirLight.position.set( 0, 20, 10 );
    return dirLight;
}

// ground

export function mesh() {
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
    return mesh;
}

export function grid() {
    const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
    grid.material.opacity = 0;
    grid.material.transparent = true;
    return grid;
}

export function onWindowResize(camera, renderer) {
    camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
    renderer.setSize( innerWidth, innerHeight );
}

export function animations(animations, model) {
    // init animations
    const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
    const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

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
    return mixer;
}