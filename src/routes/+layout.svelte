<script lang="ts">
	import '../app.css';
	import TabBar from '$ui/TabBar.svelte';

	let { children } = $props();
</script>

<div class="app">
	<main class="content">
		{@render children()}
	</main>
	<TabBar />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		min-height: 100dvh;
		max-width: 720px;
		margin: 0 auto;
	}

	.content {
		flex: 1;
		padding: 16px 16px calc(72px + env(safe-area-inset-bottom)) 16px;
		overflow-y: auto;
	}
</style>
