/*jshint node:true*/
/*global d3, topojson*/

'use strict';

var translateX = require('css3-translate').x;

var garbage = require('../../../build/costarica-garbage.json');
var mapId = 'visualization-map';

exports.ondomready = function() {
	var svg, projection, color, group, map, path;

	map = d3.map();
	path = d3.geo.path();

	svg = d3.select('#' + mapId).append('svg')
		.attr('id', 'visualization-map-svg');

	group = svg.append('g');

	projection = d3.geo.mercator()
		.scale(8500)
		.translate([12750, 1680]);

	path = d3.geo.path()
		.projection(projection);

	color = scale();

	var data = require('../../../build/costarica-topo.json');
	var cr = topojson.feature(data, data.objects.costarica);

	group.selectAll('path')
		.data(cr.features)
		.enter().append('path')
		.attr('d', path)
		.attr('class', 'canton')
		.style('fill', function(d) {
			var code = d.properties.code, stats = garbage[code];

			return color(parseInt(stats.percentLocationsSeparate, 10));
		})
		.style('stroke', 'white')
		.style('stroke-width', 1)
		.on('click', function(d) {
			tip(d.properties);
		});
};

function scale() {
	var min, max, percentages;

	percentages = Object.keys(garbage).map(function(code) {
		return parseInt(garbage[code].percentLocationsSeparate, 10) || 0;
	});

	min = Math.min.apply(Math, percentages);
	max = Math.max.apply(Math, percentages);

	return d3.scale.quantize()
		.domain([min, max])
		.range(['#42210A', '#ED1C23', '#F15A24', '#FF9D2E', '#D3C2B0']);
}

function tip(properties) {
	var box, old, html, stats, map, code = properties.code, id = 'visualization-map-tip';

	stats = garbage[code];
	box = document.createElement('div');
	box.id = id;
	html = '<div class="close"></div><h4 class="title">' + properties.name + '</h4><dl>';
	html += '<dt>Total toneladas de residuos por mes</dt><dd>' + stats.tonsPerMonth + '</dd>';
	html += '<dt>Toneladas de residuos valorizables por mes</dt><dd>' + stats.tonsRecoverablePerMonth + '</dd>';
	html += '<dt>Recoge residuos por separado</dt><dd>' + stats.separateAtCollection + '</dd>';
	html += '<dt>Tiene programas de reciclaje</dt><dd>' + stats.recyclingProgram + '</dd>';
	html += '<dt>Porcentaje de hogares que separan</dt><dd>' + stats.percentLocationsSeparate + '</dd></dl>';

	box.innerHTML = html;

	box.querySelector('.close').addEventListener('click', function() {
		translateX(box, '-120%');
		window.setTimeout(function() {
			box.parentNode.removeChild(box);
		}, 250);
	}, false);

	old = document.getElementById(id);
	if (old) {
		old.parentNode.replaceChild(box, old);
	} else {
		map = document.getElementById(mapId);
		translateX(box, '-120%');
		map.appendChild(box);
		window.setTimeout(function() {
			translateX(box, 0);
		}, 0);
	}
}