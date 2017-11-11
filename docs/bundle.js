/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "docs";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var input = document.querySelector('.search-input');
var submitBtn = document.querySelector(".search-btn");
var container = document.querySelector('.container');
var nextBtn = document.querySelector('.next-btn');
var preBtn = document.querySelector('.previous-btn');
var iframe = document.querySelector('.embed-iframe');
var embedWindow = document.querySelector('.embed-window');
var closeBtn = document.querySelector('.close-btn');
var background = document.querySelector('.background-load');
var main = document.querySelector('main');
var result = document.querySelector('.number');
var menu = document.querySelector('.icon-menu');
var sideBar = document.querySelector('.sidebar');
var iframeWin = iframe.contentWindow;

menu.addEventListener('click', function () {
    return sideBar.classList.toggle("hidden");
});

submitBtn.addEventListener('click', loader);
input.addEventListener('change', loader);
closeBtn.addEventListener('click', function () {
    embedWindow.style.display = 'none';
    background.classList.remove('background-shadow');
    iframeWin.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
});

var apiUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&id&type=video',
    apiKey = 'AIzaSyBYkTHTzgvhVFwVd7uWphvImWw5Y7H_nAE',
    address,
    z = 0,
    r = 5;

function loader() {
    var q = input.value.trim();
    if (q === '') return;
    address = apiUrl + '&q=' + q + '&key=' + apiKey;
    search(display, address);
    r = 5;
    z = 0;
}

function search(load, url) {

    fetch(url).then(function (response) {
        return response.json();
    }).then(loading).catch(function (err) {
        return console.log(err);
    });

    function loading(data) {
        load(data);
    }
}

function display(list) {
    //console.log(list);
    nextBtn.innerHTML = '';
    preBtn.innerHTML = '';
    container.innerHTML = '';
    result.innerHTML = '';

    list.items.forEach(function (item) {
        var thumb = item.snippet.thumbnails.high.url,
            title = item.snippet.title,
            description = item.snippet.description,
            published = item.snippet.publishedAt,
            videoId = item.id.videoId,
            chId = item.snippet.channelId,
            chTitle = item.snippet.channelTitle;

        var date = new Date(published.substr(0, 10).toString());
        var current = new Date();
        var diff = Math.abs(date.getTime() - current.getTime());
        var years = Math.ceil(diff / (1000 * 3600 * 24) / 365);

        var duration = '',
            quality,
            views;

        var videoUrl = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&part=statistics,contentDetails&key=' + apiKey;
        //fetch(videoUrl).then(res=> res.json()).then(videoDetails).catch(err=> console.log(err));

        function videoDetails(data) {
            duration = data.items[0].contentDetails.duration;
            quality = data.items[0].contentDetails.definition;
            views = data.items[0].statistics.viewCount;
        }

        function result() {
            return container.innerHTML += '<section class="video-box">\n                              <div class="image-thumbnail" style="background-image:url(\'' + thumb + '\')" data-videoId="' + videoId + '"></div>\n                              <div class="describe"><span class="title">' + title + '</span>\n                              <span>' + years + ' years ago</span><span>' + duration + '</span><span>' + quality + '</span>\n                              <span>' + published + '</span><span class="channel" data-channelId="' + chId + '">' + chTitle + '</span></div>\n                              </section>';
        }

        async function compile() {

            var response = await fetch(videoUrl).then(function (res) {
                return res.json();
            });

            var videos = await videoDetails(response);

            var x = await result();

            var event = await addlistener();

            return;
        }
        compile();

        // container.innerHTML+=`<section class="video-box">
        //                       <div class="image-thumbnail" style="background-image:url('${thumb}')" data-videoId="${videoId}"></div>
        //                       <div class="describe"><span class="title">${title}</span>
        //                       <span>${years} years ago</span><span>${duration}</span><span>${quality}</span>
        //                       <span>${published}</span><span class="channel" data-channelId="${chId}">${chTitle}</span></div>
        //                       </section>`;
    });

    function addlistener() {
        var images = document.querySelectorAll('.image-thumbnail');
        var links = document.querySelectorAll('.channel');
        images.forEach(function (item) {
            item.addEventListener('click', function (e) {
                var vidId = e.target.getAttribute('data-videoId');
                iframe.setAttribute('src', 'https://www.youtube.com/embed/' + vidId + '?autoplay=1&enablejsapi=1&html5=1&version=3');
                background.classList.add('background-shadow');
                embedWindow.style.display = "block";
            });
        });
        links.forEach(function (el) {
            el.addEventListener('click', function (ev) {
                var channelData = ev.target.getAttribute('data-channelId');
                var url = apiUrl + 'key=' + apiKey + '&channelId=' + channelData + '&maxResults=' + r;
                search(display, url);
            });
        });
    }

    result.innerHTML = 'About ' + comma(list.pageInfo.totalResults) + ' results';
    var images = document.querySelectorAll('.image-thumbnail');
    var links = document.querySelectorAll('.channel');
    var nextPage = list.nextPageToken,
        prevPage = list.prevPageToken,
        q = input.value;

    nextPrev(nextPage, 'Next', q, 'right');
    nextPrev(prevPage, 'Prev', q, 'left');

    images.forEach(function (item) {
        item.addEventListener('click', function (e) {
            var vidId = e.target.getAttribute('data-videoId');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/' + vidId + '?autoplay=1&enablejsapi=1&html5=1&version=3');
            background.classList.add('background-shadow');
            embedWindow.style.display = "block";
        });
    });
    links.forEach(function (el) {
        el.addEventListener('click', function (ev) {
            var channelData = ev.target.getAttribute('data-channelId');
            var url = apiUrl + 'key=' + apiKey + '&channelId=' + channelData + '&maxResults=' + r;
            search(display, url);
        });
    });
    main.addEventListener('scroll', function () {
        return scrollLoader(address);
    });
}

function scrollLoader(url) {
    // z++;
    // z>90 && z<95?(r=10 ,search(display,(url+'&maxResults='+r))): 
    // z>510 && z<515?(r=20 ,search(display,(url+'&maxResults='+r))):
    // z>1510 && z<1515?(r=30 ,search(display,(url+'&maxResults='+r))):
    // z>2800 && z<2805?(r=40 ,search(display,(url+'&maxResults='+r))):
    // z>4500 && z<4505?(r=50 ,search(display,(url+'&maxResults='+r))):'';
}

function nextPrev(token, text, value, arrow) {
    if (!token) return;
    var btn = document.createElement('button');
    btn.classList.add(text);
    text === 'Next' ? (btn.innerHTML = '<span>' + text + '</span><i class="icon-' + arrow + '"></i>', nextBtn.appendChild(btn)) : (btn.innerHTML = '<i class="icon-' + arrow + '"></i><span>' + text + '</span>', preBtn.appendChild(btn));
    var url = apiUrl + '&q=' + value + '&pageToken=' + token + '&key=' + apiKey + '&maxResults=' + r;
    btn.addEventListener('click', function () {
        return search(display, url);
    });
}

function comma(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// https://www.googleapis.com/youtube/v3/search?part=snippet&
// forDeveloper=true&location=37.42307%2C+-122.08427&locationRadius=50km&
// maxResults=10&
// order=date&relevanceLanguage=persian&type=video%2Clist&videoType=any

/***/ })
/******/ ]);