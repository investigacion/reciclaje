/*jshint node:true*/

'use strict';

var garbage = require('../../../build/costarica-garbage.json');
var indices = require('../../../build/costarica-indices.json');

exports.initdom = function() {
	options();
	ranking();
	menu();

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

function menu() {
	var nav = document.getElementById('viz-graph-menu');

	nav.querySelector('.nav-item.canton').addEventListener('click', function(event) {
		event.preventDefault();
		canton();
	}, false);
	nav.querySelector('.nav-item.general').addEventListener('click', function(event) {
		var container;
		event.preventDefault();

		// Switch the selection classes.
		container = document.getElementById('viz');
		if (!container.classList.contains('general-selected')) {
			container.classList.remove('canton-selected');
			container.classList.add('general-selected');
		}
	}, false);
}

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
	select.addEventListener('change', canton, false);
}

function ranking() {
	var table, row;

	row = function(tr, key) {
		var frag = document.createDocumentFragment();

		Object.keys(garbage).sort(function(a, b) {

			// Sort by value (highest to lowest).
			// Position items with no data at the back of the list instead of excluding them (hence the || 0).
			a = parseInt(garbage[a][key], 10) || 0;
			b = parseInt(garbage[b][key], 10) || 0;

			if (a < b) {
				return 1;
			}

			if (a > b) {
				return -1;
			}

			return 0;
		}).forEach(function(code, i, codes) {
			var position, span, td = document.createElement('td');

			td.classList.add('canton');
			td.classList.add('canton-' + code);
			if (i === 0) {
				td.classList.add('first');
			} else if (i === codes.length - 1) {
				td.classList.add('last');
			}

			position = i + 1;
			span = document.createElement('span');
			span.textContent = garbage[code].name;
			span.setAttribute('data-position', position);

			td.appendChild(span);
			td.addEventListener('click', function(event) {
				tip(code, position);
			}, false);
			td.addEventListener('mouseover', function(event) {
				tip(code, position);
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

function canton() {
	var container, select, code, garbageStats, indexStats;

	select = document.getElementById('viz-graph-select');
	if (!select.selectedIndex) {
		select.selectedIndex = 61; // San José
	}

	code = select.options[select.selectedIndex].value;
	garbageStats = garbage[code];
	indexStats = indices[code];

	// Switch the selection classes.
	container = document.getElementById('viz');
	if (!container.classList.contains('canton-selected')) {
		container.classList.remove('general-selected');
		container.classList.add('canton-selected');
	}

	var garbageStat = function(i, percentage) {
		var mercuryEl, values, half, median, medianEl;

		// Calculate the median.
		values = Object.keys(garbage).map(function(code) {
			return parseInt(garbage[code].percentLocationsSeparate, 10);
		}).filter(function(value) {
			return !isNaN(value);
		}).sort(function(a, b) {
			return a - b;
		});

		half = Math.floor(values.length / 2);
		if (values.length % 2) {
			median = values[half];
		} else {
			median = (values[half-1] + values[half]) / 2;
		}

		// Read.
		mercuryEl = container.querySelector('.stat-1 .mercury');
		medianEl = container.querySelector('.stat-1 .median');

		// Write.
		medianEl.style.bottom = median + '%';
		medianEl.setAttribute('data-median', median + '% mediana del país');
		percentage = parseInt(percentage, 10) + '%';
		mercuryEl.style.height = percentage;
		mercuryEl.setAttribute('data-percentage', percentage);
	};

	var indexStat = function(i, percentage) {
		var mercury = container.querySelector('.stat-' + i + ' .mercury');
		percentage = Math.round(percentage);
		mercury.style.height = percentage + '%';
		mercury.setAttribute('data-percentage', percentage);
	};

	garbageStat(1, garbageStats.percentLocationsSeparate);
	indexStat(2, indexStats.hdPercentage);
	indexStat(3, indexStats.lifeExpectancyPercentage);
	indexStat(4, indexStats.educationPercentage);
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

	html = '<div class="close"></div><div class="ranking">Ranking <br><span class="position">' + position + '°</span></div>';
	html += '<div class="title">' + stats.name + '</div>';
	box.innerHTML = html;

	table = document.getElementById('viz-graph-general-table');

	// Append to the <span> contain of the canton cell in the first table row.
	// But only or medium+ screen devices (hack - this should be moved to CSS).
	if (window.innerWidth > 640) {
		table.querySelector('.canton-' + code + ' span').appendChild(box);
	} else {
		document.body.appendChild(box);
	}

	Array.prototype.forEach.call(table.getElementsByClassName('canton-' + code), function(td) {
		td.classList.add('selected');
	});
}
