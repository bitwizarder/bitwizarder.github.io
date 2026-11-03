"use client";

import { useEffect, useRef } from "react";
import githubSnapshot from "@/data/githubSnapshot.json";
import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function HeroSection() {
  const { locale, t } = useLocale();
  const { personal } = useResumeContent();
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const avatar = githubSnapshot?.profile?.avatarUrl;

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return undefined;

    let cleanup = () => {};

    const initHeroAnimations = () => {
      const ctx = gsap.context(() => {
        const root = sectionRef.current;
        const name = root.querySelector(".hero-name");
        const field = root.querySelector(".hero-field");
        const statement = root.querySelector(".hero-statement");
        const cue = root.querySelector(".hero-scroll-cue");
        const content = root.querySelector(".hero-scene-content");
        const slowLayer = root.querySelector(".hero-layer-slow");
        const fastLayers = root.querySelectorAll(".hero-layer-fast");

        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            end: "bottom 40%",
            toggleActions: "play none none none",
            once: true
          }
        });

        intro
          .from(name, { y: 20, autoAlpha: 0, duration: 0.7 })
          .from(field, { y: 14, autoAlpha: 0, duration: 0.55 }, "-=0.35")
          .fromTo(
            statement,
            { y: 18, autoAlpha: 0, filter: "blur(8px)" },
            { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.65 },
            "-=0.3"
          )
          .fromTo(cue, { y: -6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45 }, "-=0.15");

        gsap.to(content, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top+=20%",
            scrub: 1
          }
        });

        gsap.to(slowLayer, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1
          }
        });

        gsap.to(fastLayers, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1
          }
        });
      }, sectionRef);

      cleanup = () => ctx.revert();
    };

    const onLoaderDone = () => initHeroAnimations();
    if (window.__cv2LoaderDone) {
      initHeroAnimations();
    } else {
      window.addEventListener("cv2:loader-done", onLoaderDone, { once: true });
    }

    return () => {
      window.removeEventListener("cv2:loader-done", onLoaderDone);
      cleanup();
    };
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      data-section
      ref={sectionRef}
      className="hero-backdrop relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 md:pb-20 md:pt-36"
    >
      <div className="hero-layer-slow section-ambient absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(167,139,250,0.22),transparent_42%),radial-gradient(circle_at_80%_35%,rgba(34,229,255,0.12),transparent_44%)]" />

      <div className="hero-layer-fast absolute right-[8%] top-[14%] h-52 w-52 rounded-full bg-neon-magenta/22 blur-[110px]" />
      <div className="hero-layer-fast absolute left-[8%] top-[42%] h-52 w-52 rounded-full bg-neon-cyan/18 blur-[120px]" />

      <div className="section-shell hero-scene-content relative z-10 w-full">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 mx-auto max-w-[820px] text-center lg:order-1 lg:col-span-7 lg:mx-0 lg:text-right">
            <p className="mb-5 text-sm text-neon-cyan md:text-base">{personal.heroKicker}</p>
            <h1 className="hero-name display-font text-balance text-[clamp(2.1rem,5.4vw,4.9rem)] font-bold leading-[1.25] text-white">
              {personal.name}
            </h1>
            <p className="hero-field mt-3 text-sm text-neon-cyan md:text-base">{personal.title}</p>
            <p className="mt-1 text-xs text-silver/55 md:text-sm">{personal.location}</p>
            <p className="mt-5 text-balance text-xl font-medium leading-[1.4] text-white md:text-2xl">
              {personal.heroHeadline}
            </p>
            <p className="hero-statement mx-auto mt-3 max-w-lg text-balance text-sm leading-relaxed text-silver/75 md:text-base lg:mx-0">
              {personal.heroStatement}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
              <button
                type="button"
                onClick={() => document.getElementById("projects")?.scrollIntoView({
                  behavior: reducedMotion ? "auto" : "smooth",
                  block: "start"
                })}
                className="rounded-full border border-neon-cyan/55 bg-neon-cyan/10 px-5 py-2 text-sm text-white transition hover:border-neon-cyan hover:bg-neon-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
              >
                {t("دیدن پروژه‌ها")}
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("contact")?.scrollIntoView({
                  behavior: reducedMotion ? "auto" : "smooth",
                  block: "start"
                })}
                className="rounded-full border border-white/25 px-5 py-2 text-sm text-silver/85 transition hover:border-white/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
              >
                {t("تماس با من")}
              </button>
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-5 rounded-full bg-neon-cyan/15 blur-3xl" />
              {avatar ? (
                <img
                  src={avatar}
                  alt={t("تصویر پروفایل محمد آیت")}
                  className="relative h-48 w-48 rounded-full border border-white/20 object-cover shadow-card md:h-64 md:w-64 lg:h-80 lg:w-80"
                  fetchPriority="high"
                />
              ) : (
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/20 bg-white/5 text-5xl font-bold text-white shadow-card md:h-64 md:w-64 lg:h-80 lg:w-80">
                  {locale === "fa" ? "م.آ." : "MA"}
                </div>
              )}
              <span className="absolute bottom-5 left-2 h-4 w-4 rounded-full border-4 border-abyss bg-neon-cyan shadow-[0_0_18px_rgba(34,229,255,0.8)]" />
            </div>
          </div>
        </div>
      </div>

      <button
        aria-label={t("رفتن به بخش درباره من")}
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="hero-scroll-cue absolute bottom-4 left-1/2 z-20 -translate-x-1/2 md:bottom-6"
      >
        <span className="inline-flex flex-col items-center text-[11px] text-silver/70">
          {t("بیشتر ببینید")}
          <span className="mt-2 h-8 w-px animate-pulseCue bg-gradient-to-b from-silver/70 to-transparent" />
        </span>
      </button>
    </section>
  );
}