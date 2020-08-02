/* eslint-disable no-restricted-globals */
const CACHE_NAME = "tendays-presentation-cache-v1";

const FILES_TO_CACHE = [
  "index.html",
  "favicon.ico",
  "js/bundle.js",
  "views/css/app.css",
  "views/css/spinner.css",
  "views/hotspots-scene-01.html",
  "views/main-navigation.html",
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
  "assets/animation-03-small.mp4",
];

self.addEventListener("install", event => {
  // Precache static resources here.
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("ServiceWorker: Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", event => {
  console.log("ServiceWorker adding event listener for fetch.");
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log("ServiceWorker returning cached response.");
          return response;
        }
        console.log("ServiceWorker cache match but no response - fetching.");
        return fetch(event.request);
      })
      .catch(reason => {
        throw Error(`ServiceWorker cache match failed: ${reason}`);
      })
  );
});
