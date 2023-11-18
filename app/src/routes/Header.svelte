<script>
	import { getWagmiContext } from '$lib/wagmi';

	const { config, account, accountDisplay, client } = getWagmiContext();
</script>

<div class="flex flex-row items-center justify-between py-4">
	<div>
		<a href="/" class="uppercase font-bold">Ethercast</a>
	</div>

	{#if $account.isConnected}
		<a class="btn" href="/wallet/disconnect">Disconnect</a>
	{:else}
		<a class="btn" href="/wallet/connect?back=/submit">Connect</a>
	{/if}
</div>
