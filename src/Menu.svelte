<script>
  import List, {Item, Text, Meta, Separator, Subheader} from '@smui/list';
  import Chip from '@smui/chips'
	import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let crs

  function menuAction (event) {
    dispatch('close')
    dispatch(event)
  }
</script>

<List>
  <Item on:click={() => menuAction('selectcrs')}>
    <Text>Coordinate Reference</Text>
    <Meta>
      <Chip>
        <Text>{crs.epsg}</Text>
      </Chip>
    </Meta>
  </Item>
  <Item on:click={() => menuAction('selectmap')}>
    <Text>Map</Text>
  </Item>
</List>
