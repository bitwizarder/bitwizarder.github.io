"use client";

import { useEffect, useRef } from "react";
import { getSceneLabel } from "@/data/resumeContent";
import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatLocaleYearLabel } from "@/lib/localeFormat";

export default function AchievementsSection() {
  const { locale, t } = useLocale();
  const { achievements } = useResumeContent();
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
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
        .fromTo(".achievement-title", { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75 })
        .fromTo(".achievement-item", { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.58, stagger: 0.1 }, "-=0.32");

      gsap.to(".achievement-glow", {
        scale: 1.08,
        duration: 5.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="achievements" data-section ref={sectionRef} className="relative py-14 md:py-20">
      <div className="achievement-glow pointer-events-none absolute right-10 top-16 h-40 w-40 rounded-full bg-neon-amber/20 blur-[90px]" />

      <div className="section-shell">
        <p className="label-chip">{getSceneLabel("achievements", locale)} / {t("انتشار و دستاوردها")}</p>
        <h2 className="achievement-title display-font mt-6 max-w-4xl text-balance text-[clamp(2rem,4.8vw,4.2rem)] font-bold leading-[1.3]">
          {t("محصولاتی که از ایده به دست کاربران رسیده‌اند.")}
        </h2>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {achievements.map((item) => (
            <article
              key={`${item.year}-${item.title}`}
              className={`achievement-item relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-5 ${achievements.length === 1 ? "md:col-span-2" : ""}`}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-amber/65 to-transparent" />
              <p className="mono-font text-[10px] uppercase tracking-[0.22em] text-neon-amber">{formatLocaleYearLabel(item.year, locale)}</p>
              <h3 className="display-font mt-2 text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mono-font mt-2 text-[10px] uppercase tracking-[0.2em] text-silver/65">{item.issuer}</p>
              <p className="mt-3 text-sm leading-relaxed text-silver/80">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
