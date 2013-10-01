/*jshint node:true*/
/*global d3, topojson*/

'use strict';

var hammer = require('hammerjs');
var translate = require('css3-translate');

var garbage = require('../../../../reciclaje-data/data/json/reciclaje.json');
var mapId = 'viz-map';
var mapSvgId = 'viz-map-svg';
var mapKey = 'percentageRecovarablePerMonth';

exports.initdom = function() {
	var map, scaled = false, translateRule = translate.rule(), debounceTimeout = null;

	var scaleIn = function() {
		document.getElementById(mapSvgId).style[translateRule] = 'scale(2, 2)';
		scaled = true;
	};

	var scaleOut = function() {
		document.getElementById(mapSvgId).style[translateRule] = 'scale(1, 1)';
		scaled = false;
	};

	makeMap();

	// Add hammer gestures.
	map = document.getElementById(mapId);
	hammer(map).on('pinchin ', scaleIn).on('pinchout', scaleOut).on('doubletap', function() {
		if (scaled) {
			scaleOut();
		} else {
			scaleIn();
		}
	});

	// Remake the map on resize.
	window.addEventListener('resize', function() {
		if (debounceTimeout !== null) {
			clearTimeout(debounceTimeout);
		}

		debounceTimeout = window.setTimeout(function() {
			var mapSvg;

			debounceTimeout = null;
			mapSvg = document.getElementById(mapSvgId);
			if (mapSvg) {
				mapSvg.parentNode.removeChild(mapSvg);
			}

			makeMap();
		}, 200);
	}, false);
};

function mapProjection() {
	var width, svg, vizs;

	svg = document.getElementById(mapSvgId);
	width = Math.min(510, svg.parentNode.clientWidth);

	svg.style.height = width + 'px';
	svg.style.width = width + 'px';

	vizs = document.getElementById('vizs');
	vizs.style.height = (width - 100) + 'px';

	return d3.geo.mercator()
		.scale(width * 16.667)
		.translate([width * 25, width * 3.294]);
}

function makeMap() {
	var svg, projection, color, group, map, path, data, cr;

	map = d3.map();
	path = d3.geo.path();

	svg = d3.select('#' + mapId).append('svg')
		.attr('id', mapSvgId);

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

	projection = mapProjection();

	path = d3.geo.path()
		.projection(projection);

	color = scale();

	data = require('../../../build/costarica-topo.json');
	cr = topojson.feature(data, data.objects.costarica);

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

	legend(color);
}

function scale() {
	var values, colors;

	values = Object.keys(garbage).reduce(function(p, c, i, a) {
		var stat = parseInt(garbage[c][mapKey], 10);

		if (!isNaN(stat)) {
			p.push(stat);
		}

		return p;
	}, []);

	colors = ['#42210A', '#ED1C23', '#F15A24', '#FF9D2E', '#D3C2B0'].reverse();

	return d3.scale.quantile()
		.domain(values)
		.range(colors);
}

function legend(scale) {
	var legendEl, legendFrag, colors;

	legendEl = document.querySelector('#viz-map-legend > ul');
	if (legendEl.children.length > 0) {

		// Already done.
		return;
	}

	// Dynamically build the map legend from the D3 scale domain and range values.
	colors = scale.domain().reduce(function(colors, value) {
		var color = scale(value);

		if (colors[color]) {
			colors[color].push(value);
		} else {
			colors[color] = [value];
		}

		return colors;
	}, {});

	legendFrag = document.createDocumentFragment();
	Object.keys(colors).forEach(function(color) {
		var colorEl, minVal, maxVal, values = colors[color];

		minVal = values[0];
		maxVal = values[values.length - 1];

		colorEl = document.createElement('li');
		colorEl.style.borderLeftColor = color;
		if (minVal === maxVal) {
			colorEl.textContent = minVal;
		} else {
			colorEl.textContent = minVal + ' - ' + maxVal;
		}

		legendFrag.appendChild(colorEl);
	});
	
	legendEl.appendChild(legendFrag);
}

function fill(code, color) {
	var stats = garbage[code], stat = parseInt(stats[mapKey], 10);

	// Apply the 'stripe' filter to the path if no data is available.
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
	html += '<dt>Toneladas recicladas por mes</dt><dd>' + stats.tonsRecoverablePerMonth + '</dd>';
	html += '<dt>Porcentaje recicladas por mes</dt><dd>' + stats.percentageRecovarablePerMonth + '</dd>';
	html += '<dt>Recoge residuos por separado en casas</dt><dd>' + stats.separateAtCollection + '</dd>';
	html += '<dt>Tiene programas de reciclaje</dt><dd>' + stats.recyclingProgram + '</dd>';
	html += '<dt>Porcentaje de hogares que separan</dt><dd>' + stats.percentLocationsSeparate + '</dd></dl>';
	if (stats.notes) {
		html += '<p class="notes">' + stats.notes + '</p>';
	}
	html += '<p class="notes">nd = no se obtuvieron datos</p>';

	box.innerHTML = html;

	box.querySelector('.close').addEventListener('click', function() {
		translate.x(box, '-120%');
		window.setTimeout(function() {
			box.parentNode.removeChild(box);
		}, 250);
	}, false);

	old = document.getElementById(id);
	if (old) {
		old.parentNode.replaceChild(box, old);
	} else {
		map = document.getElementById(mapId);
		translate.x(box, '-120%');
		map.appendChild(box);
		window.setTimeout(function() {
			translate.x(box, 0);
		}, 0);
	}
}
