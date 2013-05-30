/*jshint node:true*/

'use strict';

var fs = require('fs');
var csv = require('dsv').csv;

var hash = csv.parse(fs.readFileSync(__dirname + '/../data/costarica-indices.csv', {
		encoding: 'utf8'
	}), function(d) {
	return {
		code: d.code,
		hdIndex: index(d['human development index']),
		hdPercentage: percentage(d['human development percentage']),
		educationIndex: index(d['education index']),
		educationPercentage: percentage(d['education percentage']),
		lifeExpectancyIndex: index(d['life expectancy index']),
		lifeExpectancyPercentage: percentage(d['life expectancy percentage'])
	};

}).reduce(function(hash, row) {
	hash[row.code] = row;
	delete row.code;

	return hash;
}, {});

function index(figure) {
	return parseInt(figure, 10);
}

function percentage(figure) {

	// Format percentages for output.
	return parseInt(figure, 10) / 10;
}

console.log(JSON.stringify(hash, null, '\t'));
