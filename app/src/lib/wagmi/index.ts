import {
	PUBLIC_BASE_GOERLI_ALCHEMY_API_KEY,
	PUBLIC_CHAIN_ID,
	PUBLIC_MAINNET_ALCHEMY_API_KEY,
	PUBLIC_WALLET_CONNECT_PROJECT_ID
} from '$env/static/public';
import { configureChains, createConfig, getAccount, mainnet } from '@wagmi/core';
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet';
import { InjectedConnector } from '@wagmi/core/connectors/injected';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { publicProvider } from '@wagmi/core/providers/public';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { getContext } from 'svelte';
import { derived, readable } from 'svelte/store';
import { createPublicClient, http } from 'viem';
import { baseGoerli } from 'viem/chains';
import { getEnsName } from 'viem/ens';

export function formatShortAddress(addr: `0x${string}` | string) {
	return addr.substring(0, 4) + '...' + addr.substr(-4);
}

export const createWagmiContext = ({ autoConnect = false } = {}) => {
	const { chains, publicClient, webSocketPublicClient } = configureChains(
		[baseGoerli],
		[alchemyProvider({ apiKey: PUBLIC_BASE_GOERLI_ALCHEMY_API_KEY })]
	);

	const client = publicClient({ chainId: baseGoerli.id });

	const mainnetClient = createPublicClient({
		chain: mainnet,
		transport: http(`https://eth-mainnet.g.alchemy.com/v2/${PUBLIC_MAINNET_ALCHEMY_API_KEY}`)
	});

	const config = createConfig({
		autoConnect,
		publicClient,
		webSocketPublicClient,
		connectors: [
			new InjectedConnector({ chains }),
			new WalletConnectConnector({
				chains,
				options: {
					projectId: PUBLIC_WALLET_CONNECT_PROJECT_ID
				}
			}),
			new CoinbaseWalletConnector({ chains, options: { appName: 'Ethercast' } })
		]
	});

	const account = readable(getAccount(), (set) => {
		return config.subscribe(
			(v) => v,
			(newState, oldState) => {
				set(getAccount());
			}
		);
	});

	const accountENS = derived(account, ($account, set) => {
		if ($account?.address) {
			getEnsName(client, {
				address: $account.address
			}).then((v) => {
				set(v);
			});
		} else {
			set(undefined);
		}
	});

	const accountDisplay = derived([account, accountENS], ([$account, $accountENS]) => {
		if ($account?.address) {
			if ($accountENS) {
				return $accountENS;
			}

			const addr = $account.address;

			return formatShortAddress(addr);
		}

		return '';
	});

	return {
		config,
		account,
		accountDisplay,
		accountENS,
		client,
		mainnetClient
	};
};

type Context = ReturnType<typeof createWagmiContext>;

export const WagmiContextKey = Symbol();

export function getWagmiContext() {
	const value = getContext(WagmiContextKey) as Context;

	if (!value) {
		throw new Error('No Wagmi context set');
	}

	return value;
}
