<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getWagmiContext } from '$lib/wagmi';
	import { disconnect } from '@wagmi/core';

	const backUrl = $page.params.back || '/';

	disconnect().then(() => {
		goto(backUrl);
	});
</script>
