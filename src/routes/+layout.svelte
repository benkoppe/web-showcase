<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		AppRail,
		AppRailAnchor,
		TabGroup,
		TabAnchor
	} from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	const PAGE_TITLE = 'Web Showcase';

	const NAV_BUTTONS = [{ title: 'GitHub', link: 'https://github.com/' }];

	const APP_TILES = [
		{
			title: 'AI Chat',
			icon: 'fa-comments',
			link: '/chat'
		},
		{
			title: 'Wordle',
			icon: 'fa-chess-board',
			link: '/wordle'
		}
	];

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/">
					<strong class="text-xl md:text-2xl lg:text-3xl uppercase">{PAGE_TITLE}</strong>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#each NAV_BUTTONS as { title, link }}
					<a class="btn btn-sm variant-ghost-surface" href={link} target="_blank" rel="noreferrer">
						{title}
					</a>
				{/each}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->

	<!-- App Rail -->
	<svelte:fragment slot="sidebarLeft">
		<AppRail class="hidden sm:block md:w-[90px] lg:w-[100px]">
			{#each APP_TILES as { title, icon, link }}
				<AppRailAnchor href={link} {title} selected={$page.url.pathname === link}>
					<svelte:fragment slot="lead">
						<i class="fa-solid {icon} md:text-2xl lg:text-3xl"></i>
					</svelte:fragment>
					<span>{title}</span>
				</AppRailAnchor>
			{/each}
		</AppRail>
	</svelte:fragment>

	<!-- Tab Group -->
	<svelte:fragment slot="footer">
		<TabGroup
			justify="justify-center"
			active="variant-filled-primary"
			hover="hover:variant-soft-primary"
			flex="flex-1 lg:flex-none"
			rounded=""
			border=""
			class="sm:hidden bg-surface-100-800-token w-full"
		>
			{#each APP_TILES as { title, icon, link }}
				<TabAnchor href={link} {title} selected={$page.url.pathname === link}>
					<svelte:fragment slot="lead">
						<i class="fa-solid {icon} text-2xl"></i>
					</svelte:fragment>
					<span>{title}</span>
				</TabAnchor>
			{/each}
		</TabGroup>
	</svelte:fragment>

	<!-- Page Content -->
	<div class="p-10">
		<slot />
	</div>
</AppShell>
