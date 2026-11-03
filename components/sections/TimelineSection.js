"use client";

import { useEffect, useRef } from "react";
import { getSceneLabel } from "@/data/resumeContent";
import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatLocaleYearLabel } from "@/lib/localeFormat";

export default function TimelineSection() {
  const { locale, t } = useLocale();
  const { journey } = useResumeContent();
  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return undefined;
    const mm = gsap.matchMedia();
    const cleanups = [];

    mm.add("(min-width: 1024px)", () => {
      if (!pinWrapRef.current || !trackRef.current) return;
      const cards = gsap.utils.toArray(".timeline-card");
      const getAmountToScroll = () => Math.max(0, trackRef.current.scrollWidth - pinWrapRef.current.clientWidth);

      const amountToScroll = getAmountToScroll();
      if (!amountToScroll) return;

      const horizontalTween = gsap.to(trackRef.current, {
        x: () => (locale === "fa" ? getAmountToScroll() : -getAmountToScroll()),
        ease: "none",
        scrollTrigger: {
          trigger: pinWrapRef.current,
          start: "top top+=110",
          end: () => `+=${getAmountToScroll() + window.innerHeight}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!progressRef.current) return;
            gsap.to(progressRef.current, { scaleX: self.progress, duration: 0.12, overwrite: "auto" });
          }
        }
      });

      cards.forEach((card) => {
        const st = ScrollTrigger.create({
          trigger: card,
          containerAnimation: horizontalTween,
          start: locale === "fa" ? "right center" : "left center",
          end: locale === "fa" ? "left center" : "right center",
          onToggle: (self) => card.classList.toggle("is-active", self.isActive)
        });
        cleanups.push(() => st.kill());
      });

      const cardInnerReveal = gsap.from(".timeline-card .timeline-card-content > *", {
        y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.55, ease: "power2.out",
        scrollTrigger: {
          trigger: pinWrapRef.current,
          start: "top 70%",
          end: "bottom 40%",
          toggleActions: "play none none none",
          once: true
        }
      });
      cleanups.push(() => cardInnerReveal.kill());
    });

    mm.add("(max-width: 1023px)", () => {
      const tl = gsap.from(".timeline-mobile-card", {
        y: 50, autoAlpha: 0, stagger: 0.16, duration: 0.65, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 35%",
          toggleActions: "play none none none",
          once: true
        }
      });
      cleanups.push(() => tl.kill());
    });

    return () => { cleanups.forEach((cleanup) => cleanup()); mm.revert(); };
  }, [locale, reducedMotion]);

  return (
    <section id="journey" data-section ref={sectionRef} className="relative py-14 md:py-20">
      <div className="section-shell">
        <div className="mb-10 max-w-3xl">
          <p className="label-chip">{getSceneLabel("journey", locale)} / {t("مسیر شغلی")}</p>
          <h2 className="display-font mt-6 text-balance text-[clamp(2rem,4.8vw,4.4rem)] font-bold leading-[1.3]">
            {t("مسیر شغلی من.")}
          </h2>
        </div>
      </div>

      <div className="hidden lg:block">
        <div ref={pinWrapRef} className="relative mx-auto mt-6 w-[min(1400px,100vw)] overflow-hidden">
          {/* 👈 تغییر: نوار پیشرفت از سمت راست پر میشود */}
          <div className={`absolute ${locale === "fa" ? "right-0 origin-right" : "left-0 origin-left"} top-8 z-20 h-[2px] w-full bg-white/15`}>
            <div ref={progressRef} className={`h-full ${locale === "fa" ? "origin-right bg-gradient-to-l" : "origin-left bg-gradient-to-r"} scale-x-0 from-neon-cyan via-neon-violet to-neon-magenta`} />
          </div>

          <div ref={trackRef} className="flex gap-10 px-10 pb-10 pt-16 will-change-transform">
            {journey.map((step, index) => (
              <article key={step.year} className={`timeline-card surface-panel min-h-[400px] w-[68vw] max-w-[760px] flex-shrink-0 rounded-[30px] border border-white/15 px-7 py-7 ${index === 0 ? "is-active" : ""}`}>
                <div className="timeline-card-content space-y-4">
                  <p className="text-xs text-neon-cyan">{formatLocaleYearLabel(step.year, locale)}</p>
                  <h3 className="display-font text-4xl font-bold text-white">{step.role}</h3>
                  <p className="text-xs text-silver/70">{step.company}</p>
                  <p className="max-w-xl text-base leading-relaxed text-silver/85">{step.summary}</p>
                  <div className="whitespace-pre-line rounded-2xl border border-neon-violet/35 bg-neon-violet/10 px-5 py-4 text-sm text-silver">
                    {step.impact}
                  </div>
                </div>
              </article>
            ))}
            <div aria-hidden className="w-[24vw] max-w-[320px] flex-shrink-0" />
          </div>
        </div>
      </div>

      <div className="section-shell lg:hidden">
        <div className={`relative mt-8 ${locale === "fa" ? "mr-3 border-r pr-6" : "ml-3 border-l pl-6"} border-white/20`}>
          {journey.map((step) => (
            <article key={step.year} className="timeline-mobile-card relative mb-8 rounded-3xl border border-white/15 bg-white/[0.05] p-6">
              <div className={`absolute ${locale === "fa" ? "-right-[34px]" : "-left-[34px]"} top-6 h-3 w-3 rounded-full bg-neon-cyan shadow-[0_0_18px_rgba(34,229,255,0.85)]`} />
              <p className="text-xs text-neon-cyan">{formatLocaleYearLabel(step.year, locale)}</p>
              <h3 className="display-font mt-3 text-2xl font-semibold text-white">{step.role}</h3>
              <p className="mt-2 text-[11px] text-silver/65">{step.company}</p>
              <p className="mt-4 text-sm leading-relaxed text-silver/80">{step.summary}</p>
              <p className="mt-4 whitespace-pre-line rounded-xl border border-neon-violet/35 bg-neon-violet/10 px-4 py-3 text-sm text-silver">{step.impact}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}