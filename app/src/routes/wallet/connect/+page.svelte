<script lang="ts">
	import { getWagmiContext } from '$lib/wagmi';
	import { signMessage } from '@wagmi/core';
	import WalletConnector from '../WalletConnector.svelte';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { tick } from 'svelte';

	const { config, account, client } = getWagmiContext();

	$: afterConnectUrl = $page.url.searchParams.get('back');

	let form: HTMLFormElement;
	let signPayload = {
		signature: '',
		message: '',
		address: ''
	};

	let connector = null;
	let isSigning = false;
	let signingFailed = false;

	function handleConnection() {
		if (afterConnectUrl) {
			goto(afterConnectUrl);
		}
	}

	async function sign() {
		signingFailed = false;
		isSigning = true;

		const chainId = await $account.connector?.getChainId();
		const time = new Date().toISOString();
		const address = $account.address!.toLowerCase();

		const message = `Please sign this message to sign in.`.trim();

		const signature = await signMessage({ message: message }).catch(() => {
			signingFailed = true;

			return null;
		});

		if (signature) {
			signPayload = {
				signature,
				message,
				address
			};

			// Wait for form inputs to be updated from reassignement
			await tick();

			form.submit();
		}

		isSigning = false;
	}
</script>

<form bind:this={form} method="POST">
	{#each Object.entries(signPayload) as [name, value] (name)}
		<input type="hidden" {name} {value} />
	{/each}
</form>

{#if signingFailed}
	<div class="flex flex-col items-center">
		<div>Please sign a message to sign in.</div>
		<div class="h-4" />
		<button class="btn" on:click={sign}
			>Sign using {$account.connector?.name || ' your wallet'}</button
		>
	</div>
{/if}

<div class="m-auto max-w-2xl">
	<h1 class="text-2xl text-center mb-8 font-semibold">Please connect your wallet</h1>

	{#if isSigning}
		<div class="flex flex-col items-center">
			<span class="loading loading-ring w-16" />

			<div class="h-4" />

			<div>Please sign a message in {$account.connector?.name || ' your wallet'}</div>
		</div>
	{/if}

	<WalletConnector onConnect={handleConnection} />
</div>
