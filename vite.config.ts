import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

import type { ViteDevServer } from 'vite';
import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			console.log(`connected with transport ${socket.conn.transport.name}`);

			socket.emit('rtt');

			socket.conn.on('upgrade', (transport) => {
				console.log(`transport upgraded to ${transport.name}`);

				if (transport.name === 'websocket') {
					socket.emit('eventFromServer', 'Hello, World 👋');
				}
			});

			socket.on('rtt', (start) => {
				const tof = Date.now() - start;
				socket.emit('tof', tof);
			});

			socket.on('disconnect', (reason) => {
				console.log(`disconnected due to ${reason}`);
			});
		});
	}
};

export default defineConfig({
	server: {
		watch: {
			ignored: ['**/public/**']
		}
	},
	plugins: [sveltekit(), webSocketServer],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
