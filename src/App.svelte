<script>
	import Mode from './Mode.svelte'
	import MapChooser from './MapChooser.svelte'
	import Map from './Map.svelte'
	import Ar from './Ar.svelte'
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
  import Drawer, {AppContent, Content, Scrim} from '@smui/drawer';
  import List, {Item, Text, Separator, Subheader} from '@smui/list';
	import { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } from 'ocad2geojson'
	import { toWgs84 } from 'reproject'

	let mapGeoJson
	let mapLayers
	let drawer
	let drawerOpen = false
	let mode = 'map'
	let selectedFeature
	// {
	// 	type: 'Feature',
	// 	properties: {},
	// 	geometry: {
	// 		type: 'Point',
	// 		coordinates: [11.942042112350464, 57.73192114398164]
	// 	}
	// }

	function loadMap(map) {
		// const projDef = '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
		const projDef = '+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs '

		readOcad(map.content)
		.then(ocadFile => {
			mapGeoJson = toWgs84(ocadToGeoJson(ocadFile), projDef)
			mapLayers = ocadToMapboxGlStyle(ocadFile, {source: 'map', sourceLayer: ''})
		})
	}

	function selectMode ({ detail: { mode: nextMode, feature }}) {
		mode = nextMode
		selectedFeature = feature
	}
</script>

<style>
</style>

<TopAppBar variant="static" dense color="primary">
	<Row>
		<Section>
			<IconButton class="material-icons" on:click={() => drawerOpen = !drawerOpen}>menu</IconButton>
			<Title>Orienteering Scout</Title>
		</Section>
	</Row>
</TopAppBar>
<Drawer variant="modal" bind:this={drawer} bind:open={drawerOpen}>
  <Content>
    <List>
      <Item href="javascript:void(0)">
        <Text>Main</Text>
      </Item>
      <Item href="javascript:void(0)">
        <Text>Other</Text>
      </Item>
    </List>
  </Content>
</Drawer>
<Scrim />
{#if (!mapGeoJson || !mapLayers)}
	<MapChooser on:mapselected={e => loadMap(e.detail)} />
{:else}
	<Mode {mode} name="map">
		<Map
			geojson={mapGeoJson}
			layers={mapLayers}
			on:selectmode={selectMode} />
	</Mode>
	<Mode {mode} name="ar">
		{#if selectedFeature}
			<Ar features={[selectedFeature]}></Ar>
		{/if}
	</Mode>
{/if}
