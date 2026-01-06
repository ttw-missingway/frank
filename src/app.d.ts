// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SettingsDocument } from './prismicio-types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			settings?: SettingsDocument | null;
		}
		interface Platform {
			env?: {
				// Add your Cloudflare environment variables here
				// Example: VITE_PRISMIC_ENVIRONMENT?: string;
			};
			context?: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches?: CacheStorage & { default: Cache };
		}
	}
}

export {};
