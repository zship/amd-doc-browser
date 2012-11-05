define(function(require) {

	var $ = require('jquery');
	var declare = require('dojo/_base/declare');
	var Controller = require('joss/mvc/Controller');
	require('joss/geometry/DomRect');



	var TaglistController = declare(Controller, {

		start: function() {
			this._currentModule = null;
		},


		load: function(moduleName) {
			return $.ajax({
				url: '/doc/taglists/' + moduleName + '.html',
				method: 'GET'
			}).done(function(response) {
				this.contents(response);
				$('#header h2').text(moduleName);
			}.bind(this));
		},


		'docload:module': function(name) {
			if (name === this._currentModule) {
				return;
			}

			this._currentModule = name;
			this.load(name);
		},


		'docload:property': function(parts) {
			if (parts.module === this._currentModule) {
				return;
			}

			this._currentModule = parts.module;
			this.load(parts.module);
		}

	});

	return TaglistController;

});
