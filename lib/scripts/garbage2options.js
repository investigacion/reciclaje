/*jshint node:true*/

'use strict';

var fs = require('fs');
var csv = require('dsv').csv;

csv.parse(fs.readFileSync(__dirname + '/../data/costarica-garbage.csv', {
		encoding: 'utf8'
	}), function(d) {
	return {
		code: d.ID,
		name: d['Cantón']
	};

}).sort(function(a, b) {

	// Case insensitive sort by canton name.
	a = a.name.toLowerCase();
	b = b.name.toLowerCase();

	if (a < b) {
		return -1;
	}

	if (a > b) {
		return 1;
	}

	return 0;
}).forEach(function(row) {
	console.log('<option value="' + row.code + '">' + row.name + '</option>');
}, {});
