<script>
	import { page } from '$app/stores';
	import CastForm from '$lib/ui/CastForm.svelte';
	import Temporary from '$lib/ui/Temporary.svelte';
</script>

{#if $page.form?.success}
	<Temporary hideAfter={3000}>
		<div class="alert alert-info mb-8">Succesfully added new entry.</div>
	</Temporary>
{/if}

<div class="card bg-gray-100">
	<div class="card-body">
		<CastForm />
	</div>
</div>
