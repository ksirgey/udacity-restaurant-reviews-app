"use strict";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      // Registration was successful
      console.log('ServiceWorker registration was successful: ', reg.scope);
    }).catch(err => {
      // Registration failed
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
