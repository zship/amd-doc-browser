define(function(require) {

	var $ = require('jquery');
	var Controller = require('joss/mvc/Controller');
	var hub = require('dojo/topic');
	require('joss/geometry/DomRect');



	var TaglistController = Controller.extend({

		start: function() {
			this._currentModule = null;
		},


		load: function(moduleName) {
			return $.ajax({
				url: '/doc/taglists/' + moduleName + '.html',
				method: 'GET'
			}).done(function(response) {
				this.contents(response);
				var moduleInfo = this.$root.find('h2:first').html();
				$('#header h2').html(moduleInfo);
			}.bind(this));
		},


		highlight: function(member) {
			this.$root.find('.highlight').removeClass('highlight');

			if (!member) {
				return;
			}

			var anchor = this.$root.find('[href="' + member + '"]');
			anchor.parent().addClass('highlight');
		},


		'section:highlight': function(name, sender) {
			if (sender === this) {
				return;
			}

			this.highlight(name);
		},


		'{root} mouseenter': function() {
			this.highlight(null);
		},


		'{root} mouseleave': function() {
			this.highlight(null);
			hub.publish('section:highlight', null, this);
		},


		'a mouseenter': function(ev, tgt) {
			var member = $(tgt).attr('href');
			hub.publish('section:highlight', member, this);
		},


		'docload:module': function(name) {
			if (name === this._currentModule) {
				this.highlight();
				return;
			}

			this._currentModule = name;
			this.load(name).then(function() {
				this.highlight();
			}.bind(this));
		},


		'docload:property': function(parts) {
			if (parts.module === this._currentModule) {
				this.highlight('#' + parts.longName);
				return;
			}

			this._currentModule = parts.module;
			this.load(parts.module).then(function() {
				this.highlight('#' + parts.longName);
			}.bind(this));
		}

	});

	return TaglistController;

});
