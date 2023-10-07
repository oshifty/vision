<script lang="ts">
	import 'github-markdown-css/github-markdown-dark.css';
	import './md.css';

	export let layout = 'ghDark';
	export let title = 'My Document';
</script>

<svelte:head>
	<title>{title} | SHIFTY</title>
</svelte:head>

<article class="markdown-body {layout}">
	<slot />
</article>

<style>
	.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}
</style>
