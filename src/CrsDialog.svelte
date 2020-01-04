<script>
  import { onMount, beforeUpdate } from 'svelte'
  import Dialog, {Title, Content, Actions} from '@smui/dialog';
  import Button, {Label} from '@smui/button';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text/index';
	import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let crs
  export let open
  let lastCrs
  let dialog
  let epsg = ''
  let currentlyOpen = false

  onMount(update)
  beforeUpdate(update)

  function update () {
    if (currentlyOpen !== open) {
      if (open) {
        dialog.open()
      } else {
        dialog.close()
      }

      currentlyOpen = open
    }

    if (crs !== lastCrs) {
      lastCrs = crs
      epsg = crs.epsg.toString()
    }
  }

</script>

<Dialog
  bind:this={dialog}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-content">
  <Title id="dialog-title">Set Coordinate System (CRS)</Title>
  <Content id="dialog-content">
    <div>
      <Textfield type="number" bind:value={epsg} label="CRS" input$aria-controls="helper-text-crs" input$aria-describedby="helper-text-crs" />
      <HelperText id="helper-text-crs">Coordinate System (EPSG code)</HelperText>
    </div>
  </Content>
  <Actions>
    <Button on:click={() => dispatch('cancel')}>
      <Label>Cancel</Label>
    </Button>
    <Button on:click={() => dispatch('change', { epsg: Number(epsg) })}>
      <Label>Ok</Label>
    </Button>
  </Actions>
</Dialog>
