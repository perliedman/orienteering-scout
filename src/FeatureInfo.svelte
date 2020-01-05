<script>
  import distance from '@turf/distance'
  import pointToLineDistance from '@turf/point-to-line-distance'
  import polygonToLine from '@turf/polygon-to-line'
  import bearing from '@turf/bearing'
  import nearestPointOnLine from '@turf/nearest-point-on-line'
  import Card, { Content } from '@smui/card';
  import { beforeUpdate } from 'svelte'

  export let feature
  export let userCoord
  export let userBearing
  let text
  let objBearing

  beforeUpdate(() => {
    if (feature) {
      let fDistance
      if (userCoord) {
        try {
          [fDistance, objBearing] = getDistance()
        } catch (e) {
          console.error(e)
        }
      }

      objBearing -= userBearing || 0

      text = feature && 
        feature.properties.name + 
        (fDistance ? ', ' + formatDistance(fDistance) : '')
    }
  })

  function getDistance () {
    const { geometry } = feature
    switch (geometry.type) {
      case 'Point':
        return [
          distance(userCoord, geometry.coordinates),
          bearing(userCoord, geometry.coordinates)
        ]
      case 'LineString':
        return [
          pointToLineDistance(userCoord, feature),
          bearing(userCoord, nearestPointOnLine(feature, userCoord))
        ]
      case 'Polygon':
        const line = polygonToLine(feature)
        return [
          pointToLineDistance(userCoord, line),
          bearing(userCoord, nearestPointOnLine(line, userCoord))
        ]
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

  function formatBearing (b) {
    while (b < 0) {
      b += 360
    }
    while (b > 360) {
      b -= 360
    }
    return b.toFixed(0) + '°'    
  }
</script>

<div class="card-container short">
  <Card>
    <Content>
      {text}
      {#if !isNaN(objBearing)}
        <span class="bearing" style={`transform: rotate(${objBearing}deg);`}>↑</span>
      {/if}
    </Content>
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

  .bearing {
    display: inline-block;
    font-size: 250%;
    font-weight: bolder;
    margin-left: 16px;
    vertical-align: middle;
  }
</style>