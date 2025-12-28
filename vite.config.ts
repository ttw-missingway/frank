import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'copy-wrangler-config',
			closeBundle() {
				// Copy wrangler.jsonc to build output directory after build
				const source = join(process.cwd(), 'wrangler.jsonc');
				const dest = join(process.cwd(), '.svelte-kit', 'cloudflare', 'wrangler.jsonc');
				try {
					copyFileSync(source, dest);
				} catch (error) {
					// Ignore if file doesn't exist or directory doesn't exist yet
				}
			}
		}
	],
	server: {
		fs: {
			allow: ['./slicemachine.config.json']
		}
	}
});
