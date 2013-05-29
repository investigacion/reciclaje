/*jshint node:true*/

'use strict';

var garbage = require('../../../build/costarica-garbage.json');

exports.initdom = function() {
	options();
	ranking();

	// Close a tip box when clicking outside the table.
	document.body.addEventListener('click', function(event) {
		var target = event.target;

		if (target.nodeName && target.nodeName.toLowerCase() !== 'td') {
			untip();
		}
	}, false);

	// Do nothing the next time.
	exports.initdom = function() {};
};

function options() {
	var select, frag;

	frag = document.createDocumentFragment();
	Object.keys(garbage).sort(function(a, b) {

		// Case insensitive sort by canton name.
		a = garbage[a].name.toLowerCase();
		b = garbage[b].name.toLowerCase();

		if (a < b) {
			return -1;
		}

		if (a > b) {
			return 1;
		}

		return 0;
	}).forEach(function(code) {
		var option = document.createElement('option');

		option.value = code;
		option.textContent = garbage[code].name;

		frag.appendChild(option);
	});

	select = document.getElementById('viz-graph-select');
	select.appendChild(frag);
}

function ranking() {
	var table, row;

	row = function(tr, key) {
		var frag = document.createDocumentFragment();

		Object.keys(garbage).sort(function(a, b) {
			a = parseInt(garbage[a][key], 10);
			b = parseInt(garbage[b][key], 10);

			if (a < b) {
				return -1;
			}

			if (a > b) {
				return 1;
			}

			return 0;
		}).forEach(function(code, i, codes) {
			var td = document.createElement('td');

			td.classList.add('canton');
			td.classList.add('canton-' + code);
			if (i === 0) {
				td.classList.add('first');
			} else if (i === codes.length - 1) {
				td.classList.add('last');
			}

			td.appendChild(document.createElement('span')).textContent = garbage[code].name;
			td.addEventListener('click', function(event) {
				tip(code, i + 1);
			}, false);
			td.addEventListener('mouseover', function(event) {
				tip(code, i + 1);
			}, false);

			frag.appendChild(td);
		});

		tr.appendChild(frag);
	};

	table = document.getElementById('viz-graph-general-table');
	Array.prototype.forEach.call(table.getElementsByTagName('tr'), function(tr, i) {
		switch (i) {
		case 0:
			row(tr, 'tonsPerMonth');
			break;
		case 1:
			row(tr, 'tonsRecoverablePerMonth');
			break;
		case 2:
			row(tr, 'percentLocationsSeparate');
			break;
		}
	});
}

function untip() {
	var table, box = document.getElementById('viz-graph-box');

	if (box) {
		box.parentNode.removeChild(box);
	}

	table = document.getElementById('viz-graph-general-table');

	// Can't use getElementsByClassName here because it returns a live node list (when the 'selected' class is removed it's bumped from the array).
	Array.prototype.forEach.call(table.querySelectorAll('.selected'), function(td) {
		td.classList.remove('selected');
	});
}

function tip(code, position) {
	var box, html, table, stats = garbage[code];

	untip();

	box = document.createElement('div');
	box.id = 'viz-graph-box';

	html = '<div class="ranking">Ranquin <br><span class="position">' + position + '°</span></div>';
	html += '<div class="title">' + stats.name + '</div>';
	box.innerHTML = html;

	// Append to the <span> contain of the canton cell in the first table row.
	table = document.getElementById('viz-graph-general-table');
	table.querySelector('.canton-' + code + ' span').appendChild(box);
	Array.prototype.forEach.call(table.getElementsByClassName('canton-' + code), function(td) {
		td.classList.add('selected');
	});
}
