<script lang="ts">
	import { getWagmiContext } from '$lib/wagmi';
	import { disconnect } from '@wagmi/core';

	const { config, account, accountDisplay, client } = getWagmiContext();

	function handleDisconnect() {
		disconnect();
	}
</script>

<div class="card bg-base-200">
	<div class="card-body">
		<div class="flex flex-row items-center">
			<div class="flex flex-col flex-1">
				{#await Promise.resolve(null)}
					<div class="text-2xl font-bold">Welcome</div>
					{#if $account.isConnected}
						<div class="flex items-center">
							<span class="loading loading-xs loading-spinner" />
							<span class="w-1" />
							Connecting...
						</div>
					{:else}
						<div>Please connect your wallet</div>
					{/if}
				{:then membership}
					{#if $account.isConnected || $account.isConnecting}
						<div class="text-2xl font-bold">Welcome, {$accountDisplay}</div>
					{:else}
						<div class="text-2xl font-bold">Welcome</div>
					{/if}
				{/await}
			</div>

			<div class="flex flex-row">
				{#if $account.isConnected}
					<a class="btn" href="/wallet/disconnect">Disconnect</a>
				{:else}
					<a class="btn" href="/wallet/connect?back=/submit">Connect</a>
				{/if}
			</div>
		</div>
	</div>
</div>
