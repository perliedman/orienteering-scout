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
  let lastFeature

  afterUpdate(() => {
    if (feature) {
      let fDistance
      if (userCoord) {
        try {
          fDistance = getDistance()
        } catch (e) {
          console.error(e)
        }
      }

      text = feature && `${feature.properties.name}${fDistance ? ', ' + formatDistance(fDistance) : ''}`

      if (lastFeature !== feature) {
        snackbar.open()
      }
    }
  })

  function getDistance () {
    const { geometry } = feature
    switch (geometry.type) {
      case 'Point':
        return distance(userCoord, geometry.coordinates)
      case 'LineString':
        return pointToLineDistance(userCoord, feature)
      case 'Polygon':
        const line = polygonToLine(feature)
        return pointToLineDistance(userCoord, line)
      default:
        console.warn(`Unknown geometry type ${geometry.type}`)
    }
  }

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
