<script>
	import WagmiProvider from '$lib/wagmi/WagmiProvider.svelte';
</script>

<WagmiProvider autoConnect={false}>
	<slot />
</WagmiProvider>
