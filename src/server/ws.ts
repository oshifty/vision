import type http from "http";
import { Server } from 'socket.io';

export function createWebsocketServer(httpServer: http.Server) {
	const io = new Server(httpServer);

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