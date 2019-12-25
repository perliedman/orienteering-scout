<script>
	import MapChooser from './MapChooser.svelte'
	import Map from './Map.svelte'
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
	import { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } from 'ocad2geojson'
	import { toWgs84 } from 'reproject'

	let mapGeoJson
	let mapLayers

	function loadMap(map) {
		const projDef = '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'

		readOcad(map.content)
		.then(ocadFile => {
			mapGeoJson = toWgs84(ocadToGeoJson(ocadFile), projDef)
			mapLayers = ocadToMapboxGlStyle(ocadFile, {source: 'map', sourceLayer: ''})
		})
	}
</script>

<style>
</style>

<TopAppBar variant="static" dense color="primary">
	<Row>
		<Section>
			<IconButton class="material-icons">menu</IconButton>
			<Title>Orienteering Scout</Title>
		</Section>
	</Row>
</TopAppBar>
{#if (!mapGeoJson || !mapLayers)}
<MapChooser on:mapselected={e => loadMap(e.detail)} />
{:else}
<Map geojson={mapGeoJson} layers={mapLayers} />
{/if}
