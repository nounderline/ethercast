<script>
	import { getWagmiContext } from '$lib/wagmi';

	const { config, account, accountDisplay, client } = getWagmiContext();
</script>

<div class="h-4" />

<div class="navbar bg-base-300 rounded-md">
	<div class="navbar-start">
		<a class="btn btn-ghost text-xl" href="/">Ethercast</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/">Global</a></li>
			<li><a href="/channels">Channels</a></li>
		</ul>
	</div>
	<div class="navbar-end">
		{#if $account.isConnected}
			<a class="btn" href="/wallet/disconnect">Disconnect</a>
		{:else}
			<a class="btn" href="/wallet/connect?back=/submit">Connect</a>
		{/if}
	</div>
</div>

<div class="h-4" />
