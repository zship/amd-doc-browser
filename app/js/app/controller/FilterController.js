define(function(require) {

	var $ = require('jquery');
	var Controller = require('joss/mvc/Controller');
	var filters = require('../filters');
	require('joss/geometry/DomRect');


	var FilterController = Controller.extend({

		start: function() {
			this.render();
		},


		render: function() {
			if (!$('body').hasClass(filters.theme)) {
				$('body').removeClass().addClass(filters.theme);
			}

			if (!filters.showInherited) {
				this.$root.find('.inherited').prop('checked', true);
			}
		},


		'filters:update': function() {
			this.render();
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
				filters.theme = 'light';
			}
			else if ($(tgt).hasClass('dark')) {
				filters.theme = 'dark';
			}
		},


		'.inherited change': function(ev, tgt) {
			if ($(tgt).is(':checked')) {
				filters.showInherited = false;
			}
			else {
				filters.showInherited = true;
			}
		}

	});


	return FilterController;

});
