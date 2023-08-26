import * as esbuild from 'esbuild';
import * as fs from 'fs/promises';

await esbuild
	.build({
		entryPoints: ['src/lib/worker.ts'],
		bundle: true,
		external: [],
		outfile: 'build/worker.js',
		format: 'esm',
		target: 'esnext',
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

// copy ts lib files (all of the typescript folder)
const tsFolder = await fs
	.readdir('node_modules/typescript/lib')
	.then((e) => e.filter((file) => file.indexOf('.d.ts') !== -1));

await Promise.all(
	tsFolder.map((file) => fs.copyFile(`node_modules/typescript/lib/${file}`, `build/${file}`))
);
