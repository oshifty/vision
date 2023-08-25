import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import type { ViteDevServer } from 'vite';
import { createWebsocketServer } from './src/server/ws';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;
		createWebsocketServer(server.httpServer);
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


