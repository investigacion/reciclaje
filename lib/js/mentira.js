/*jshint node:true*/

'use strict';

require('domready')(function() {
	require('./controllers/MapController').ondomready();
	require('./controllers/visualization').ondomready();
});
