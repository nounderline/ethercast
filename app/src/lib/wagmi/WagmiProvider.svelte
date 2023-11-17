<script context="module">
	const context = createWagmiContext();
</script>

<script>
	import { setContext } from 'svelte';
	import { WagmiContextKey, createWagmiContext } from './index';

	export let autoConnect = false;

	const account = context.account;

	if (!$account.isConnected && autoConnect) {
		context.config.autoConnect();
	}

	setContext(WagmiContextKey, context);
</script>

<slot />
