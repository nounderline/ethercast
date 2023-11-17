<script>
	import WagmiProvider from '$lib/wagmi/WagmiProvider.svelte';
	import Header from '../../Header.svelte';
</script>

<WagmiProvider autoConnect={false}>
	<Header />

	<slot />
</WagmiProvider>
