/* global define, jQuery */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "jquery" ], factory );
	} else {
		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {
	'use strict';

	var PREVIOUS_SELECTED_CLASS = 'ui-multisortable-previous',
      PREVIOUS_SELECTED_SELECTOR = '.' + PREVIOUS_SELECTED_CLASS;

	$.widget('ui.multisortable', $.ui.sortable, {
		version: '0.0.1',
		widgetEventPrefix: 'multisort',
		ready: false,
		options: {
			selectedClass: 'ui-multisortable-selected',
			distance: 3
		},
		_create: function () {
			this.element
				.on('click.' + this.widgetName, this._mouseClick.bind(this))
				.disableSelection();

			this._superApply(arguments);
		},
		_clearPreviousSelected: function() {
			this.element.find(this.options.items).removeClass(PREVIOUS_SELECTED_CLASS);
		},
		_uiHash: function(_inst) {
		  var placeholderClass = this.options
			var hash = this._super(_inst);
			var item = this.element.find('.' + this.options.selectedClass);

			if(item.length > 0) {
				hash.item = item;
			}
			return hash;
		},
		_mouseClick: function (e) {
			var item = $(e.target).closest('li');
			if (item.length === 0) {
				return;
			}

			var SELECTED_CLASS = this.options.selectedClass,
				parent = item.parent();

			// If item wasn't dragged and is not multiselected, it should reset selection for other items.
			if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
				parent.find('.' + PREVIOUS_SELECTED_CLASS).removeClass(PREVIOUS_SELECTED_CLASS);
				parent.find('.' + SELECTED_CLASS).removeClass(SELECTED_CLASS);
				item.addClass(SELECTED_CLASS).addClass(PREVIOUS_SELECTED_CLASS);
			}
		},
		_mouseDown: function (e) {
			var item = $(e.target).closest('li');
			if (item.length === 0) {
				return;
			}
			

			var parent = item.parent(),
				currentIndex = item.index(),
				SELECTED_CLASS = this.options.selectedClass,
				SELECTED_SELECTOR = '.' + SELECTED_CLASS,
				prevItem = parent.find(PREVIOUS_SELECTED_SELECTOR);

			// If no previous selection found, start selecting from first selected item.
			prevItem = prevItem.length ? prevItem : $(parent.find('.' + SELECTED_CLASS)[0]).addClass(PREVIOUS_SELECTED_CLASS);

			var prevIndex = prevItem.index();

			if (e.ctrlKey || e.metaKey) {
				if (item.hasClass(SELECTED_CLASS)) {
					// If the item is selected, deselect and try to remove previous selected mark on it
					item.removeClass(SELECTED_CLASS).removeClass(PREVIOUS_SELECTED_CLASS);
				} else {
					// If the item is not selected, select and reset previous selected mark on it
					parent.find(PREVIOUS_SELECTED_SELECTOR).removeClass(PREVIOUS_SELECTED_CLASS);
					item.addClass(SELECTED_CLASS).addClass(PREVIOUS_SELECTED_CLASS);
				}
			} else if (e.shiftKey) {
				// Deselect all selected items
				parent.find(SELECTED_SELECTOR).removeClass(SELECTED_CLASS);

				var shiftRange;
				// Calculate shift select range
				if (prevIndex <= currentIndex) {
					shiftRange = item.prevUntil(PREVIOUS_SELECTED_SELECTOR);
				} else if (prevIndex > currentIndex) {
					shiftRange = item.nextUntil(PREVIOUS_SELECTED_SELECTOR);
				}
				// Select all items in shift select range
				shiftRange.add(prevItem).add(item).addClass(SELECTED_CLASS);
			} else {
				// Single select
				parent.find(PREVIOUS_SELECTED_SELECTOR).removeClass(PREVIOUS_SELECTED_CLASS);
				if (!item.hasClass(SELECTED_CLASS)) {
					parent.find(SELECTED_SELECTOR).removeClass(SELECTED_CLASS);
					item.addClass(SELECTED_CLASS).addClass(PREVIOUS_SELECTED_CLASS);
				}
			}

			this._superApply(arguments);
		}
	});
}));

