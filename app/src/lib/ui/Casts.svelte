<script lang="ts">
	import { PUBLIC_POSTER_CONTRACT } from '$env/static/public';
	import { formatShortAddress, getWagmiContext } from '$lib/wagmi';
	import { onMount } from 'svelte';
	import { newCastStore } from './CastForm.svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { EthercastPosterABI } from '$lib/ethercast.js';
	import Data from '../../routes/channels/data.json';

	$: channelDetail = Data[$page.params.channel];

	const { client, mainnetClient } = getWagmiContext();

	let logs = [] as {
		ens: undefined | null | string;
		avatar: undefined | null | string;
		address: string;
		content: string;
		blockNumber: number;
	}[];

	async function updateLogs() {
		const newLogs = await client.getContractEvents({
			// @ts-ignore
			address: PUBLIC_POSTER_CONTRACT,
			abi: EthercastPosterABI,
			args: channelDetail
				? {
						verificationAddress: channelDetail.contract
				  }
				: {},
			fromBlock: 12529623n,
			eventName: 'NewPost',
			toBlock: 'latest'
		});

		const ensPromises = new Map();

		logs = newLogs
			.map((log) => {
				const address = log.args.user.toLowerCase();

				const obj = {
					ens: undefined,
					avatar: undefined,
					address,
					content: log.args.content,
					blockNumber: log.blockNumber,
					verificationAddress: log.args.verificationAddress
				};

				if (!ensPromises.has(address)) {
					ensPromises.set(address, mainnetClient.getEnsName({ address }));
				}

				ensPromises.get(address).then((ens) => {
					if (ens) {
						obj.avatar = `https://euc.li/${ens}`;
						obj.ens = ens;
					} else {
						obj.avatar = null;
						obj.ens = null;
					}

					logs = logs;
				});

				return obj;
			})
			.toReversed();
	}

	onMount(() => {
		updateLogs();
	});

	$: {
		if ($newCastStore) {
			updateLogs();
		}
	}
</script>

<div class="flex flex-col gap-2">
	{#each logs as log (log.blockNumber + log.address)}
		{@const channel = Object.entries(Data).find(([k, c]) => c.contract === log.verificationAddress)}

		<div class="card card-compact border-b-[1px] border-gray-200" transition:fade>
			<div class="card-body flex-row gap-4">
				<img
					src={log.avatar || `https://i.pravatar.cc/150?u=${log.address}`}
					class="w-12 h-12 rounded-full"
					on:error={(e) => {
						e.target.src = `https://i.pravatar.cc/150?u=${log.address}`;
					}}
				/>
				<div>
					<div class="flex items-center">
						<a href="https://etherscan.io/address/{log.address}" class="font-bold" target="_blank">
							{log.ens || formatShortAddress(log.address)}
						</a>
						{#if channelDetail}
							<div class="w-2" />
							<svg
								class="w-4 h-4 text-green-600"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 21 21"
								><path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m6.072 10.072 2 2 6-4m3.586 4.314.9-.9a2 2 0 0 0 0-2.828l-.9-.9a2 2 0 0 1-.586-1.414V5.072a2 2 0 0 0-2-2H13.8a2 2 0 0 1-1.414-.586l-.9-.9a2 2 0 0 0-2.828 0l-.9.9a2 2 0 0 1-1.414.586H5.072a2 2 0 0 0-2 2v1.272a2 2 0 0 1-.586 1.414l-.9.9a2 2 0 0 0 0 2.828l.9.9a2 2 0 0 1 .586 1.414v1.272a2 2 0 0 0 2 2h1.272a2 2 0 0 1 1.414.586l.9.9a2 2 0 0 0 2.828 0l.9-.9a2 2 0 0 1 1.414-.586h1.272a2 2 0 0 0 2-2V13.8a2 2 0 0 1 .586-1.414Z"
								/></svg
							>
						{/if}
						<div class="w-2" />
						<a
							href="https://goerli.basescan.org/block/{log.blockNumber}"
							target="_blank"
							class=" text-sm text-gray-400">#{log.blockNumber}</a
						>
					</div>
					<div>
						{log.content}
					</div>
					{#if !channelDetail && channel}
						<a href="/channels/{channel[0]}" class="badge py-4 hover:opacity-50">
							<img alt="" src={channel[1].image} class="w-4 h-4" />
							<div class="w-2" />
							{channel[1].title}
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>
