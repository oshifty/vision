import polka from 'polka';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { handler } from './handler.js';
import { createWebsocketServer } from './ws.js';
import http from 'http';

const server = http.createServer();

const app = polka({ server });

// add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (req, res) => {
	res.end('ok');
});


// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(3000, () => {
	console.log('listening on port 3000');
});

createWebsocketServer(server);