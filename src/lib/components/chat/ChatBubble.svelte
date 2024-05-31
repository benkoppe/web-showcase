<script lang="ts">
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';

	export let bot_chat_color: string;
	export let bot_name: string;
	export let bot: boolean;

	export let avatar_color: string;
	export let message: string;
	export let loading: boolean;
	export let timestamp: string;

	$: container_grid = bot ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr_auto]';
	$: avatar_order = bot ? '' : 'order-last';
	$: avatar_icon = bot ? 'fa-robot' : 'fa-user';
	$: bubble_corner_rounding = bot ? 'rounded-tl-none' : 'rounded-tr-none';
	$: bubble_color = bot ? bot_chat_color : 'variant-soft';
	$: name = bot ? bot_name : 'You';
</script>

<div class="grid {container_grid} gap-2">
	<Avatar background={avatar_color} width="w-12" class={avatar_order}>
		<i class="fa-solid {avatar_icon}" />
	</Avatar>

	<div class="card p-4 {bubble_corner_rounding} space-y-2 {bubble_color}">
		<header class="flex justify-between items-center">
			<p class="font-bold">{name}</p>
			<small class="opacity-50 hidden sm:block">{timestamp}</small>
		</header>
		{#if loading === true}
			<ProgressRadial width="w-10" />
		{:else}
			<p>{message}</p>
		{/if}
	</div>
</div>
