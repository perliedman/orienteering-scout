// import * as buffer from 'buffer';
window.Buffer = Buffer;

import App from './App.svelte';
import Ar from './Ar.svelte';

const app = new App({
	target: document.body,
	props: {
		features: [{
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'Point',
				coordinates: [11.942042112350464, 57.73192114398164]
			}
		}]
	}
});

export default app;