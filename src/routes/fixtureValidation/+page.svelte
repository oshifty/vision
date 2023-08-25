<script lang="ts">
	import { onMount } from 'svelte';

	import type * as UDRnext from '$lib/udr.next';
	import type * as UDR from '$lib/udr';

	export let data;

	async function main() {
		const contents = JSON.stringify(data.file, null, '\t');

		console.log(`\nFilename: ${data.filename}`);
		console.log(`\nData: ${contents}`);

		console.log(`\nValidating against UDR Schema...`);
		if (data.validUDR) {
			const file = data.file as UDR.Device;
			console.log(`Successfully read "${file.userIdentifier}".`);
		} else {
			for (const error of data.validateUDRErrors || []) {
				console.log(`Error parsing "myFixture.json": ${error.message}\n`);
			}
		}

		console.log(`\nValidating against UDRnext Schema...`);
		if (data.validUDRnext) {
			const file = data.file as UDRnext.Device;
			console.log(`Successfully read "${file.userIdentifier}" with "${file.test}".`);
		} else {
			for (const error of data.validateUDRnextErrors || []) {
				console.log(`Error parsing "myFixture.json": ${error.message}\n`);
			}
		}
	}
	onMount(() => {
		main();
	});
</script>

<h1>Hello!</h1>
