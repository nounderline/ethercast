<script lang="ts">
	import { connect, type ConnectResult } from '@wagmi/core';
	import { getWagmiContext } from '../../lib/wagmi';
	import { baseGoerli } from 'viem/chains';

	export let onConnect = (result: ConnectResult) => {};

	const { config, account } = getWagmiContext();

	async function handleConnect(connector = config.connectors[0]) {
		const isAuthed = await $account.connector?.isAuthorized();

		try {
			const result = await connect({
				chainId: baseGoerli.id,
				connector
			});

			onConnect(result);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
			}

			return;
		}
	}
</script>

<div class="flex flex-col gap-4">
	{#each config.connectors as connector}
		{#if connector.ready}
			<button
				class="btn btn-lg btn-block normal-case"
				disabled={$account.isConnecting}
				on:click={() => handleConnect(connector)}
			>
				{#if $account.isConnecting && $account.connector?.id === connector.id}
					<span class="loading loading-spinner loading-md mr-2" />
				{/if}

				{connector.name}
			</button>
		{/if}
	{/each}
</div>
