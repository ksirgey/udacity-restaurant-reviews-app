"use strict";
// define our cache name
const staticCacheName = 'restaurant-reviews-v1';

// define an array of assets to cache
const cachedUrls = [
  '/',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  '/index.html',
  '/restaurant.html',
  'css/styles.css',
  'data/restaurants.json',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
  'js/service-worker.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/8.10.0/lazyload.min.js'
];

// Add an event listener for the install event
self.addEventListener('install', event => {

  //  Signal the progress of the install of the serviceWorker with event.waitUntil

  // Pass it a promise; if it resolves, the install is complete. If the promise rejects, the install failed and serviceWorker should be discarded
  event.waitUntil(
    // To load restaurant reviews offline,we store the html, the css, the images, the webfont using the cache/caches API. The caches API gives us a cache object on the global scope.

    // Caches.open returns a promise for a cache of that name,

    caches.open(staticCacheName).then(cache => {
      // a cache 'box' contains request and response PAIRS from any SECURE origin (https). Use it to store fonts, scripts, images and anything, from both origin and anywhere on the web.

      // Add cache items using cache.put(request, response); and pass in a request or url and a response or use cache.addAll([]); which takes an array of requests or urls, fetches them and puts the request response pairs into the cache, however, when using cache.addALL if any of these fail to cache, then none of them are added.

      // To get something out of the cache, use cache.match(request); passing in a request, or a url. This will return a promise for a matching response if one is found or NULL if no matches are found. Alternatively, caches.match(request) tries to find a match in ANY cache, starting with the OLDEST cache first.
        return cache.addAll(cachedUrls);
      }).catch(err => {
          console.log(err);
      })
  );
});

// Set up an eventlistener for the fetch event to intercept them
self.addEventListener('fetch', event => {

  event.respondWith(

    // Check for a match to the request in the cache
    caches.match(event.request, {ignoreSearch: true}).then(response => {

      // if the data is already in the cache
      if (response) {

        // return the data found in the cache
        return response;
      }

      // Fetch it from the network
      return fetch(event.request).then(response => {

        // since not found in the cache, add it now
        return caches.open(staticCacheName).then(cache => {
          cache.put(event.request, response.clone());

          // now return what was fetched to the page
          return response;
        });

        // on network error
      }).catch(err => {
        // console.error('Fetching failed:', err);

        throw err;
      });
    })
  );
});







// setup an event listener so we can do some things when the new serviceWorker activates
self.addEventListener('activate', event => {
  event.waitUntil(

    // get all the cacheNames that exist
    caches.keys().then(cacheNames => {
      // we wrap everything in Promise.all() so we wait for the completion of all the promises that were mapped before we return anything here. This way we delete everything before signaling the job is done.
      return Promise.all(
        // then we're going to filter those cacheNames because...
        cacheNames.filter(cacheName => {
          // we are only interested in the ones that begin with 'restaurant-reviews-' AND ISN't a name in the list of our staticCacheNames
          return cacheName.startsWith('restaurant-reviews-') && cacheName != staticCacheName;

          // this leaves us with an array of names we don't need anymore that we can map those
        }).map(cacheName => {
          // to promises returned by caches.delete()
          return caches.delete(cacheName);
        })
      );
    })
  );
});
