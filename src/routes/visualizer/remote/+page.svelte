<script lang="ts">
	import PositionController from './PositionController.svelte';
	import { onMount } from 'svelte';

	import { io } from 'socket.io-client';
	const socket = io();

	let status = 'Disconnected';
	let transport = 'N/A';

	onMount(() => {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);

		window.addEventListener('resize', () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		});

		socket.on('eventFromServer', (message) => {
			console.log(message);
		});

		socket.on('connect', () => {
			console.log(`connected with transport ${socket.io.engine.transport.name}`);

			status = 'Connected';
			transport = socket.io.engine.transport.name;

			socket.io.engine.on('upgrade', (tp) => {
				console.log(`transport upgraded to ${tp.name}`);

				transport = tp.name;
			});
		});

		socket.on('connect_error', (err) => {
			console.log(`connect_error due to ${err.message}`);
		});

		socket.on('disconnect', (reason) => {
			console.log(`disconnect due to ${reason}`);

			status = 'Disconnected';
			transport = 'N/A';
		});
	});
</script>

<p>Status: <span id="status">{status}</span></p>
<p>Transport: <span id="transport">{transport}</span></p>

<PositionController {socket} />

<style>
	:global(body),
	:global(html) {
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
	}
</style>
