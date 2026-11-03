"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function SectionGlideController() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;

    const sections = gsap.utils.toArray("[data-section]");
    const triggers = [];

    sections.forEach((section) => {
      if (!(section instanceof HTMLElement)) return;
      if (section.id === "journey") return;

      const target =
        section.querySelector("[data-glide-target]") ||
        section.querySelector(".section-shell") ||
        section.firstElementChild;

      if (!target || !(target instanceof HTMLElement)) return;

      gsap.set(target, { willChange: "transform" });
      const tween = gsap.fromTo(
        target,
        { y: 26 },
        {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.35
          }
        }
      );

      triggers.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(target, { clearProps: "willChange" });
      });
    });

    return () => triggers.forEach((kill) => kill());
  }, [reducedMotion]);

  return null;
}
