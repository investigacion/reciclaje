/*jshint node:true*/
/*global d3, topojson*/

'use strict';

exports.ondomready = function() {
	var svg, projection, color, group, map, path, width = 960, height = 500;

	map = d3.map();
	path = d3.geo.path();

	svg = d3.select('body').append('svg')
		.attr('width', width)
		.attr('height', height);

	group = svg.append('g');

	projection = d3.geo.mercator()
		.scale(8500)
		.translate([12800, 1700]);

	path = d3.geo.path()
		.projection(projection);

	color = d3.scale.linear()
		.domain([1, 12])
		.range(['red', 'blue']);

	var data = require('../../../build/costarica-topo.json');
	var cr = topojson.feature(data, data.objects.costarica);
	var centered;

	group.selectAll('path')
		.data(cr.features)
		.enter().append('path')
		.attr('d', path)
		.attr('id', function(d) {
			console.log(d.properties);
		})
		.style('fill', function(d) {
			return color(Math.random() * 10);
		})
		.style('stroke', 'white')
		.style('stroke-width', 1);
/*
		.on('click', function(d) {
			var centroid, x = 0, y = 0, k = 0.3;

			if (d && centered !== d) {
				centroid = path.centroid(d);
				x = -centroid[0] + width / 4;
				y = -centroid[1] + height / 4;
				k = 2;
				centered = d;
			} else {
				centered = null;
			}
		});
*/
};
