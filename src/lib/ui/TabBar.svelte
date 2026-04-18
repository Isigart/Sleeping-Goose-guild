<script lang="ts">
	import { page } from '$app/state';

	const tabs: { href: string; label: string }[] = [
		{ href: '/', label: 'Guilde' },
		{ href: '/postes', label: 'Postes' },
		{ href: '/contrats', label: 'Contrats' },
		{ href: '/compendium', label: 'Codex' },
		{ href: '/journal', label: 'Journal' }
	];
</script>

<nav class="tabbar" aria-label="Navigation principale">
	{#each tabs as tab}
		<a class="tab" class:active={page.url.pathname === tab.href} href={tab.href}>
			{tab.label}
		</a>
	{/each}
</nav>

<style>
	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
		background: var(--bg-elevated);
		border-top: 1px solid var(--border);
		max-width: 720px;
		margin: 0 auto;
		z-index: 10;
	}

	.tab {
		flex: 1;
		text-align: center;
		padding: 8px 4px;
		font-size: 13px;
		color: var(--text-dim);
		text-decoration: none;
		border-radius: var(--radius);
		transition: color 120ms;
	}

	.tab.active {
		color: var(--accent);
	}

	.tab:hover {
		color: var(--text);
		text-decoration: none;
	}
</style>
