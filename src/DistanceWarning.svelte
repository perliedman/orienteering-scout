<script>
  import Snackbar, {Actions, Label} from '@smui/snackbar';
  import Button from '@smui/button';
	import bbox from '@turf/bbox'
  import bboxPolygon from '@turf/bbox-polygon'
  import polygonToLine from '@turf/polygon-to-line'
  import pointToLineDistance from '@turf/point-to-line-distance'
  import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
 
  export let userCoord
  export let mapGeoJson

  let bboxPoly
  let bboxOuterRing
  let warn = false
  let hasWarned = false
  let snackbar

  $: if (mapGeoJson) {
    const mapBbox = bbox(mapGeoJson)
    bboxPoly = bboxPolygon(mapBbox)
    bboxOuterRing = polygonToLine(bboxPoly)
  }

  $: if (!hasWarned && bboxOuterRing && userCoord) {
    warn = !booleanPointInPolygon(userCoord, bboxPoly) &&
      pointToLineDistance(userCoord, bboxOuterRing) > 10
    if (warn) {
      snackbar.open()
      hasWarned = true
    } else {
      snackbar.close()
    }
  }

  function changeCrs () {
    snackbar.close()
    dispatch('selectcrs')
  }
</script>

<Snackbar leading timeoutMs={10000} bind:this={snackbar}>
  <Label>
    You are far from the mapped area.
    You might need to change the coordinate reference system.
  </Label>
  <Actions>
    <Button on:click={changeCrs}>Change CRS</Button>
  </Actions>
</Snackbar>
