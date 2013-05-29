/*jshint node:true*/

'use strict';

var map = require('./map');
var graph = require('./graph');

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
	var module;

	module = document.getElementById('viz');

	if (viz === 'mapa') {
		module.classList.remove('selected-graph');
		module.classList.add('selected-map');
	} else {
		graph.initdom();
		module.classList.remove('selected-map');
		module.classList.add('selected-graph');
	}
}
