import { Worker } from 'worker_threads';
import * as Comlink from 'comlink';
import nodeEndpoint from 'comlink/dist/esm/node-adapter';
import type { api } from './worker';

const worker = new Worker('./build/worker.js');
const workerApi = Comlink.wrap<typeof api>(nodeEndpoint(worker));

export const { validateAgainstUDRSymbol, getUDRSchemaForSymbol, validateDocumentAgainstSchema } =
	workerApi as unknown as typeof api;
