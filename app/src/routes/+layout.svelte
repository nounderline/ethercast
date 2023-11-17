<script>
	import { getWagmiContext } from '$lib/wagmi';
	import './styles.css';

	export let data;
</script>

<svelte:head>
	<title>Ethercast</title>
</svelte:head>

<div class="w-full min-h-screen dark bg-red">
	<div class="max-w-3xl w-full my-0 mx-auto">
		<slot />

		<div class="h-8" />

		<div class="text-sm text-center opacity-40 font-mono">
			{#if data.build.hash}
				build {data.build.hash.substring(0, 6)}
			{/if}
		</div>

		<div class="h-4" />
	</div>
</div>
