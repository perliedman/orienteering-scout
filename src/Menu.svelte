<script>
  import List, {Item, Text, Separator, Subheader} from '@smui/list';
	import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function menuAction (event) {
    dispatch('close')
    dispatch(event)
  }
</script>

<List>
  <Item on:click={() => menuAction('selectmap')}>
    <Text>Select Map</Text>
  </Item>
  <Item href="javascript:void(0)">
    <Text>Other</Text>
  </Item>
</List>
