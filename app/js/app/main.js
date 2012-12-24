define(function(require) {

	var $ = require('jquery');
	var MenuController = require('./controller/MenuController');
	var ClassController = require('./controller/ClassController');
	var TaglistController = require('./controller/TaglistController');
	var Router = require('./Router');
	var Deferreds = {
		parallel: require('deferreds/parallel')
	};


	$.ajax({
		type: 'GET',
		url: 'js/rev.json',
		dataType: 'text'
	}).always(function(revisions) {
		if (revisions) {
			revisions = JSON.parse(revisions);
		}
		revisions = revisions || {};

		$(document).ajaxSend(function(ev, jqxhr, opts) {
			if (revisions[opts.url]) {
				opts.url = revisions[opts.url];
			}
		});

		$(document).ready(function() {
			Deferreds.parallel(
				ClassController({root: '#main'}).start(),
				TaglistController({root: '#taglist'}).start(),
				MenuController({root: '#modules'}).start()
			).then(function() {
				//only initialize Router once content is in place,
				//because it will send the initial pageload fragment
				Router();
			});
		});

	});



});
