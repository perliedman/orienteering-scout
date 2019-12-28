<script>
  import distance from '@turf/distance'
  import pointToLineDistance from '@turf/point-to-line-distance'
  import polygonToLine from '@turf/polygon-to-line'
  import Card, { Content } from '@smui/card';
	import { afterUpdate } from 'svelte'

  export let feature
  export let userCoord
  let text

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

<div class="card-container short">
  <Card>
    <Content>{text}</Content>
  </Card>
</div>

<style>
  .card-container {
    font-family: Roboto,sans-serif;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    bottom: 8px;
  }
</style>