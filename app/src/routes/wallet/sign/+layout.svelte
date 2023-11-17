<script>
	import WagmiProvider from '$lib/wagmi/WagmiProvider.svelte';
</script>

<WagmiProvider autoConnect={true}>
	<slot />
</WagmiProvider>
