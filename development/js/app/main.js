define(function(require) {

	var $ = require('jquery');
	var ClassController = require('./controller/ClassController');
	var TaglistController = require('./controller/TaglistController');
	var Router = require('./Router');
	var Deferreds = {
		series: require('deferreds/series')
	};



	$(document).ready(function() {
		var router = Router();
		ClassController().setRoot('#main').start();
		TaglistController().setRoot('#taglist').start();

		$.ajax({
			url: '/doc/menu.html',
			method: 'GET'
		}).done(function(response) {
		$('#modules .menu').html(response);
		});

	});

});
