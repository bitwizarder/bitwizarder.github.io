"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { personal } from "@/data/resumeContent";
import themeConfig from "@/data/themeConfig.json";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function getInitials(name) {
  if (!name) return "CV";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  const first = parts[0].slice(0, 1).toUpperCase();
  const last = parts[parts.length - 1].slice(0, 1).toUpperCase();
  return `${first}/${last}`;
}

export default function LoaderOverlay() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const loaderText = locale === "en" ? "m.a" : themeConfig.loader?.textValue || getInitials(personal.name);

  useEffect(() => {
    if (!visible) return undefined;

    const body = document.body;
    const html = document.documentElement;
    const previousOverflow = body.style.overflow;
    let didReveal = false;
    window.__cv2LoaderDone = false;
    html.classList.add("cv2-loading");
    body.style.overflow = "hidden";

    const revealMain = () => {
      if (didReveal) return;
      didReveal = true;
      window.__cv2LoaderDone = true;
      window.dispatchEvent(new Event("cv2:loader-done"));
      html.classList.remove("cv2-loading");
    };

    const markDone = () => {
      body.style.overflow = previousOverflow;
      setVisible(false);
    };

    if (reducedMotion || !rootRef.current) {
      revealMain();
      markDone();
      return undefined;
    }

    const ctx = gsap.context(() => {
      const loader = rootRef.current;
      const initialsNode = loader.querySelector(".loader-initials");
      const leftPanel = loader.querySelector(".loader-panel-left");
      const rightPanel = loader.querySelector(".loader-panel-right");

      gsap.set(initialsNode, { autoAlpha: 0, scale: 1, y: 10, filter: "blur(0px)" });
      gsap.to(initialsNode, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" });

      const loadPromise = new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve(true);
          return;
        }
        window.addEventListener("load", () => resolve(true), { once: true });
      });

      Promise.all([loadPromise, new Promise((resolve) => setTimeout(resolve, 1100))]).then(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: markDone
        });

        tl.to(initialsNode, {
          scale: 2.4,
          filter: "blur(16px)",
          autoAlpha: 0,
          duration: 0.8
        })
          .call(revealMain)
          .to(
            leftPanel,
            {
              xPercent: -104,
              duration: 1.05
            },
            "-=0.08"
          )
          .to(
            rightPanel,
            {
              xPercent: 104,
              duration: 1.05
            },
            "<"
          )
          .to(loader, { autoAlpha: 0, duration: 0.28 }, "-=0.14");
      });
    }, rootRef);

    return () => {
      revealMain();
      html.classList.remove("cv2-loading");
      body.style.overflow = previousOverflow;
      ctx.revert();
    };
  }, [visible, reducedMotion]);

  if (!visible) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[140]">
      <div className="absolute inset-0 flex">
        <div className="loader-panel-left h-full w-1/2" style={{ backgroundColor: "var(--loader-bg)" }} />
        <div className="loader-panel-right h-full w-1/2" style={{ backgroundColor: "var(--loader-bg)" }} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="loader-initials display-font text-[clamp(3.8rem,15vw,13rem)] font-extrabold leading-none tracking-[0.08em]"
          style={{ color: "var(--loader-text)" }}
        >
          {loaderText}
        </span>
      </div>
    </div>
  );
}
