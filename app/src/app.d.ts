// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			wallet?: {
				address: `0x${string}`;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
