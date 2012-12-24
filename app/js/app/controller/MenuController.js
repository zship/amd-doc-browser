define(function(require) {

	var $ = require('jquery');
	var Controller = require('joss/mvc/Controller');
	require('joss/geometry/DomRect');



	var MenuController = Controller.extend({

		start: function() {
			this._currentModule = null;
			this._highlighted = null;

			return $.ajax({
				url: 'doc/menu.html',
				method: 'GET'
			}).done(function(response) {
				this.$root.find('.menu').html(response);
			}.bind(this));
		},


		highlight: function(module) {
			if (this._highlighted) {
				this._highlighted.removeClass('highlight');
			}

			if (!module) {
				return;
			}

			var anchor = this.$root.find('[href="' + module + '"]');
			anchor.addClass('highlight');
			this._highlighted = anchor;
		},


		'docload:module': function(name) {
			this._currentModule = name;
			this.highlight('/#/' + name);
		},


		'docload:property': function(parts) {
			if (parts.module === this._currentModule) {
				return;
			}

			this._currentModule = parts.module;
			this.highlight('/#/' + parts.module);
		}


	});

	return MenuController;

});
