/*jshint node:true*/

'use strict';

var videos = [

	// Infografica
	{
		rtsp: 'rtsp://a753.v78192c.c78192.g.vq.akamaistream.net/7/753/78192/v0001/admotion.download.akamai.com/91702/Assets/10172/mp4/388735.mp4',
		m3u8: 'http://atvhd-f.akamaihd.net/i/Assets/10172/mp4/388736.mp4/master.m3u8',
		swf: 'http://takeout.dmmotion.com/Delivery/Asset/224/388737/autoInit=0/showSkin=1/idSkin=330/showTitle=0/showDescription=0/branch=tv_core_osfm.swf'
	},

	// Reciclaje Dota
	{
		rtsp: 'rtsp://a753.v78192c.c78192.g.vq.akamaistream.net/7/753/78192/v0001/admotion.download.akamai.com/91702/Assets/10172/mp4/388664.mp4',
		m3u8: 'http://atvhd-f.akamaihd.net/i/Assets/10172/mp4/388665.mp4/master.m3u8',
		swf: 'http://takeout.dmmotion.com/Delivery/Asset/224/388666/autoInit=0/showSkin=1/idSkin=330/showTitle=0/showDescription=0/branch=tv_core_osfm.swf'
	}
];

exports.ondomready = function() {
	var videosEl, videoType, userAgent = navigator.userAgent;

	// Unfortunately we have to resort to UA detection instead of video.canPlayType() because of Admotion's crazy formats.
	if (userAgent.indexOf('Android') !== -1) {
		videoType = 'rtsp';
	} else if (/iP(hone|ad|od)/.test(userAgent)) {
		videoType = 'm3u8';
	}

	videosEl = document.getElementById('videos');
	videos.forEach(function(video) {
		var videoEl, sourceEl, embedEl;

		switch (videoType) {
		case 'rtsp':
		case 'm3u8':
			sourceEl = document.createElement('source');
			sourceEl.setAttribute('type', 'video/mp4; codecs=\'avc1.42E01E, mp4a.40.2\'');
			sourceEl.setAttribute('src', video[videoType]);

			videoEl = document.createElement('video');
			videoEl.className = 'video';
			videoEl.setAttribute('controls', '');
			videoEl.appendChild(sourceEl);
			videosEl.appendChild(videoEl);
			break;

		// Use a SWF.
		default:
			embedEl = document.createElement('embed');
			embedEl.className = 'video';
			embedEl.setAttribute('src', video.swf);
			embedEl.setAttribute('pluginspage', 'http://www.macromedia.com/go/getflashplayer');
			embedEl.setAttribute('type', 'application/x-shockwave-flash');
			embedEl.setAttribute('menu', 'false');
			embedEl.setAttribute('allowfullscreen', 'true');
			embedEl.setAttribute('wmode', 'transparent');
			videosEl.appendChild(embedEl);
			break;
		}
	});
};
