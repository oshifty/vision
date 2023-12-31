<script lang="ts">
	import { onMount } from 'svelte';

	import { io, type Socket } from 'socket.io-client';
	import { toogleOrientatonLock } from '$lib/helpers';
	let socket: Socket;
	let status = 'Disconnected';
	let transport = 'N/A';

	let canvas: SVGSVGElement;
	let handle: SVGCircleElement;

	let isFullscreen = false;
	let currentlyDragging: SVGCircleElement | null = null;
	let x = 0.5;
	let y = 0.5;

	function registerEvents() {
		handle.addEventListener('mousedown', (event) => startDrag(event));
		handle.addEventListener('touchstart', (event) => startDrag(event));
	}

	function startDrag(event: MouseEvent | TouchEvent) {
		currentlyDragging = event.target as SVGCircleElement;
		document.addEventListener('mousemove', (event) => drag(event));
		document.addEventListener('touchmove', (event) => drag(event));
		document.addEventListener('mouseup', () => stopDrag());
		document.addEventListener('touchend', () => stopDrag());
	}

	function drag(event: MouseEvent | TouchEvent) {
		if (!currentlyDragging) return;
		const newY = (event as MouseEvent).clientY ?? (event as TouchEvent).touches[0].clientY;
		const newX = (event as MouseEvent).clientX ?? (event as TouchEvent).touches[0].clientX;
		const screenCtm = canvas.getScreenCTM();
		if (!screenCtm) return;
		const cursorPt = new DOMPoint(newX, newY).matrixTransform(screenCtm.inverse());
		x = Math.min(1, Math.max(0, cursorPt.x / 100));
		y = Math.min(Math.max(0, cursorPt.y / 100), 1);
		socket.emit('position', { x, y });
	}

	function stopDrag() {
		currentlyDragging = null;
		document.removeEventListener('mousemove', (event) => drag(event));
		document.removeEventListener('touchmove', (event) => drag(event));
	}

	onMount(() => {
		addEventListener('fullscreenchange', () => {
			isFullscreen = document.fullscreenElement !== null;
		});

		socket = io();

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

		registerEvents();

		socket.on('position', (position) => {
			x = position.x;
			y = position.y;
		});
	});
</script>

<div class="main-container">
	<div class="centered-button">
		<button
			class={isFullscreen ? 'active' : 'inactive'}
			on:click={() => toogleOrientatonLock('portrait-primary')}
			>{isFullscreen ? 'Unlock Orientation' : 'Lock Orientation'}</button
		>
	</div>

	<p>Status: <span id="status">{status}</span></p>
	<p>Transport: <span id="transport">{transport}</span></p>

	<div class="sub-container">
		<svg bind:this={canvas} viewBox="-5 -5 110 110">
			<rect
				x="0"
				y="0"
				width="100"
				height="100"
				fill="transparent"
				stroke="#80808080"
				stroke-width=".8"
			/>

			<!-- dotted lines cented on the rect (x and y) -->
			<line
				x1="0"
				y1="50"
				x2="100"
				y2="50"
				stroke="#80808080"
				stroke-dashoffset="1"
				stroke-width=".8"
				stroke-dasharray="2,2"
			/>
			<line
				x1="50"
				y1="0"
				x2="50"
				y2="100"
				stroke="#80808080"
				stroke-dashoffset="1"
				stroke-width=".8"
				stroke-dasharray="2,2"
			/>

			<!-- dotted lines for the 4 quadrants, each one vertical and horizontal -->
			<line
				x1="25"
				y1="0"
				x2="25"
				y2="100"
				stroke="#80808080"
				stroke-dashoffset="-2"
				stroke-width=".5"
				stroke-dasharray="1,4"
			/>
			<line
				x1="75"
				y1="0"
				x2="75"
				y2="100"
				stroke="#80808080"
				stroke-dashoffset="-2"
				stroke-width=".5"
				stroke-dasharray="1,4"
			/>
			<line
				x1="0"
				y1="25"
				x2="100"
				y2="25"
				stroke="#80808080"
				stroke-dashoffset="-2"
				stroke-width=".5"
				stroke-dasharray="1,4"
			/>
			<line
				x1="0"
				y1="75"
				x2="100"
				y2="75"
				stroke="#80808080"
				stroke-dashoffset="-2"
				stroke-width=".5"
				stroke-dasharray="1,4"
			/>

			<circle
				cx={x * 100}
				cy={y * 100}
				r="5"
				fill="transparent"
				stroke="#ff4742"
				stroke-width=".8"
			/>
			<circle cx={x * 100} cy={y * 100} r="1" fill="#ff4742" />
			<circle
				bind:this={handle}
				class="draggable"
				cx={x * 100}
				cy={y * 100}
				r="20"
				fill="transparent"
				stroke-width=".8"
			/>
		</svg>
	</div>
</div>

<style>
	:global(html),
	:global(body) {
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: 0;
		margin: 0;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	button.active {
		display: inline-block;
		outline: 0;
		cursor: pointer;
		border-radius: 6px;
		border: 2px solid #ff4742;
		color: #ff4742;
		background: 0 0;
		padding: 8px;
		box-shadow: rgba(0, 0, 0, 0.07) 0px 2px 4px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1.5px 0px;
		font-weight: 800;
		font-size: 16px;
		height: 42px;
	}

	button.inactive {
		display: inline-block;
		outline: 0;
		cursor: pointer;
		border-radius: 6px;
		border: 2px solid #ff4742;
		color: #fff;
		background-color: #ff4742;
		padding: 8px;
		box-shadow: rgba(0, 0, 0, 0.07) 0px 2px 4px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1.5px 0px;
		font-weight: 800;
		font-size: 16px;
		height: 42px;
	}
	div.centered-button {
		display: flex;
		justify-content: center;
		padding-top: 12px;

		padding-bottom: 6px;
	}

	p {
		margin: 0;
		padding: 3px;
		text-align: center;
	}

	div.main-container {
		height: 100%;
		overflow: hidden;
		-webkit-overflow-scrolling: touch;
	}
	div.sub-container {
		width: 100%;
		height: calc(100vh - 100px);
		display: flex;
		justify-content: center;
	}

	.draggable {
		cursor: move;
	}

	svg {
		padding: 0;
		margin: 0;
		max-width: 100%;
		max-height: 100%;
	}
</style>
