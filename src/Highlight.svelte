<script>
  import { getContext } from 'svelte'
  import { mapboxgl, key } from './mapbox'
  import FeatureInfo from './FeatureInfo.svelte'

  const highlightColor = '#f64'
  const highlightOpacity = 0.9

  export let userCoord
  export let userBearing
  let highlighted
  let highlights = [
    {
      'id': 'highlighted-Polygon',
      'type': 'fill',
      'source': 'map',
      'paint': {
        'fill-outline-color': highlightColor,
        'fill-color': highlightColor,
        'fill-opacity': highlightOpacity
      },
      'filter': ['==', ['id'], '']
    },
    {
      'id': 'highlighted-LineString',
      'type': 'line',
      'source': 'map',
      'paint': {
        'line-color': highlightColor,
        'line-width': 10,
        'line-opacity': highlightOpacity
      },
      'filter': ['==', ['id'], '']
    },
    {
      'id': 'highlighted-Point',
      'type': 'circle',
      'source': 'map',
      'paint': {
        'circle-color': highlightColor,
        'circle-opacity': highlightOpacity,
        'circle-radius': 10,
      },
      'filter': ['==', ['id'], '']
    }
  ]

  const context = getContext(key)
  const map = context.getMap()

  map.on('load', () => highlights.forEach(layer => map.addLayer(layer)))

  map.on('click', e => {
    const features = map.queryRenderedFeatures(e.point)

    ;['Point', 'LineString', 'Polygon'].forEach(t =>
      map.setFilter(`highlighted-${t}`, ['==', ['id'], '']))

    if (features.length > 0) {
      const feature = features.find(f => f.layer && f.layer.metadata)
      const highlightLayer = `highlighted-${feature.geometry.type}`
      const filterId = feature.properties.parentId
        ? feature.properties.parentId
        : feature.id
      const filterExpr = [
        'any', 
        ['==', ['id'], filterId], 
        ['==', ['get', 'parentId'], filterId]
      ]
      map.setFilter(highlightLayer, filterExpr)
      highlighted = {
        type: 'Feature',
        properties: {
          name: feature.layer.metadata.description
        },
        geometry: feature.geometry
      }
    } else {
      highlighted = null
    }
  })
</script>

{#if highlighted}
  <FeatureInfo feature={highlighted} userCoord={userCoord} userBearing={userBearing} />
{/if}
