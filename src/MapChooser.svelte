<script>
	import { createEventDispatcher } from 'svelte';
  import toBuffer from 'blob-to-buffer'
  import Fab, { Icon } from '@smui/fab'

  const dispatch = createEventDispatcher();
  let fileInput

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
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="container">
  <Fab extended color="primary" on:click={() => fileInput.click()}>
    <Icon class="material-icons">map</Icon>
    Select an OCAD map file
  </Fab>
  <input
    type="file"
    accept=".ocd"
    on:change={handleFileSelected}
    bind:this={fileInput}
    style="display: none"/>
</div>
