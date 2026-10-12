/** Standard `sizes` strings used across the app so the browser picks the
 *  right variant for each breakpoint. */
export const IMAGE_SIZES = {
  /** Gallery / preview cards — one column on mobile, two on tablet, three on desktop. */
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",

  /** Hero collage slots — small, fixed-width, never more than ~280px. */
  heroCollage: "(max-width: 640px) 46vw, 280px",

  /** Profile gallery — big primary (2/3) and stacked memories (1/3) on desktop; scroll-snap on mobile. */
  profilePrimary: "(max-width: 768px) 78vw, 66vw",
  profileMemory: "(max-width: 768px) 78vw, 33vw",

  /** Lightbox — nearly full viewport. */
  lightbox: "90vw",

  /** Preview card on the landing page. */
  previewCard: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
};
