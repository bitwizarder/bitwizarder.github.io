"use client";

import { useEffect, useRef } from "react";
import { getSceneLabel } from "@/data/resumeContent";
import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function renderHeadingWords(text) {
  const words = text.split(" ");
  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className="mx-[0.15ch] inline-block overflow-hidden">
        <span className="about-title-word inline-block">{word}</span>
      </span>
      {index < words.length - 1 ? " " : null}
    </span>
  ));
}

export default function AboutSection() {
  const { locale, t } = useLocale();
  const { personal } = useResumeContent();
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const root = sectionRef.current;
      const titleWords = root.querySelectorAll(".about-title-word");
      const copyLines = root.querySelectorAll(".about-copy-line");
      const bgWord = root.querySelector(".about-bg-word");

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "bottom 35%",
            toggleActions: "play none none none",
            once: true
          }
        })
        .from(titleWords, { yPercent: 120, autoAlpha: 0, stagger: 0.03, duration: 0.8 })
        .fromTo(copyLines, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.16, duration: 0.65 }, "-=0.35");

      gsap.to(bgWord, {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="about" data-section ref={sectionRef} className="relative py-20 md:py-28">
      <span className="about-bg-word pointer-events-none absolute left-4 top-10 display-font text-[20vw] font-bold uppercase tracking-[0.12em] text-white/[0.04]">
        {t("هویت")}
      </span>

      <div className="section-shell relative z-10 grid gap-10 lg:grid-cols-12">
        {/* 👈 تغییر به وسط چین کردن متن */}
        <div className="lg:col-span-8 lg:col-start-3">
          <p className="label-chip mb-6">{getSceneLabel("about", locale)} / {t("هویت")}</p>
          <h2 className="display-font text-balance text-[clamp(2rem,4.5vw,4rem)] font-bold leading-[1.3]">
            {renderHeadingWords(personal.aboutHeading)}
          </h2>
          <div className="mt-6 space-y-4">
            {personal.aboutParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 22)} className="about-copy-line max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}