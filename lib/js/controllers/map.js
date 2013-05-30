/*jshint node:true*/
/*global d3, topojson*/

'use strict';

var translateX = require('css3-translate').x;

var garbage = require('../../../build/costarica-garbage.json');
var mapId = 'viz-map';
var mapKey = 'tonsPerMonth';

exports.initdom = function() {
	var svg, projection, color, group, map, path;

	map = d3.map();
	path = d3.geo.path();

	svg = d3.select('#' + mapId).append('svg')
		.attr('id', 'viz-map-svg');

	// Add an SVG pattern for cantons with null data.
	// http://commons.oreilly.com/wiki/index.php/SVG_Essentials/Patterns_and_Gradients
	svg.append('defs')
		.append('pattern')
		.attr('id', 'stripe')
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', 6)
		.attr('height', 2)
		.append('path')
		.attr('d', 'M 0 0 6 0')
		.style('stroke', '#D3C2B0')
		.style('fill', 'none');

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
			return fill(d.properties.code, color);
		})
		.on('click', function(d) {
			tip(d.properties);
		});
};

function scale() {
	var values;

	values = Object.keys(garbage).reduce(function(p, c, i, a) {
		var stat = parseInt(garbage[c][mapKey], 10);

		if (!isNaN(stat)) {
			p.push(stat);
		}

		return p;
	}, []);

	return d3.scale.quantile()
		.domain(values)
		.range(['#42210A', '#ED1C23', '#F15A24', '#FF9D2E', '#D3C2B0'].reverse());
}

function fill(code, color) {
	var stats = garbage[code], stat = parseInt(stats[mapKey], 10);

	if (isNaN(stat)) {
		return 'url(#stripe)';
	}

	return color(stat);
}

function tip(properties) {
	var box, old, html, stats, map, code = properties.code, id = 'viz-map-tip';

	stats = garbage[code];
	box = document.createElement('div');
	box.id = id;
	html = '<div class="close"></div><h4 class="title">' + stats.name + '</h4><dl>';
	html += '<dt>Toneladas recolectadas por mes</dt><dd>' + stats.tonsPerMonth + '</dd>';
	html += '<dt>Toneladas reciclados por mes</dt><dd>' + stats.tonsRecoverablePerMonth + '</dd>';
	html += '<dt>Recoge residuos por separado en casas</dt><dd>' + stats.separateAtCollection + '</dd>';
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
