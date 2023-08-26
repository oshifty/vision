<script lang="ts">
	import { JsonView } from '@zerodevx/svelte-json-view';
	export let data;
</script>

<h1>Validating {data.filepath}</h1>

{#await data.streamed.unknownJSONDoc}
	<code>Fetching file from disk...</code>
{:then unknownJSONDoc}
	<JsonView json={unknownJSONDoc} />
{/await}

<div style="margin-top: 20px">
	<span>UDR Validation: </span>
	{#await data.streamed.validatedUDRDoc}
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
	{#await data.streamed.validatedUDRNextDoc}
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
