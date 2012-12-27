define(function(require) {

	var Observable = require('joss/util/Observable');
	var hub = require('dojo/topic');


	var wrapped = JSON.parse(localStorage.getItem('amd-doc-filters'));

	var filters = new Observable(wrapped || {
		theme: 'dark',
		showInherited: true
	});

	filters.observers.push(function(sender) {
		hub.publish('filters:update', sender);
		localStorage.setItem('amd-doc-filters', JSON.stringify(sender));
	});

	return filters;

});
