/*global d3, topojson*/

window.addEventListener('load', init, false);

function init() {
	var svg, projection, color, group, map, path, width = 960, height = 500;

	map = d3.map();
	path = d3.geo.path();

	svg = d3.select('body').append('svg')
		.attr('width', width)
		.attr('height', height);

	group = svg.append('g');

	projection = d3.geo.albers()
		.scale(7000)
		.translate([-1200, -3100]);

	path = d3.geo.path()
		.projection(projection);

	color = d3.scale.linear().domain([1, 12]).range(['red', 'blue']);

	// https://gist.github.com/mjhoy/5301594#file-index-html
	// http://bost.ocks.org/mike/map/
	// http://www.schneidy.com/Tutorials/MapsTutorial.html
	d3.json('js/data/costarica-topo.json?cb=' + Date.now(), function(err, data) {
		var cr = topojson.feature(data, data.objects.costarica);
		var centered;

		group.selectAll('path')
			.data(cr.features)
			.enter().append('path')
			.attr('d', path)
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
	});
}
