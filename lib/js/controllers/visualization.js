/*jshint node:true*/

'use strict';

var map = require('./map');
var graph = require('./graph');

exports.ondomready = function() {
	map.initdom();

	// Switch visualizations when click one of the visualization menu items.
	document.querySelector('#viz .nav').addEventListener('click', function(event) {
		var hash = event.target.hash;

		// Switch based on the hash part of the clicked link.
		if (hash) {
			toggle(hash.substr(1));
			event.preventDefault();
		}
	}, false);

	// Go back to the map visualization when clicking the logo.
	document.getElementById('bar-brand').addEventListener('click', goToMap, false);
};

function toggle(viz) {
	var module;

	module = document.getElementById('viz');

	if (viz === 'mapa') {
		goToMap();
	} else {
		goToGraph();
	}
}

function goToMap() {
	var module;

	module = document.getElementById('viz');

	// Toggling the classes automatically triggers the CSS3 transition.
	// The panels are 'moved' left or right using a `transform: translate` rule.
	module.classList.remove('selected-graph');
	module.classList.add('selected-map');
}

function goToGraph() {
	var module;

	module = document.getElementById('viz');

	// The graph DOM is only initialized when the graph visualization is actually selected.
	// This makes overall app startup faster on less powerful devices.
	graph.initdom();
	module.classList.remove('selected-map');
	module.classList.add('selected-graph');
}
