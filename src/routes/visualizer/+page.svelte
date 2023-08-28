<script lang="ts">
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';

	import { World } from '../../modules/World';

	import JSZip from 'jszip';
	import type { IPosition } from '../../interfaces/IPosition.js';
	import { getFirstFileAsArrayBuffer, map } from '$lib/helpers';
	import * as gdtfHelpers from '$lib/gdtfHelpers';
	import { XMLParser } from 'fast-xml-parser';
	import type { document as GDTFDocument } from 'gdtf-types';
	const zip = new JSZip();

	export let data;

	let threeContainer: HTMLDivElement;

	onMount(async () => {
		let gltf = await zip.loadAsync(data.streamed.base64, { base64: true });

		const world = new World(threeContainer);
		const descriptionXML = await gltf.file('description.xml')?.async('string');
		if (!descriptionXML) throw new Error('No description.xml found in GDTF file');
		const description = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: '',
			isArray: (tagName: string) => ['Geometry', 'Axis'].includes(tagName)
		}).parse(descriptionXML) as GDTFDocument;

		let base = await getFirstFileAsArrayBuffer(gltf, 'base', '.glb');
		let yoke = await getFirstFileAsArrayBuffer(gltf, 'yoke', '.glb');
		let head = await getFirstFileAsArrayBuffer(gltf, 'head', '.glb');
		let lens = await getFirstFileAsArrayBuffer(gltf, 'lens', '.glb');

		const Geometry = description.GDTF.FixtureType.Geometries.Geometry?.[0];
		if (!Geometry) throw new Error('No Geometry found in description.xml');

		if (base)
			world.loader.parse(base, '', (gltf) => {
				world.base = gltf;
				const { Position } = Geometry;
				if (!Position) throw new Error('No Base Position found in description.xml');
				world.base.scene.position.setFromMatrixPosition(
					gdtfHelpers.parseMatrix4(Position).premultiply(gdtfHelpers.cobMatrix)
				);
				world.base.scene.position.y += 0.3;
				world.scene.add(world.base.scene);
			});

		if (yoke)
			world.loader.parse(yoke, '', (gltf) => {
				world.yoke = gltf;
				if (!Geometry.Axis?.[0].Position)
					throw new Error('No Yoke Position found in description.xml');
				world.yoke.scene.position.setFromMatrixPosition(
					gdtfHelpers.parseMatrix4(Geometry.Axis[0].Position).premultiply(gdtfHelpers.cobMatrix)
				);
				world.base?.scene.add(world.yoke.scene);
			});

		if (head)
			world.loader.parse(head, '', (gltf) => {
				world.head = gltf;
				if (!Geometry.Axis?.[0].Axis?.[0].Position)
					throw new Error('No Head Position found in description.xml');
				world.head.scene.position.setFromMatrixPosition(
					gdtfHelpers
						.parseMatrix4(Geometry.Axis[0].Axis[0].Position)
						.premultiply(gdtfHelpers.cobMatrix)
				);
				world.yoke?.scene.add(world.head.scene);
			});

		if (lens) {
			const pixels = Geometry.Axis?.[0].Axis?.[0].Geometry?.[0].Geometry?.[0].GeometryReference;
			if (!pixels) throw new Error('No GeometryReference for Pixels found in description.xml');
			for (const pixel of pixels) {
				world.loader.parse(lens, '', (gltf) => {
					if (!pixel.Position) throw new Error('No Pixel Position found in description.xml');
					gltf.scene.position.setFromMatrixPosition(
						gdtfHelpers.parseMatrix4(pixel.Position).premultiply(gdtfHelpers.cobMatrix)
					);
					world.head?.scene.add(gltf.scene);
				});
			}
		}

		world.animate();

		const socket = io();

		socket.on('connect', () => {
			console.log(`connected with transport ${socket.io.engine.transport.name}`);

			socket.io.engine.on('upgrade', (tp) => {
				console.log(`transport upgraded to ${tp.name}`);
			});
		});

		socket.on('eventFromServer', (message) => {
			console.log(message);
		});

		socket.on('position', (position: IPosition) => {
			if (world.yoke && world.head) {
				world.yoke.scene.rotation.y = THREE.MathUtils.degToRad(map(position.x, 0, 1, 270, -270));
				world.head.scene.rotation.x = THREE.MathUtils.degToRad(map(position.y, 0, 1, 135, -135));
			}
		});
	});
</script>

<div bind:this={threeContainer} />

<svelte:head>
	<title>My first three.js app</title>
</svelte:head>
