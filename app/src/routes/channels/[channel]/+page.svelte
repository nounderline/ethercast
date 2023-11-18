<script>
	import { page } from '$app/stores';
	import CastForm from '$lib/ui/CastForm.svelte';
	import Casts from '$lib/ui/Casts.svelte';
	import Data from '../data.json';

	$: details = Data[$page.params.channel];
</script>

<div class="card card-compact shadow-sm">
	<div class="card-body flex-row gap-4 items-center">
		<img src={details.image} alt="" class="w-24" />
		<div>
			<h1 class="text-5xl font-bold">{details.title}</h1>
			<p>
				{details.description}
			</p>
		</div>
	</div>
</div>

<CastForm />

<div class="h-4" />

<Casts />
