<script>
  import Button from '@smui/button';
	import { createEventDispatcher } from 'svelte';
  import toBuffer from 'blob-to-buffer'

	const dispatch = createEventDispatcher();

  function handleFileSelected (event) {
    const file = event.target.files[0]
    const reader = new FileReader()
    const blob = new Blob([reader.result], {type: 'application/octet-stream'})
    toBuffer(file, (err, buffer) => {
      dispatch('mapselected', {
        name: file.name,
        content: buffer
      })
    })
  }
</script>

<style>
</style>

<h1>Select an OCAD map file</h1>
<input type="file" accept=".ocd" on:change={handleFileSelected} />
<Button>Test</Button>