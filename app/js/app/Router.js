define(function(require) {

	var Router = require('joss/mvc/Router');
	var hub = require('dojo/topic');


	return Router.extend({

		'*': function(fragment) {
			if (!fragment) {
				return;
			}

			if (fragment.search(/[#~\.]/g) === -1) {
				hub.publish('docload:module', fragment.replace(/^\//, ''));
			}
			else {
				var matches;
				if ((matches = fragment.match(/^\/(.*?)[#~\.](.*)$/)) !== null) {
					hub.publish('docload:property', {
						longName: matches[0].replace(/^\//, ''),
						module: matches[1],
						member: matches[2]
					});
				}
			}
		}

	});

});
