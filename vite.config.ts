import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'create-wrangler-config',
			closeBundle() {
				// Create wrangler.jsonc directly in build output directory
				const destDir = join(process.cwd(), '.svelte-kit', 'cloudflare');
				const dest = join(destDir, 'wrangler.jsonc');
				try {
					mkdirSync(destDir, { recursive: true });
					writeFileSync(
						dest,
						JSON.stringify(
							{
								name: 'frank',
								compatibility_date: '2024-01-01',
								assets: {
									directory: '.'
								}
							},
							null,
							2
						) + '\n'
					);
				} catch (error) {
					// Ignore if directory doesn't exist yet
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
