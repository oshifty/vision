<script lang="ts">
	import { JsonView } from '@zerodevx/svelte-json-view';
	export let data;
	let json = data.unknownJSONDoc;
</script>

<h1>Validating {data.filepath}</h1>

{#await json}
	<code>Fetching file from disk...</code>
{:then json}
	<JsonView {json} />
{/await}

<div style="margin-top: 20px">
	<span>UDR Validation: </span>
	{#await data.validatedUDRDoc}
		<span>in progess...</span>
	{:then validatedUDRDoc}
		{#if validatedUDRDoc.valid}
			<span style="color: green">
				Successfully read "{validatedUDRDoc.contents.userIdentifier}".
			</span>
		{:else}
			<span style="color: red">Error parsing {data.filepath}.</span>
			{#each validatedUDRDoc.errors || [] as error}
				<p style="color: red">{error.message}</p>
			{/each}
		{/if}
	{/await}

	<br />
	<span>UDRnext Validation: </span>
	{#await data.validatedUDRNextDoc}
		<span>in progess...</span>
	{:then validatedUDRNextDoc}
		{#if validatedUDRNextDoc.valid}
			<span
				>Successfully read "{validatedUDRNextDoc.contents.userIdentifier}" with "{validatedUDRNextDoc
					.contents.test}".</span
			>
		{:else}
			<span style="color: red">Error parsing {data.filepath}.</span>
			{#each validatedUDRNextDoc.errors || [] as error}
				<span style="color: red">&rarr; {error.message}</span>
			{/each}
		{/if}
	{/await}
</div>

<style>
	:global(body) {
		font-family: Ubuntu, 'Helvetica Neue', sans-serif;
	}
</style>
