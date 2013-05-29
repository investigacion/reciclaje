/*jshint node:true*/

'use strict';

var garbage = require('../../../build/costarica-garbage.json');

exports.initdom = function() {
	options();
	exports.initdom = function() {};
};

function options() {
	var select, frag;

	frag = document.createDocumentFragment();
	Object.keys(garbage).sort(function(a, b) {

		// Case insensitive sort by canton name.
		a = garbage[a].name.toLowerCase();
		b = garbage[b].name.toLowerCase();
	
		if (a < b) {
			return -1;
		}
	
		if (a > b) {
			return 1;
		}
	
		return 0;
	}).forEach(function(code) {
		var option = document.createElement('option');

		option.value = code;
		option.textContent = garbage[code].name;

		frag.appendChild(option);
	});

	select = document.getElementById('viz-graph-select');
	select.appendChild(frag);
}
