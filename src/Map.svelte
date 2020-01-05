<script>
  import LinearProgress from '@smui/linear-progress';
	import { onMount, afterUpdate } from 'svelte'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import bbox from '@turf/bbox'
  import AutoRotateControl from './auto-rotate-control'
  import FeatureInfo from './FeatureInfo.svelte'

  mapboxgl.accessToken = '__mapboxGlToken__'

  export let geojson
  export let layers

  let mapContainer
  let map
  let currentGeojson
  let snackbar
  let mapLoaded
  let highlightColor = '#f64'
  let highlightOpacity = 0.9
  let userCoord
  let userBearing
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
  let style = {
    version: 8,
    name: 'OCAD demo',
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    sources: {
      map: {
        type: 'geojson',
        data: geojson
      }
    },
    layers: [...layers, ...highlights]
  }
  let bounds = bbox(geojson)
  let highlighted

  onMount(() => {
    currentGeojson = geojson

    map = new mapboxgl.Map({
      container: mapContainer,
      style,
      center: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2],
      zoom: 14
    })

    map.addControl(new mapboxgl.NavigationControl({showZoom: false}))

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
    geolocateControl.on('geolocate', e => userCoord = [e.coords.longitude, e.coords.latitude])
    map.addControl(geolocateControl);

    const autoRotateControl = new AutoRotateControl()
    autoRotateControl.on('bearing', e => userBearing = e.bearing)
    autoRotateControl.on('disable', e => userBearing = undefined)
    map.addControl(autoRotateControl)

    map.on('load', () => {
      mapLoaded = true
      map.fitBounds(bounds)
    })

    map.on('click', e => {
      const features = map.queryRenderedFeatures(e.point)

      ;['Point', 'LineString', 'Polygon'].forEach(t =>
        map.setFilter(`highlighted-${t}`, ['==', ['id'], '']))

      if (features.length > 0) {
        const feature = features[0]
        const highlightLayer = `highlighted-${feature.geometry.type}`
        const filterExpr = feature.properties.parentId
          ? ['get', 'parentId']
          : ['id']
        const filterId = feature.properties.parentId
          ? feature.properties.parentId
          : feature.id
        map.setFilter(highlightLayer, ['==', filterExpr, filterId])
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
  })

  afterUpdate(() => {
    if (map && currentGeojson !== geojson) {
      map.getSource('map').setData(geojson)
      currentGeojson = geojson
      map.fitBounds(bbox(geojson))
    }
  })

</script>

<style>
  .map-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>

<div class="map-container" bind:this={mapContainer}></div>
{#if highlighted}
  <FeatureInfo feature={highlighted} userCoord={userCoord} userBearing={userBearing} />
{/if}
{#if !mapLoaded}
  <LinearProgress indeterminate />
{/if}
