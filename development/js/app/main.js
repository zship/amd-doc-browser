define(function(require) {

	var $ = require('jquery');
	var MenuController = require('./controller/MenuController');
	var ClassController = require('./controller/ClassController');
	var TaglistController = require('./controller/TaglistController');
	var Router = require('./Router');
	var Deferreds = {
		parallel: require('deferreds/parallel')
	};



	$(document).ready(function() {
		Deferreds.parallel(
			ClassController().setRoot('#main').start(),
			TaglistController().setRoot('#taglist').start(),
			MenuController().setRoot('#modules').start()
		).then(function() {
			//only initialize Router once content is in place,
			//because it will send the initial pageload fragment
			Router();
		});
	});

});
