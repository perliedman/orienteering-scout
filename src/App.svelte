<script>
	import Menu from './Menu.svelte'
	import { Header, Subtitle } from '@smui/drawer'
	import MapChooser from './MapChooser.svelte'
	import CrsSnack from './CrsSnack.svelte'
	import CrsDialog from './CrsDialog.svelte'
	import Map from './Map.svelte'
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
  import Drawer, {AppContent, Content, Scrim} from '@smui/drawer';
	import { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } from 'ocad2geojson'
	import { reproject, toWgs84 } from 'reproject'

	let mapInfo
	let mapGeoJson
	let mapLayers
	let drawer
	let drawerOpen = false
	let crsDialogOpen = false
	let crs = 3007
	let crsDef = '+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs '

	function loadMap(map) {
		mapInfo = {
			name: map.name
		}

		readOcad(map.content)
		.then(ocadFile => {
			mapGeoJson = toWgs84(ocadToGeoJson(ocadFile), crsDef)
			mapLayers = ocadToMapboxGlStyle(ocadFile, {source: 'map', sourceLayer: ''})
		})
	}

	function openCrsDialog () {
		crsDialogOpen = true
	}

	function setCrs ({ detail: { crs: nextCrs } }) {
		crsDialogOpen = false
		window.fetch(`https://epsg.io/${nextCrs}.proj4`)
		.then(response => response.text())
		.then(def => {
			const projected = reproject(mapGeoJson, 'EPSG:4326', crsDef)
			mapGeoJson = toWgs84(projected, def)
			crsDef = def
			crs = nextCrs
		})
		.catch(err => console.error(err))
	}
</script>

<style>
</style>

<TopAppBar variant="static" dense color="primary">
	<Row>
		<Section>
			<IconButton class="material-icons" on:click={() => drawerOpen = !drawerOpen}>menu</IconButton>
			<Title>{mapInfo && mapInfo.name || 'Orienteering Scout'}</Title>
		</Section>
	</Row>
</TopAppBar>
<Drawer variant="modal" bind:this={drawer} bind:open={drawerOpen}>
	<Header>
		<Title>Orienteering Scout</Title>
		{#if mapInfo}
			<Subtitle>{mapInfo.name}</Subtitle>
		{/if}
	</Header>
  <Content>
		<Menu
			crs={crs}
			on:close={() => drawerOpen = false}
			on:selectcrs={openCrsDialog}
			on:selectmap={() => { mapGeoJson = null; mapLayers = null; }} />
  </Content>
</Drawer>
<Scrim />
{#if (!mapGeoJson || !mapLayers)}
	<MapChooser on:mapselected={e => loadMap(e.detail)} />
{:else}
	<Map geojson={mapGeoJson} layers={mapLayers} />
	<CrsSnack crs={crs} on:changecrs={openCrsDialog} />
	<CrsDialog
		crs={crs}
		on:change={setCrs}
		on:cancel={() => { crsDialogOpen = false }}
		open={crsDialogOpen} />
{/if}
