// Show-wide settings.
const links = {
  youtube: "https://www.youtube.com/@antifirm",
  spotify: "https://open.spotify.com/show/6JaAeCI2Wnrm4frUQMmNzX",
  apple: "https://podcasts.apple.com/us/podcast/antifirm/id6829585794",
  instagram: "https://www.instagram.com/antifirm/",
  tiktok: "https://www.tiktok.com/@antifirm.podcast",
  linkedin: "https://www.linkedin.com/company/81525019/",
  x: "https://x.com/antifirmpodcast",
};

export const site = {
  name: "ANTIFIRM",
  tagline: "Business. Law. Other things.",
  description:
    "A podcast about the things that sound boring—until they’re your problem.",
  /** Episodes come from this feed at build time. */
  feedUrl: "https://api.riverside.com/hosting/EhWysD90.rss",
  /** Set to the trailer's YouTube link once known; until then the button falls back to the YouTube channel. */
  trailerUrl: "",
  links,
  /**
   * Cloudflare Web Analytics site token (cookie-free, no consent banner needed).
   * Leave empty to turn analytics off. Find it in Cloudflare → Analytics & Logs → Web Analytics → antifirm.com → Manage site.
   */
  cloudflareAnalyticsToken: "9a4a32c3fe2c4b8da97969cc0c35becd",
  /** Default hosts for episode pages; an episode can override them in episode-meta.json. */
  hosts: [{ name: "Jordan Teague" }, { name: "George Campbell" }],
  subscribe: [
    { id: "youtube", label: "YouTube", href: links.youtube },
    { id: "spotify", label: "Spotify", href: links.spotify },
    { id: "apple", label: "Apple Podcasts", href: links.apple },
  ],
  social: [
    { id: "youtube", label: "YouTube", href: links.youtube },
    { id: "spotify", label: "Spotify", href: links.spotify },
    { id: "apple", label: "Apple Podcasts", href: links.apple },
    { id: "instagram", label: "Instagram", href: links.instagram },
    { id: "tiktok", label: "TikTok", href: links.tiktok },
    { id: "linkedin", label: "LinkedIn", href: links.linkedin },
    { id: "x", label: "X", href: links.x },
  ],
} as const;

export type PlatformId = "youtube" | "spotify" | "apple" | "instagram" | "tiktok" | "linkedin" | "x" | "rss";
