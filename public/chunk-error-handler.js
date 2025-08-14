// Client-side chunk error recovery
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  let retryCount = 0;
  const maxRetries = 2;
  
  // Handle chunk loading errors
  window.addEventListener('error', function(event) {
    const error = event.error;
    const message = event.message || '';
    
    // Check if this is a chunk loading error
    const isChunkError = (error && error.name === 'ChunkLoadError') ||
                        message.includes('Loading chunk') ||
                        message.includes('ChunkLoadError');
    
    if (isChunkError && retryCount < maxRetries) {
      console.warn('Chunk loading error detected. Retrying...', { retryCount, error: error || message });
      retryCount++;
      
      // Special handling for Studio pages - try to recover gracefully
      if (window.location.pathname.includes('/studio')) {
        console.log('Studio chunk error - attempting graceful recovery...');
        
        // Try to reload just the studio iframe if it exists
        const studioIframe = document.querySelector('iframe[title*="studio"], iframe[src*="studio"]');
        if (studioIframe) {
          console.log('Reloading studio iframe...');
          studioIframe.src = studioIframe.src;
          event.preventDefault();
          return false;
        }
      }
      
      // Clear any cached data and reload
      setTimeout(function() {
        if ('caches' in window) {
          caches.keys().then(function(names) {
            return Promise.all(names.map(function(name) {
              return caches.delete(name);
            }));
          }).finally(function() {
            window.location.reload();
          });
        } else {
          window.location.reload();
        }
      }, 1000);
      
      // Prevent the error from propagating
      event.preventDefault();
      return false;
    }
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    const isChunkError = reason && (
      reason.name === 'ChunkLoadError' ||
      (reason.message && reason.message.includes('Loading chunk'))
    );
    
    if (isChunkError && retryCount < maxRetries) {
      console.warn('Chunk loading promise rejection. Retrying...', { retryCount, reason });
      retryCount++;
      
      setTimeout(function() {
        window.location.reload();
      }, 1000);
      
      event.preventDefault();
    }
  });
  
  console.log('Chunk error recovery initialized');
})();
