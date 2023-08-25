import * as esbuild from 'esbuild';
import * as fs from 'fs/promises';

await esbuild
	.build({
		entryPoints: ['src/server/bundle-entrypoint.ts'],
		bundle: true,
		outfile: 'build/entrypoint.js',
		format: 'esm',
		target: 'esnext',
		external: ['./handler.js'],
		platform: 'node',
		banner: {
			js: `
import { fileURLToPath } from 'url';
import { createRequire as topLevelCreateRequire } from 'module';
const require = topLevelCreateRequire(import.meta.url);
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
        `
		},
		metafile: true
	})
	.then((e) => esbuild.analyzeMetafile(e.metafile))
	.then((e) => console.log(e))
	.catch(console.error);

await fs.rm('build/index.js').catch(() => undefined);
