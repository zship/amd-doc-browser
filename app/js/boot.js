require.config({

	baseUrl: '/js/',

	packages: [
		{ name: 'app', location: 'app' }
	],

	paths: {
		'require': './require.js',
		'jquery': 'jquery-1.7.2',
		'jquery.hashchange': 'jquery.ba-hashchange',
		'jquery.event.input': 'jquery/jquery.event.input',
		'jquery.event.drag': 'jquery/jquery.event.drag-2.0'
	},

	shim: {
		'jquery.hashchange': ['jquery']
	}

});

window.require(['app']);
