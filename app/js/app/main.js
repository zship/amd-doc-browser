define(function(require) {

	var $ = require('jquery');
	var FilterController = require('./controller/FilterController');
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
		try {
			revisions = JSON.parse(revisions);
		}
		catch(e) {
			revisions = revisions || {};
		}

		$(document).ajaxSend(function(ev, jqxhr, opts) {
			if (revisions[opts.url]) {
				opts.url = revisions[opts.url];
			}
		});

		$.ajax({
			type: 'GET',
			url: 'doc/README.html',
			dataType: 'text'
		}).then(function(readme) {
			$('#main').html(readme);
		});

		$(document).ready(function() {
			Deferreds.parallel(
				FilterController({root: '#meta'}).start(),
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
