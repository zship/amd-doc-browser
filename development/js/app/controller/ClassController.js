define(function(require) {

	var $ = require('jquery');
	var declare = require('dojo/_base/declare');
	var Controller = require('joss/mvc/Controller');
	var isNumber = require('amd-utils/lang/isNumber');
	require('joss/geometry/DomRect');



	var ClassController = declare(Controller, {

		start: function() {
			this._currentModule = null;
		},


		load: function(moduleName) {
			return $.ajax({
				url: '/doc/classes/' + moduleName + '.html',
				method: 'GET'
			}).done(function(response) {
				this.contents(response);
			}.bind(this));
		},


		scrollTo: function(el) {
			if (isNumber(el)) {
				this.$root.scrollTop(el);
				return;
			}

			var scroll = this.$root.offset().top - el.offset().top;
			this.$root.scrollTop(-1 * scroll + this.$root.scrollTop() - 20);
		},


		'.constructor, .property, .method mouseenter': function(ev, tgt) {
			var srclink = $(tgt).find('.srclink');
			var permalink = $(tgt).find('.permalink');
			srclink.addClass('showing');
			permalink.addClass('showing');
		},


		'.constructor, .property, .method mouseleave': function(ev, tgt) {
			var srclink = $(tgt).find('.srclink');
			var permalink = $(tgt).find('.permalink');
			srclink.removeClass('showing');
			permalink.removeClass('showing');
		},


		'docload:module': function(name) {
			if (name === this._currentModule) {
				this.scrollTo(0);
				return;
			}

			this._currentModule = name;
			this.load(name);
		},


		'docload:property': function(parts) {
			if (parts.module === this._currentModule) {
				var anchor = this.$root.find('[rel="/#' + parts.longName + '"]');
				this.scrollTo(anchor);
				return;
			}

			this._currentModule = parts.module;
			this.load(parts.module).then(function() {
				this['docload:property'].call(this, parts);
			}.bind(this));
		}

	});

	return ClassController;

});
