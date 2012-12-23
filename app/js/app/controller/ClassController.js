define(function(require) {

	var $ = require('jquery');
	var Controller = require('joss/mvc/Controller');
	var isNumber = require('amd-utils/lang/isNumber');
	var hub = require('dojo/topic');
	var Url = require('dojo/_base/url');
	require('joss/geometry/DomRect');


	var ClassController = Controller.extend({

		start: function() {
			this._currentModule = null;
			this._highlighted = null;
			console.log(this.$root.data('events'));
		},


		load: function(moduleName) {
			return $.ajax({
				url: '/doc/classes/' + moduleName + '.html',
				method: 'GET'
			}).done(function(response) {
				this.contents(response);
			}.bind(this));
		},


		'a mouseenter': function(ev, tgt) {
			if ($(tgt).is('.srclink')) {
				return false;
			}

			var url = new Url(tgt.href);
			if (url.host === window.location.host) {
				return false;
			}

			var tgtRect = $(tgt).rect();
			var rect = $('#extlink')
				.show()
				.css({
					'font-size': $(tgt).css('font-size'),
					'background-color': $(tgt).closest('.subsection').css('background-color')
				})
				.rect()
				.position({
					my: 'bottom',
					at: 'top',
					of: tgtRect
				});

			if ($(tgt).parent().parent().is('.inherit-info, .override-info, .import-info')) {
				rect.moveLeft(tgtRect.left);
			}

			rect.apply();
		},


		'a mouseleave': function() {
			$('#extlink').hide();
		},


		'{root} scroll': function() {
			$('#extlink').hide();
		},


		highlight: function(member) {
			if (this._highlighted) {
				this._highlighted.removeClass('highlight');
			}

			if (!member) {
				return;
			}

			var anchor = this.$root.find('[rel="' + member + '"]');
			/*
			 *if (!anchor.is('.subsection')) {
			 *    anchor = anchor.parent().find('.subsection').first();
			 *}
			 */
			anchor.addClass('highlight');
			this._highlighted = anchor;
		},


		'section:highlight': function(name, sender) {
			if (sender === this) {
				return;
			}

			if (!name) {
				this.highlight(null);
				return;
			}

			this.highlight(name);
		},


		scrollTo: function(el) {
			if (isNumber(el)) {
				this.$root.scrollTop(el);
				return;
			}

			var scroll = this.$root.offset().top - el.offset().top;
			this.$root.scrollTop(-1 * scroll + this.$root.scrollTop());
		},


		'.section-header mouseenter': function(ev, tgt) {
			var member = $(tgt).attr('rel');
			hub.publish('section:highlight', member, this);
		},


		'.subsection mouseenter': function(ev, tgt) {
			this.highlight(null);
			var member = $(tgt).attr('rel');
			if (!member) {
				member = $(tgt).parent().find('[rel]').attr('rel');
			}
			hub.publish('section:highlight', member, this);
		},


		'docload:module': function(name) {
			this.$root.removeClass('initial');

			if (name === this._currentModule) {
				this.scrollTo(0);
				return;
			}

			this._currentModule = name;
			this.load(name).then(function() {
				this.scrollTo(0);
			}.bind(this));
		},


		'docload:property': function(parts) {
			this.$root.removeClass('initial');

			if (parts.module === this._currentModule) {
				var anchor = this.$root.find('[rel="#' + parts.longName + '"]');
				this.highlight('#' + parts.longName);
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
