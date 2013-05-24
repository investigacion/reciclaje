/*global d3, topojson*/

window.addEventListener('load', init, false);

function init() {
	var svg, projection, map, path, width = 960, height = 500;

	map = d3.map();
	path = d3.geo.path();

	svg = d3.select('body').append('svg')
		.attr('width', width)
		.attr('height', height);

	projection = d3.geo.albers()
		.scale(7000)
		.translate([-1200, -3100]);

	path = d3.geo.path()
		.projection(projection);
	
	// https://gist.github.com/mjhoy/5301594#file-index-html
	// http://bost.ocks.org/mike/map/
	d3.json('js/data/costarica-topo.json', function(err, data) {
		var cr = topojson.feature(data, data.objects.costarica);

		svg.append('path')
			.datum(cr)
			.attr('d', path);
	});
}
