'use strict';

const CACHE_NAME = "tendays-presentation-cache-v1";

const FILES_TO_CACHE = [
    "index.html",
    "js/bundle.js",
    "views/css/app.css",
    "views/css/spinner.css",
    "views/hotspots-scene-01.html",
    "views/main-navigation-bar.html",
    "views/loading-spinner.html",

    "assets/fullscreen-button.svg",
    "assets/play-button-grey.svg",
    "assets/reload-button.svg",
    "assets/info-button.png",
    "assets/homeScreen.jpg",

    "assets/animation-01-medium.mp4",
    "assets/animation-01-small.mp4",
    "assets/animation-02-medium.mp4",
    "assets/animation-02-small.mp4",
    "assets/animation-03-medium.mp4",
    "assets/animation-03-small.mp4"
];

self.addEventListener("install", (event) => {
    // Precache static resources here.
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('ServiceWorker: Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', function (event) {
    // Source https://googlechrome.github.io/samples/service-worker/prefetch-video/
    console.log('Handling fetch event for', event.request.url);

    if (event.request.headers.get('range')) {
        var pos =
            Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
        console.log('Range request for', event.request.url,
            ', starting position:', pos);

        event.respondWith(
            caches.open(CACHE_NAME)
                .then(function (cache) {
                    return cache.match(event.request.url);

                }).then(function (res) {
                    if (!res) {
                        return fetch(event.request)
                            .then(res => {
                                return res.arrayBuffer();
                            });
                    }
                    return res.arrayBuffer();

                }).then(function (ab) {
                    return new Response(
                        ab.slice(pos),
                        {
                            status: 206,
                            statusText: 'Partial Content',
                            headers: [
                                // ['Content-Type', 'video/webm'],
                                ['Content-Range', 'bytes ' + pos + '-' +
                                    (ab.byteLength - 1) + '/' + ab.byteLength]]
                        });
                }));
    } else {
        console.log('Non-range request for', event.request.url);
        event.respondWith(
            // caches.match() will look for a cache entry in all of the caches available to the service worker.
            // It's an alternative to first opening a specific named cache and then matching on that.
            caches.match(event.request).then(function (response) {
                if (response) {
                    console.log('Found response in cache:', response);
                    return response;
                }
                console.log('No response found in cache. About to fetch from network...');
                // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
                // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
                return fetch(event.request).then(function (response) {
                    console.log('Response from network is:', response);

                    return response;
                }).catch(function (error) {
                    // This catch() will handle exceptions thrown from the fetch() operation.
                    // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
                    // It will return a normal response object that has the appropriate error code set.
                    console.error('Fetching failed:', error);

                    throw error;
                });
            })
        );
    }
});

// self.addEventListener('fetch', (event) => {
//     console.log("ServiceWorker fetch event called");
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             return response || fetch(event.request);
//         })
//     );
// });

// self.addEventListener("fetch", (event) => {
//     console.log("ServiceWorker adding event listener for fetch.");  
//     event.respondWith(
//         caches.match(event.request)
//             .then((response) => {
//                 // Cache hit - return response
//                 if (response) {
//                     console.log("ServiceWorker returning cached response.");
//                     return response;
//                 }
//                 console.log("ServiceWorker cache match but no response - fetching.");
//                 return fetch(event.request);
//             })
//             .catch((reason) => {
//                 throw new Error(`ServiceWorker cache match failed: ${reason}`);
//             })
//     );
// });
