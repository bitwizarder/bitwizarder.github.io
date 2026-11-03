"use client";

import { useEffect, useRef } from "react";
import { getSceneLabel } from "@/data/resumeContent";
import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function splitWords(text, className, locale) {
  const words = text.split(" ");
  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className={`${locale === "fa" ? "ml-[0.35ch]" : "mr-[0.25ch]"} inline-block overflow-hidden`}>
        <span className={`inline-block ${className}`}>{word}</span>
      </span>
      {index < words.length - 1 ? " " : null}
    </span>
  ));
}

export default function PhilosophySection() {
  const { locale, t } = useLocale();
  const { philosophy } = useResumeContent();
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const root = sectionRef.current;
      const divider = root.querySelector(".philo-divider");
      const words = root.querySelectorAll(".philo-word");
      const body = root.querySelector(".philo-body");
      const bg = root.querySelector(".philo-bg");

      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "bottom 35%",
            toggleActions: "play none none none",
            once: true
          }
        })
        .fromTo(divider, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.9 })
        .from(words, { yPercent: 120, autoAlpha: 0, duration: 1, stagger: 0.035 }, "-=0.4")
        .fromTo(body, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.25");

      gsap.to(bg, {
        scale: 1.12,
        autoAlpha: 0.45,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="philosophy" data-section ref={sectionRef} className="relative py-20 md:py-28">
      <div className="philo-bg pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-violet/15 blur-[140px]" />

      <div className="section-shell relative z-10 text-center">
        <p className="label-chip">{getSceneLabel("philosophy", locale)} / {t("رویکرد کاری")}</p>
        <div className="philo-divider story-divider mx-auto mt-8 w-[min(680px,78vw)] origin-center" />
        <h2 className="display-font text-balance mx-auto mt-9 max-w-5xl text-[clamp(2rem,5.4vw,5.2rem)] font-bold leading-[1.3] text-white">
          {splitWords(philosophy.quote, "philo-word", locale)}
        </h2>
        <p className="philo-body mx-auto mt-8 max-w-3xl text-base leading-relaxed text-silver/80 md:text-lg">{philosophy.body}</p>
      </div>
    </section>
  );
}
