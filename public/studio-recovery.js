// Studio-specific error recovery for markdown editor issues
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  let studioRetryCount = 0;
  const maxStudioRetries = 3;
  
  // Monitor for specific Studio/markdown errors
  function handleStudioError(error, source) {
    const errorMessage = error.message || error.toString();
    
    // Check if this is a markdown-related chunk error
    const isMarkdownError = errorMessage.includes('Loading chunk') && 
                           (errorMessage.includes('3492') || 
                            errorMessage.includes('markdown') ||
                            errorMessage.includes('editor'));
    
    if (isMarkdownError && studioRetryCount < maxStudioRetries) {
      console.warn(`Studio markdown error detected (attempt ${studioRetryCount + 1}/${maxStudioRetries}):`, errorMessage);
      studioRetryCount++;
      
      // Try different recovery strategies
      if (studioRetryCount === 1) {
        // First attempt: Clear caches and reload
        console.log('🔄 Attempting cache clear and reload...');
        clearCachesAndReload();
      } else if (studioRetryCount === 2) {
        // Second attempt: Force refresh with cache busting
        console.log('🔄 Attempting force refresh with cache busting...');
        const url = new URL(window.location);
        url.searchParams.set('_t', Date.now().toString());
        url.searchParams.set('_retry', studioRetryCount.toString());
        window.location.href = url.toString();
      } else {
        // Final attempt: Full page reload with localStorage clear
        console.log('🔄 Final attempt: Full reset...');
        try {
          localStorage.removeItem('sanityStudio:client');
          sessionStorage.clear();
        } catch (e) {
          console.warn('Could not clear storage:', e);
        }
        window.location.reload(true);
      }
      
      return true; // Handled
    }
    
    return false; // Not handled
  }
  
  function clearCachesAndReload() {
    if ('caches' in window) {
      caches.keys().then(function(names) {
        return Promise.all(names.map(function(name) {
          return caches.delete(name);
        }));
      }).then(function() {
        console.log('✅ Caches cleared');
        setTimeout(() => window.location.reload(), 500);
      }).catch(function(error) {
        console.warn('Cache clear failed:', error);
        setTimeout(() => window.location.reload(), 500);
      });
    } else {
      setTimeout(() => window.location.reload(), 500);
    }
  }
  
  // Enhanced error handling for Studio
  window.addEventListener('error', function(event) {
    if (window.location.pathname.includes('/studio')) {
      const handled = handleStudioError(event.error || { message: event.message }, 'global');
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (window.location.pathname.includes('/studio')) {
      const handled = handleStudioError(event.reason || { message: 'Promise rejection' }, 'promise');
      if (handled) {
        event.preventDefault();
      }
    }
  });
  
  // Studio-specific initialization
  if (window.location.pathname.includes('/studio')) {
    console.log('🎨 Studio recovery handler initialized');
    
    // Reset retry count when Studio loads successfully
    setTimeout(function() {
      if (document.querySelector('[data-sanity="root"]') || 
          document.querySelector('.sanity-studio')) {
        console.log('✅ Studio loaded successfully, resetting retry count');
        studioRetryCount = 0;
      }
    }, 5000);
  }
})();
