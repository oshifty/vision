<script lang="ts">
	import './global.css';

	import * as THREE from 'three';
	import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import Stats from 'three/examples/jsm/libs/stats.module';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';

	import JSZip from 'jszip';
	import type { IPosition } from '../../interfaces/IPosition.js';
	import { map } from '$lib/helpers.js';
	const zip = new JSZip();

	export let data;

	const socket = io();

	class World {
		renderer: THREE.WebGLRenderer;
		camera: THREE.PerspectiveCamera;
		controls: OrbitControls;
		stats: Stats;
		scene: THREE.Scene;
		loader: GLTFLoader;
		base?: GLTF;
		yoke?: GLTF;
		head?: GLTF;

		constructor() {
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera(
				75,
				window.innerWidth / window.innerHeight,
				0.1,
				1000
			);

			const skybox = new THREE.SphereGeometry(500, 60, 40);
			// invert the geometry on the x-axis so that all of the faces point inward
			skybox.scale(-1, 1, 1);

			const texture = new THREE.TextureLoader().load(
				'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/school_hall.jpg'
			);
			texture.colorSpace = THREE.SRGBColorSpace;
			const skymat = new THREE.MeshBasicMaterial({ map: texture });

			const mesh = new THREE.Mesh(skybox, skymat);

			this.scene.add(mesh);

			this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(this.renderer.domElement);

			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.update();

			this.loader = new GLTFLoader();

			let sunlight = new THREE.DirectionalLight(0xffffff, 2);
			sunlight.position.set(0, 1, 1);
			this.scene.add(sunlight);
			let sunLight2 = new THREE.DirectionalLight(0xffffff, 2);
			sunLight2.position.set(0, 1, -1);
			this.scene.add(sunLight2);
			let sunLight3 = new THREE.DirectionalLight(0xffffff, 2);
			sunLight3.position.set(0, -1, 1);
			this.scene.add(sunLight3);
			let sunLight4 = new THREE.DirectionalLight(0xffffff, 2);
			sunLight4.position.set(0, -1, -1);
			this.scene.add(sunLight4);

			this.camera.position.set(0.25, 0.3, 0.43);
			this.camera.lookAt(0, 0, 0);

			this.stats = new Stats();
			document.body.appendChild(this.stats.dom);
		}

		async init() {
			if (!(this.base && this.yoke && this.head)) return;

			this.base.scene.position.set(0, 0.3, 0);
			this.yoke.scene.position.set(0, -0.087162, 0);
			this.head.scene.position.set(0, -0.284, 0);

			this.scene.add(this.base.scene);
			this.base.scene.add(this.yoke.scene);
			this.yoke.scene.add(this.head.scene);
		}

		render() {
			this.renderer.clear();
			this.renderer.render(this.scene, this.camera);
		}

		animate() {
			requestAnimationFrame(this.animate.bind(this));

			// if (this.yoke && this.head) {
			// this.yoke.scene.rotation.y += 0.005;
			// this.head.scene.rotation.x += 0.015;
			// }

			this.render();
			this.stats.update();
		}
	}

	onMount(async () => {
		let gltf = await zip.loadAsync(data.streamed.base64, { base64: true });

		const world = new World();

		let base = await gltf.file('models/gltf/base.glb')?.async('arraybuffer');
		let yoke = await gltf.file('models/gltf/yoke.glb')?.async('arraybuffer');
		let head = await gltf.file('models/gltf/head.glb')?.async('arraybuffer');

		if (base)
			world.loader.parse(base, '', (gltf) => {
				world.base = gltf;
				world.base.scene.position.set(0, 0.3, 0);
				world.scene.add(world.base.scene);
			});

		if (yoke)
			world.loader.parse(yoke, '', (gltf) => {
				world.yoke = gltf;
				world.yoke.scene.position.set(0, -0.087162, 0);
				world.base?.scene.add(world.yoke.scene);
			});

		if (head)
			world.loader.parse(head, '', (gltf) => {
				world.head = gltf;
				world.head.scene.position.set(0, -0.284, 0);
				world.yoke?.scene.add(world.head.scene);
			});

		await world.init();
		world.animate();

		socket.on('eventFromServer', (message) => {
			console.log(message);
		});

		socket.on('position', (position: IPosition) => {
			if (world.yoke && world.head) {
				world.yoke.scene.rotation.y = THREE.MathUtils.degToRad(map(position.x, 0, 1, 270, -270));
				world.head.scene.rotation.x = THREE.MathUtils.degToRad(map(position.y, 0, 1, 135, -135));
			}
		});

		socket.on('connect', () => {
			console.log(`connected with transport ${socket.io.engine.transport.name}`);

			socket.io.engine.on('upgrade', (tp) => {
				console.log(`transport upgraded to ${tp.name}`);
			});
		});
	});
</script>

<svelte:head>
	<title>My first three.js app</title>
</svelte:head>
