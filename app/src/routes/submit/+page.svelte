<script lang="ts">
	import { page } from '$app/stores';
	import CastForm from '$lib/ui/CastForm.svelte';
	import Casts from '$lib/ui/Casts.svelte';
	import Temporary from '$lib/ui/Temporary.svelte';
	import { getWagmiContext } from '$lib/wagmi';
</script>

{#if $page.form?.success}
	<Temporary hideAfter={3000}>
		<div class="alert alert-info mb-8">Succesfully added new entry.</div>
	</Temporary>
{/if}

<CastForm />

<div class="h-4" />

<Casts />
