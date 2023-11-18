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

	const { chains, publicClient, webSocketPublicClient } = configureChains(
		[mainnet],
		[publicProvider()]
	);

	let form: HTMLFormElement;
	let text = '';

	let alert = '';

	$: address = $account.address;

	const { account, config, client } = getWagmiContext();

	const ABI = [
		{
			name: 'cast',
			type: 'function',
			stateMutability: 'payable',
			inputs: [
				{ type: 'string', name: 'content' },
				{ type: 'string[]', name: 'tags' },
				{ type: 'address', name: 'verificationContract' }
			],
			outputs: []
		},
		{
			name: 'NewPost',
			type: 'event',
			inputs: [
				{ type: 'address', name: 'user', indexed: true },
				{ type: 'string', name: 'content' },
				{ type: 'string[]', name: 'tags', indexed: true },
				{ type: 'address', name: 'verificationAddress', indexed: true }
			]
		}
	];

	async function sign() {
		alert = `Please open your wallet to confirm a transaction.`;

		const config = await prepareWriteContract({
			// @ts-ignore
			address: PUBLIC_POSTER_CONTRACT,
			abi: ABI,
			functionName: 'cast',
			args: [text, [], '0x0000000000000000000000000000000000000000']
		});

		const write = await writeContract(config);

		alert = `Waiting for confirmation...`;

		const wait = await waitForTransaction({ hash: write.hash });

		// @ts-ignore
		$newCastStore = {
			// @ts-ignore
			hash: write.hash
		};

		alert = 'Cast successful!';

		setTimeout(() => {
			alert = '';
		}, 1000);
	}

	async function handleSubmitPress(e) {
		e.preventDefault();

		await sign().catch((err) => {
			writingStatus = '';

			throw err;
		});

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
