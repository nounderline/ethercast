<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	export let hideAfter: number;

	let hidden = false;

	setTimeout(() => {
		hidden = true;
	}, hideAfter);
</script>

{#if !hidden}
	<div out:fly>
		<slot />
	</div>
{/if}
