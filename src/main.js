// import * as buffer from 'buffer';
window.Buffer = Buffer;

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Per'
	}
});

export default app;