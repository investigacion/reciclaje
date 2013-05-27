/*jshint node:true*/

'use strict';

var map = require('./map');
var translateX = require('css3-translate').x;

exports.ondomready = function() {
	map.ondomready();
	menu().addEventListener('click', function(event) {
		var hash = event.target.hash;

		if (hash) {
			toggle(hash.substr(1), event.target);
			event.preventDefault();
		}
	}, false);
};

function menu() {
	return document.querySelector('#viz .nav');
}

function toggle(viz, anchor) {
	var map, graph;

	map = document.getElementById('viz-map');
	graph = document.getElementById('viz-graph');

	menu().querySelector('.selected').classList.remove('selected');
	anchor.parentNode.classList.add('selected');

	if (viz === 'mapa') {
		translateX(map, 0);
		translateX(graph, '100%');
	} else {
		translateX(map, '-100%');
		translateX(graph, 0);
	}
}
