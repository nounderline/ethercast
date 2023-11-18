<script>
	import Header from '../Header.svelte';
	import Data from './data.json';
</script>

{#each Object.entries(Data) as [key, channel]}
	<div
		class="flex flex-row items-center hover:bg-black/5 p-4 justify-between border-white/10 border-b-[1px] last:border-b-0"
	>
		<div class="flex flex-row gap-2 items-center">
			<div class="avatar">
				<div class="w-16 rounded">
					<img src={channel.image} alt="" />
				</div>
			</div>
			<div>
				<a class="text-xl font-bold line-clamp-1 hover:underline" href="/channels/{key}"
					>{channel.title}</a
				>
				<div class="line-clamp-1">{channel.description}</div>
			</div>
		</div>
	</div>
{/each}
