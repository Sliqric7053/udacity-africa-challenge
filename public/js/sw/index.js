import { Promise } from "es6-promise";

// const CACHE_VERSION = 1;

// Shorthand identifier mapped to specific versioned cache.
// const CURRENT_CACHES = {
//   colorScheme: "wittr-static-" + CACHE_VERSION
// };

// const expectedCacheNames = Object.values(CURRENT_CACHES);
const expectedCacheNames = "wittr-static-6";

self.addEventListener("install", function(event) {
  event.waitUntil(
    // TODO: change the site's theme, eg swap the vars in public/scss/_theme.scss
    // Ensure at least $primary-color changes
    // TODO: change cache name to 'wittr-static-v2'
    caches.open(expectedCacheNames).then(function(cache) {
      return cache.addAll([
        "/",
        "js/main.js",
        "css/main.css",
        "imgs/icon.png",
        "https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff",
        "https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff"
      ]);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    // TODO: remove the old cache
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return (
              cacheName.startsWith("wittr-") && cacheName != expectedCacheNames
            );
          })
          .map(oldCache => {
            console.log("Deleting out of date cache:", oldCache);
            return caches.delete(oldCache);
          })
        // get a list of cache names
        // cacheNames.map(cacheName => {
        //   if (!expectedCacheNames.includes(expectedCacheNames)) {
        //     console.log("Deleting out of date cache:", cacheName);
        //     return caches.delete(cacheName);
        //   }
        // })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
