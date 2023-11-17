<script lang="ts">
	import { page } from '$app/stores';
	import { getWagmiContext } from '$lib/wagmi';

	const { account, config, client } = getWagmiContext();

	$: message = $page.params.message;
	$: address = $account.address;
	let signature = '';

	async function sign() {
		sigMessage = JSON.stringify(struct, Object.keys(struct).sort());
		sigSignature = await signMessage({ message: sigMessage });

		return sigSignature;
	}
</script>
