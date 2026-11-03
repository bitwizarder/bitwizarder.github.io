"use client";

import { useEffect, useRef } from "react";
import { getSceneLabel } from "@/data/resumeContent";
import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatLocaleYearLabel } from "@/lib/localeFormat";

export default function EducationSection() {
  const { locale, t } = useLocale();
  const { education } = useResumeContent();
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
        .fromTo(".education-label", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45 })
        .fromTo(".education-title", { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75 }, "-=0.2")
        .fromTo(".education-node", { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12 }, "-=0.32");

      gsap.to(".education-ambient", {
        yPercent: -10,
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
    <section id="education" data-section ref={sectionRef} className="relative overflow-hidden py-20 md:py-28">
      <div className="education-ambient section-ambient pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(55,244,255,0.12),transparent_42%),radial-gradient(circle_at_85%_78%,rgba(159,92,255,0.15),transparent_38%)]" />

      <div className="section-shell relative z-10">
        <p className="education-label label-chip">{getSceneLabel("education", locale)} / {t("تحصیلات")}</p>
        <h2 className="education-title display-font mt-6 max-w-4xl text-balance text-[clamp(2rem,4.8vw,4.2rem)] font-bold leading-[1.3]">
          {t("پایه‌هایی که مسیر فنی و نگاه من به ساخت محصول را شکل دادند.")}
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-sm text-silver/65">{t("مسیر تحصیلی و حرفه‌ای")}</p>
          </div>

          <div className="relative lg:col-span-8">
            <div className="pointer-events-none absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-neon-cyan/45 via-white/15 to-transparent" />
            <div className="space-y-8 pl-10">
              {education.map((item) => (
                <article key={`${item.period}-${item.degree}`} className="education-node relative">
                  <span className="absolute -left-[2.05rem] top-2 h-2.5 w-2.5 rounded-full bg-neon-cyan shadow-[0_0_18px_rgba(55,244,255,0.8)]" />
                  <p className="mono-font text-[11px] uppercase tracking-[0.22em] text-neon-cyan">{formatLocaleYearLabel(item.period, locale)}</p>
                  <h3 className="display-font mt-2 text-2xl font-semibold text-white">{item.degree}</h3>
                  <p className="mono-font mt-2 text-[10px] uppercase tracking-[0.2em] text-silver/65">{item.institution}</p>
                  <p className="mt-3 text-sm leading-relaxed text-silver/80 md:text-base">{item.focus}</p>
                  <p className="mt-3 border-l border-white/25 pl-4 text-sm text-silver/70">{item.note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
