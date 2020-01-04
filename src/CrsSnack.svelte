<script>
  import { onMount } from 'svelte'
  import Snackbar, {Actions, Label} from '@smui/snackbar';
  import Button from '@smui/button';
	import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let crs
  let snackbar

  onMount(() => {
    snackbar.open()
  })

  function changeCrs () {
    dispatch('changecrs')
    snackbar.close()
  }
</script>

<Snackbar leading timeoutMs={10000} bind:this={snackbar}>
  <Label>Map loaded with coordinate reference system {crs.epsg}</Label>
  <Actions>
    <Button on:click={changeCrs}>Change CRS</Button>
  </Actions>
</Snackbar>
