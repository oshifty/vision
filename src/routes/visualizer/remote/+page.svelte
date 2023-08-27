<script lang="ts">
	import PositionController from './PositionController.svelte';
	import { onMount } from 'svelte';
	import { io, type Socket } from 'socket.io-client';

	let status = 'Disconnected';
	let transport = 'N/A';
	let socket: Socket;
	onMount(() => {
		socket = io();

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

<div class="main-container">
	<p>Status: <span id="status">{status}</span></p>
	<p>Transport: <span id="transport">{transport}</span></p>
	<PositionController {socket} />
</div>

<style>
	:global(html),
	:global(body) {
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: 0;
		margin: 0;
	}

	div.main-container {
		height: 100%;
		overflow: scroll;
		-webkit-overflow-scrolling: touch;
	}
</style>
