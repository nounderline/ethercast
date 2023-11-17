<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { configureChains, disconnect, mainnet, signMessage } from '@wagmi/core';
	import { publicProvider } from '@wagmi/core/providers/public';
	import { fade, slide } from 'svelte/transition';
	import { getWagmiContext } from '../../lib/wagmi';
	import Temporary from '$lib/ui/Temporary.svelte';

	const { chains, publicClient, webSocketPublicClient } = configureChains(
		[mainnet],
		[publicProvider()]
	);

	let form: HTMLFormElement;
	let description = '';

	let sigMessage = '';
	let sigSignature = '';
	$: address = $account.address;

	const { account, config, client } = getWagmiContext();

	async function sign() {
		const struct = {
			description: description || '',
			contributor: $account.address,
			time: new Date().toISOString()
		};

		sigMessage = JSON.stringify(struct, Object.keys(struct).sort());
		sigSignature = await signMessage({ message: sigMessage });

		return sigSignature;
	}

	async function handleSubmitPress(e) {
		e.preventDefault();

		await sign();

		form.requestSubmit();
	}
</script>

<form method="POST" bind:this={form} use:enhance>
	<input type="hidden" name="sig_signature" value={sigSignature} />
	<input type="hidden" name="sig_message" value={sigMessage} />
	<input type="hidden" name="sig_address" value={address} />

	<textarea
		placeholder="Your message to the ether"
		name="description"
		bind:value={description}
		class="textarea w-full resize-none"
		rows="4"
	/>

	<div class="h-2" />

	<div>
		<button class="btn btn-primary" type="submit" on:click={handleSubmitPress}>Cast</button>
		<span class="opacity-50 ml-2">You will be asked to sign the message</span>
	</div>
</form>
