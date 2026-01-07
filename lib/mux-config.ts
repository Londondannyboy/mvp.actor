// Mux streaming playback IDs for optimal video delivery
// All videos stream from Mux CDN using HLS - no local MP4 files

export const MUX_VIDEOS = {
  // Primary esports gameplay footage
  ESPORTS_1: "A6OZmZy02Y00K4ZPyHuyfTVXoauVjLhiHlbR2bLqtBywY",
  // Hero banner video
  HERO: "QeCiSMO9ZeptbSh02kbUCenrNIpwR02X0202Lcxz700HqYvI",
  // Additional esports content
  ESPORTS_2: "XlLTzFXbHCKseOjTNG7fHlpOrXOKUD9d5p36lX1I00G4",
  // Gaming/recruitment content
  GAMING: "Bg101Cs02gDzFyCjjz01ILN3lkmZqRtkKQBHpVcfOCb5uU",
} as const;

// Array of all video IDs for random selection
export const ALL_VIDEOS = Object.values(MUX_VIDEOS);

// Get random video for job cards (cycles through available videos)
export function getVideoForIndex(index: number): string {
  return ALL_VIDEOS[index % ALL_VIDEOS.length];
}

// Helper to get HLS streaming URL (works with hls.js and Safari native)
export function getMuxStreamUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

// Helper to get thumbnail URL (WebP for performance)
export function getMuxThumbnailUrl(playbackId: string, time: number = 0): string {
  return `https://image.mux.com/${playbackId}/thumbnail.webp?time=${time}`;
}

// Helper to get animated GIF preview
export function getMuxGifUrl(playbackId: string, start: number = 0, end: number = 3): string {
  return `https://image.mux.com/${playbackId}/animated.gif?start=${start}&end=${end}&width=320`;
}
