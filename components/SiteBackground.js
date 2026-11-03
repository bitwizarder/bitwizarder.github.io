"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function SiteBackground() {
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(".ambient-orb-a", {
        xPercent: 12,
        yPercent: -8,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".ambient-orb-b", {
        xPercent: -10,
        yPercent: 14,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".ambient-orb-c", {
        xPercent: 8,
        yPercent: 10,
        duration: 17,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".noise-pan", {
        x: -60,
        y: -40,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "none"
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="noise-pan absolute inset-0 grain-overlay" />
      <div className="absolute inset-0 grid-overlay opacity-60" />
      <div className="absolute inset-0 bg-mesh-gradient opacity-85" />

      <div className="ambient-orb-a absolute -left-20 top-8 h-[340px] w-[340px] rounded-full bg-neon-violet/30 blur-[110px]" />
      <div className="ambient-orb-b absolute right-[-70px] top-[25vh] h-[420px] w-[420px] rounded-full bg-neon-cyan/20 blur-[130px]" />
      <div className="ambient-orb-c absolute bottom-[-100px] left-[22%] h-[380px] w-[380px] rounded-full bg-neon-magenta/25 blur-[120px]" />
    </div>
  );
}
