/*jshint node:true*/

'use strict';

var translateX = require('css3-translate').x;

exports.ondomready = function() {
	var navMenu;

	navMenu = document.querySelector('#visualization .nav');
	navMenu.addEventListener('click', function(event) {
		var hash = event.target.hash;

		if (hash) {
			toggle(hash.substr(1));
			event.preventDefault();
		}
	}, false);
};

function toggle(viz) {
	var map, graph;

	map = document.getElementById('visualization-map');
	graph = document.getElementById('visualization-graph');

	if (viz === 'mapa') {
		translateX(map, 0);
		translateX(graph, '100%');
	} else {
		translateX(map, '-100%');
		translateX(graph, 0);
	}
}
