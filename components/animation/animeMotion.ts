import { animate, createTimeline, stagger } from "animejs";

/**
 * Kinetic typography animation using Anime.js v4.
 * Splits text into staggered character/word reveals with crisp easing and negative-space framing.
 */
export function animateKineticText(
  targets: HTMLElement | HTMLElement[] | string,
  options?: {
    delay?: number;
    duration?: number;
    staggerMs?: number;
    translateY?: number[];
    onComplete?: () => void;
  }
) {
  const {
    delay = 0,
    duration = 850,
    staggerMs = 35,
    translateY = [40, 0],
    onComplete,
  } = options || {};

  return animate(targets, {
    opacity: [0, 1],
    translateY,
    ease: "outQuad",
    duration,
    delay: stagger(staggerMs, { start: delay }),
    onComplete,
  });
}

/**
 * Editorial message entrance with crisp slide and opacity fade.
 */
export function animateMessageEntrance(
  target: HTMLElement | string,
  speaker: "clint" | "maica" | "user"
) {
  const offsetX = speaker === "clint" ? -14 : speaker === "maica" ? 14 : 0;
  const offsetY = speaker === "user" ? 12 : 8;

  return animate(target, {
    opacity: [0, 1],
    translateX: [offsetX, 0],
    translateY: [offsetY, 0],
    ease: "outCubic",
    duration: 650,
  });
}

/**
 * Indicator node pulse when an agent transmits or reflects.
 */
export function animateAgentPulse(
  target: HTMLElement | string
) {
  return animate(target, {
    scale: [1, 1.25, 1],
    ease: "inOutQuad",
    duration: 500,
  });
}
