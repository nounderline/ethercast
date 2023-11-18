<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_POSTER_CONTRACT } from '$env/static/public';
	import CastForm from '$lib/ui/CastForm.svelte';
	import Temporary from '$lib/ui/Temporary.svelte';
	import { formatShortAddress, getWagmiContext } from '$lib/wagmi';
	import { onMount } from 'svelte';
	import { getEnsAvatar, getEnsName } from 'viem/ens';

	const { client, mainnetClient } = getWagmiContext();

	let logs = [] as {
		ens: undefined | null | string;
		avatar: undefined | null | string;
		address: string;
		content: string;
		block: number;
	}[];

	onMount(async () => {
		const newLogs = await client.getContractEvents({
			// @ts-ignore
			address: PUBLIC_POSTER_CONTRACT,
			abi: [
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
			],
			fromBlock: 12529623n,
			toBlock: 'latest'
		});

		const ensPromises = new Map();

		logs = newLogs.map((log) => {
			const address = log.args.user.toLowerCase();

			const obj = {
				ens: undefined,
				avatar: undefined,
				address,
				content: log.args.content,
				blockNumber: log.blockNumber
			};

			if (!ensPromises.has(address)) {
				ensPromises.set(address, mainnetClient.getEnsName({ address }));
			} else {
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
			}

			return obj;
		});
	});

	$: {
		console.log(logs);
	}
</script>

{#if $page.form?.success}
	<Temporary hideAfter={3000}>
		<div class="alert alert-info mb-8">Succesfully added new entry.</div>
	</Temporary>
{/if}

<div class="card bg-base-300">
	<div class="card-body">
		<CastForm />
	</div>
</div>

<div class="h-4" />

<div class="flex flex-col gap-2">
	{#each logs as log}
		<div class="card bg-base-300">
			<div class="card-body flex-row gap-4">
				<img
					src={log.avatar || `https://i.pravatar.cc/150?u=${log.address}`}
					class="w-12 aspect-square rounded-full"
					on:error={(e) => {
						e.target.src = `https://i.pravatar.cc/150?u=${log.address}`;
					}}
				/>
				<div>
					<div>
						<a href="https://etherscan.io/address/${log.address}" class="font-bold">
							{log.ens || formatShortAddress(log.address)}
						</a>
						at <a href="https://goerli.basescan.org/block/{log.blockNumber}">#{log.blockNumber}</a>
					</div>
					<div>
						{log.content}
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
