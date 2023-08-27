<script lang="ts">
	import { onMount } from 'svelte';

	import type { Socket } from 'socket.io-client';
	export let socket: Socket;

	let canvas: SVGSVGElement;
	let handle: SVGCircleElement;

	let currentlyDragging: SVGCircleElement | null = null;
	let x = 0.5;
	let y = 0.5;

	function firstUpdated() {
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
		const newY = (event as any).clientY ?? (event as any).touches[0].clientY;
		const newX = (event as any).clientX ?? (event as any).touches[0].clientX;
		const cursorPt = new DOMPoint(newX, newY).matrixTransform(canvas.getScreenCTM()!.inverse());
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
		firstUpdated();

		socket.on('position', (position) => {
			x = position.x;
			y = position.y;
		});
	});
</script>

<div>
	<svg bind:this={canvas} viewBox="-10 -10 120 120">
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

		<circle cx={x * 100} cy={y * 100} r="5" fill="transparent" stroke="orange" stroke-width=".8" />
		<circle cx={x * 100} cy={y * 100} r="1" fill="orange" />
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

<style>
	div {
		width: 100%;
		height: calc(100vh - 100px);
		display: flex;
		justify-content: center;
	}

	.draggable {
		cursor: move;
	}

	svg {
		max-width: 100%;
		max-height: 100%;
	}
</style>
