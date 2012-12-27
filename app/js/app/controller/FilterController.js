define(function(require) {

	var $ = require('jquery');
	var Controller = require('joss/mvc/Controller');
	var isNumber = require('amd-utils/lang/isNumber');
	var hub = require('dojo/topic');
	var Url = require('dojo/_base/url');
	require('joss/geometry/DomRect');


	var FilterController = Controller.extend({

		start: function() {
			this._filters = JSON.parse(localStorage.getItem('amd-doc-filters')) || {
				theme: 'dark',
				showInherited: true
			};
			this.update();
		},


		update: function() {
			console.log('filter update');
			localStorage.setItem('amd-doc-filters', JSON.stringify(this._filters));

			if (!$('body').hasClass(this._filters.theme)) {
				$('body').removeClass().addClass(this._filters.theme);
			}
			
			if (this._filters.showInherited) {
				$('#taglist').find('li.inherited').show();
				$('#main').find('.subsection.inherited').show();
			}
			else {
				this.$root.find('.inherited').prop('checked', true);
				$('#taglist').find('li.inherited').hide();
				$('#main').find('.subsection.inherited').hide();
			}
		},


		'class:load': function() {
			this.update();
		},


		'taglist:load': function() {
			this.update();
		},


		'.toggle click': function(ev, tgt) {
			this.$root.toggleClass('active');
		},


		'{body} click': function(ev, tgt) {
			if (!this.$root.hasClass('active')) {
				return;
			}

			var curr = $(ev.target);
			if (curr.closest('#meta').length === 0) {
				this.$root.toggleClass('active');
			}
		},


		'.swatch click': function(ev, tgt) {
			if ($(tgt).hasClass('light')) {
				this._filters.theme = 'light';
			}
			else if ($(tgt).hasClass('dark')) {
				this._filters.theme = 'dark';
			}

			this.update();
		},


		'.inherited change': function(ev, tgt) {
			if ($(tgt).is(':checked')) {
				this._filters.showInherited = false;
			}
			else {
				this._filters.showInherited = true;
			}

			this.update();
		}



	});

	return FilterController;

});
