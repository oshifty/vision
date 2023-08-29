import { Worker } from 'worker_threads';
import * as Comlink from 'comlink';
import nodeEndpoint from 'comlink/dist/esm/node-adapter';
import type { api } from './worker';
import { building } from '$app/environment';

let worker: Worker;
let workerApi = {} as unknown as typeof api;
if (!building) {
	worker = new Worker('./build/worker.js');
	workerApi = Comlink.wrap<typeof api>(nodeEndpoint(worker)) as unknown as typeof api;
}

export const { validateAgainstUDRSymbol, getUDRSchemaForSymbol, validateDocumentAgainstSchema } =
	workerApi;
