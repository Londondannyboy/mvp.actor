'use client';

import { useEffect } from 'react';
import Hls from 'hls.js';

/**
 * HlsVideoInit - Client component that initializes HLS.js for all video elements
 * Add this component once in your layout to enable HLS streaming site-wide
 */
export function HlsVideoInit() {
  useEffect(() => {
    // Find all video elements with HLS sources
    const initHls = () => {
      const videos = document.querySelectorAll('video');

      videos.forEach((video) => {
        // Check if video has an HLS source
        // Use getAttribute for more reliable source detection
        const source = video.querySelector('source');
        const src = source?.getAttribute('src') || source?.src || video.getAttribute('src') || video.src;

        if (!src || !src.includes('.m3u8')) return;

        // Skip if already initialized
        if ((video as any)._hlsInitialized) return;
        (video as any)._hlsInitialized = true;

        // Safari supports HLS natively
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          attemptAutoplay(video);
          return;
        }

        // Use hls.js for other browsers
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90,
          });

          hls.loadSource(src);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            attemptAutoplay(video);
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            // Only handle fatal errors - non-fatal are auto-recovered
            if (data.fatal) {
              // Try to recover silently
              if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              }
              // Only log if recovery fails (will trigger another fatal error)
            }
          });

          // Store reference for cleanup
          (video as any)._hls = hls;
        }
      });
    };

    // Attempt autoplay with proper promise handling per Mux docs
    const attemptAutoplay = (video: HTMLVideoElement) => {
      // Only attempt if video has autoplay attribute
      if (!video.hasAttribute('autoplay') && !video.autoplay) return;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay prevented - expected behavior
          // Video will show poster, user can interact to play
        });
      }
    };

    // Initialize on mount with a small delay for dynamic content
    initHls();

    // Re-initialize after a short delay to catch dynamically rendered components
    const timeoutId = setTimeout(initHls, 500);
    const timeoutId2 = setTimeout(initHls, 1500);

    // Re-initialize when DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      // Debounce the mutation observer
      setTimeout(initHls, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      observer.disconnect();
      document.querySelectorAll('video').forEach((video) => {
        const hls = (video as any)._hls;
        if (hls) {
          hls.destroy();
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything
}
