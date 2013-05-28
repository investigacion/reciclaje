/*jshint node:true*/

'use strict';

var map = require('./map');
var translateX = require('css3-translate').x;

exports.ondomready = function() {
	map.ondomready();
	menu().addEventListener('click', function(event) {
		var hash = event.target.hash;

		if (hash) {
			toggle(hash.substr(1));
			event.preventDefault();
		}
	}, false);
};

function menu() {
	return document.querySelector('#viz .nav');
}

function toggle(viz) {
	var map, graph, module;

	map = document.getElementById('viz-map');
	graph = document.getElementById('viz-graph');
	module = document.getElementById('viz');

	if (viz === 'mapa') {
		module.classList.remove('selected-graph');
		module.classList.add('selected-map');
		translateX(map, 0);
		translateX(graph, '100%');
	} else {
		module.classList.remove('selected-map');
		module.classList.add('selected-graph');
		translateX(map, '-100%');
		translateX(graph, 0);
	}
}
