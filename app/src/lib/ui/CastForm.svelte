<script context="module">
	export const newCastStore = writable(null);
</script>

<script lang="ts">
	import {
		configureChains,
		mainnet,
		prepareWriteContract,
		waitForTransaction,
		writeContract
	} from '@wagmi/core';
	import { publicProvider } from '@wagmi/core/providers/public';
	import { getWagmiContext } from '../../lib/wagmi';
	import { PUBLIC_POSTER_CONTRACT } from '$env/static/public';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { EthercastPosterABI } from '$lib/ethercast.js';
	import { page } from '$app/stores';
	import Data from '../../routes/channels/data.json';

	$: channelDetail = Data[$page.params.channel];

	const { chains, publicClient, webSocketPublicClient } = configureChains(
		[mainnet],
		[publicProvider()]
	);

	let form: HTMLFormElement;
	let text = '';

	let alert = '';

	$: address = $account.address;

	const { account, config, client } = getWagmiContext();

	const ABI = EthercastPosterABI;

	async function sign() {
		alert = `Please open your wallet to confirm a transaction.`;

		const config = await prepareWriteContract({
			// @ts-ignore
			address: PUBLIC_POSTER_CONTRACT,
			abi: ABI,
			functionName: 'cast',
			args: [text, [], channelDetail?.contract || '0x0000000000000000000000000000000000000000']
		});

		console.log(config);

		const write = await writeContract(config);

		alert = `Waiting for confirmation...`;

		const wait = await waitForTransaction({ hash: write.hash });

		// @ts-ignore
		$newCastStore = {
			// @ts-ignore
			hash: write.hash
		};

		alert = '';
	}

	async function handleSubmitPress(e) {
		e.preventDefault();

		await sign();

		text = '';
	}
</script>

{#if alert}
	<div class="alert alert-info" transition:fly>{alert}</div>
	<div class="h-2" />
{/if}

<div class="card card-compact shadow-md border-gray-200 border-[1px]">
	<div class="card-body">
		<form method="POST" bind:this={form} on:submit={handleSubmitPress}>
			<textarea
				placeholder="Your message to the ether"
				name="text"
				bind:value={text}
				class="textarea textarea-lg w-full resize-none"
				rows="2"
			/>

			<div class="h-2" />

			<div>
				<button class="btn btn-primary" type="submit">Cast</button>
				<span class="opacity-50 ml-2">into the ethernity!</span>
			</div>
		</form>
	</div>
</div>
