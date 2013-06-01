/*jshint node:true*/

'use strict';

require('domready')(function() {
	require('./controllers/visualization').ondomready();
	require('./controllers/videos').ondomready();
});
