import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

/**
 * Defines a three.js environment.
 */
export class World {
	container: HTMLDivElement;
	renderer: THREE.WebGLRenderer;
	camera: THREE.PerspectiveCamera;
	controls: OrbitControls;
	stats: Stats;
	scene: THREE.Scene;
	loader: GLTFLoader;
	base?: GLTF;
	yoke?: GLTF;
	head?: GLTF;

	constructor(container: HTMLDivElement) {
		this.container = container;
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
		this.container.appendChild(this.renderer.domElement);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.update();

		this.loader = new GLTFLoader();

		const sunlight = new THREE.DirectionalLight(0xffffff, 2);
		sunlight.position.set(0, 1, 1);
		this.scene.add(sunlight);
		const sunLight2 = new THREE.DirectionalLight(0xffffff, 2);
		sunLight2.position.set(0, 1, -1);
		this.scene.add(sunLight2);
		const sunLight3 = new THREE.DirectionalLight(0xffffff, 2);
		sunLight3.position.set(0, -1, 1);
		this.scene.add(sunLight3);
		const sunLight4 = new THREE.DirectionalLight(0xffffff, 2);
		sunLight4.position.set(0, -1, -1);
		this.scene.add(sunLight4);

		this.camera.position.set(0.25, 0.3, 0.43);
		this.camera.lookAt(0, 0, 0);

		this.stats = new Stats();
		this.container.appendChild(this.stats.dom);
	}

	render() {
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));

		this.render();
		this.stats.update();
	}
}
