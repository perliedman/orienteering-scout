<script>
  import distance from '@turf/distance'
  import pointToLineDistance from '@turf/point-to-line-distance'
  import polygonToLine from '@turf/polygon-to-line'
  import Snackbar, {Actions, Label} from '@smui/snackbar';
	import { afterUpdate } from 'svelte'

  export let feature
  export let userCoord
  let snackbar
  let text

  afterUpdate(() => {
    if (feature) {
      let fDistance
      if (userCoord) {
        const { geometry } = feature
        switch (geometry.type) {
          case 'Point':
            fDistance = distance(userCoord, geometry.coordinates)
            break
          case 'LineString':
            fDistance = pointToLineDistance(userCoord, feature)
            break
          case 'Polygon':
            const line = polygonToLine(feature)
            fDistance = pointToLineDistance(userCoord, line)
            break
          default:
            console.warn(`Unknown geometry type ${geometry.type}`)
        }
      }

      text = feature && `${feature.properties.name}${fDistance ? ', ' + formatDistance(fDistance) : ''}`
      snackbar.open()
    }
  })

  function formatDistance (d) {
    let unit
    let decimals
    if (d < 1) {
      unit = 'm'
      decimals = 0
      d *= 1000
    } else if (d < 10) {
      unit = 'km'
      decimals = 1
    } else {
      unit = 'km'
      decimals = 0
    }

    return `${d.toFixed(decimals)} ${unit}`
  }
</script>

<Snackbar bind:this={snackbar} labelText={text}>
  <Label></Label>
</Snackbar>
