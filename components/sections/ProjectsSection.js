"use client";

import { useEffect, useRef, useState } from "react";
import { getSceneLabel } from "@/data/resumeContent";
import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatLocaleNumber } from "@/lib/localeFormat";

const PROJECT_THEMES = [
  { gradient: "radial-gradient(circle_at_15%_10%,rgba(34,229,255,0.2),transparent_38%),radial-gradient(circle_at_80%_18%,rgba(255,61,242,0.15),transparent_44%),linear-gradient(145deg,#0a0d24,#05060f_72%)", cue: "پیش‌نمایش اسناد" },
  { gradient: "radial-gradient(circle_at_18%_12%,rgba(167,139,250,0.2),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(34,229,255,0.15),transparent_46%),linear-gradient(150deg,#0a0d24,#05060f_74%)", cue: "بازار آگهی" },
  { gradient: "radial-gradient(circle_at_22%_16%,rgba(255,61,242,0.2),transparent_42%),radial-gradient(circle_at_80%_22%,rgba(251,191,36,0.15),transparent_48%),linear-gradient(140deg,#0a0d24,#05060f_73%)", cue: "نمونه‌کار دیجیتال" }
];

function formatProjectNumber(value, locale) {
  return formatLocaleNumber(Number(value), locale, { minimumIntegerDigits: 2 });
}

export default function ProjectsSection() {
  const { locale, t } = useLocale();
  const { projects } = useResumeContent();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoProgress, setAutoProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const projectCount = projects.length;
  const activeProject = projects[activeIndex] ?? projects[0];
  const activeTheme = PROJECT_THEMES[activeIndex % PROJECT_THEMES.length];

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%", toggleActions: "play none none none", once: true }
      })
        .fromTo(".projects-label", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 })
        .fromTo(".projects-title", { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, "-=0.25")
        .fromTo(".project-selector-chip", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.45 }, "-=0.35")
        .fromTo(".project-stage", { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, "-=0.3")
        .fromTo(".project-hud", { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, "-=0.35");

      gsap.to(".project-visual-inner", {
        yPercent: -10, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (!stageRef.current || reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      const stage = stageRef.current;
      const stageItems = stage.querySelectorAll(".project-stage-item");
      const visual = stage.querySelector(".project-visual-layer");

      gsap.timeline({ defaults: { ease: "power2.out" } })
        .fromTo(stage, { autoAlpha: 0.7, scale: 0.985, filter: "blur(4px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.45 })
        .fromTo(stageItems, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.4 }, "-=0.24")
        .fromTo(visual, { clipPath: "inset(0 0 0 100% round 1.75rem)" }, { clipPath: "inset(0 0 0 0% round 1.75rem)", duration: 0.7, ease: "power3.out" }, "-=0.32");
    }, stageRef);
    return () => ctx.revert();
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || isPaused || isHovered || projectCount < 2) return undefined;
    const tickMs = 100; const sceneMs = 10000; const increment = (tickMs / sceneMs) * 100;
    const timer = window.setInterval(() => {
      setAutoProgress((value) => {
        const next = value + increment;
        if (next >= 100) { setActiveIndex((index) => (index + 1) % projectCount); return 0; }
        return next;
      });
    }, tickMs);
    return () => window.clearInterval(timer);
  }, [isHovered, isPaused, projectCount, reducedMotion]);

  const selectProject = (index) => { setActiveIndex(index); setAutoProgress(0); };
  const goNext = () => selectProject((activeIndex + 1) % projectCount);
  const goPrev = () => selectProject((activeIndex - 1 + projectCount) % projectCount);

  return (
    <section id="projects" data-section ref={sectionRef} className="relative overflow-hidden py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="section-ambient absolute inset-0 opacity-60" style={{ backgroundImage: activeTheme.gradient }} />
        <div className="grain-overlay section-ambient absolute inset-0" />
      </div>
      <div className="section-shell">
        <div className="max-w-4xl">
          <p className="projects-label label-chip">{getSceneLabel("projects", locale)} / {t("پروژه‌ها")}</p>
          <h2 className="projects-title display-font mt-6 text-balance text-[clamp(2.1rem,5vw,4.8rem)] font-bold leading-[1.2]">
            {t("پروژه‌های شاخص با تمرکز بر کیفیت و نتیجه.")}
          </h2>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mb-5 text-[10px] text-silver/65">{t("فهرست پروژه‌ها")}</p>
            <div className="project-hud mb-6">
              <div className="flex items-center justify-between text-[10px] text-silver/65">
                <span>{isPaused ? t("انتخاب دستی پروژه") : t("نمایش خودکار")}</span>
                <span>{formatProjectNumber(activeIndex + 1, locale)} / {formatProjectNumber(projectCount, locale)}</span>
              </div>
              {!reducedMotion && projectCount > 1 && (
                <>
                  <div
                    className="mt-2 h-[2px] overflow-hidden bg-white/10"
                    role="progressbar"
                    aria-label={t("پیشرفت نمایش پروژه")}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(autoProgress)}
                  >
                    <div className="h-full bg-neon-cyan/80 transition-[width] duration-100" style={{ width: `${autoProgress}%` }} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPaused((paused) => !paused)}
                    className="mt-3 text-[10px] text-silver/65 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
                    aria-label={t(isPaused ? "شروع نمایش خودکار پروژه‌ها" : "توقف نمایش خودکار پروژه‌ها")}
                  >
                    {t(isPaused ? "شروع نمایش خودکار" : "توقف نمایش خودکار")}
                  </button>
                </>
              )}
            </div>

            <div className="relative pr-7">
              <div className="pointer-events-none absolute bottom-1 right-2 top-1 w-px bg-gradient-to-b from-neon-cyan/35 via-white/20 to-transparent" />
              <div className="project-list-scroll max-h-[22rem] space-y-2 overflow-x-hidden overflow-y-auto pl-2">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => selectProject(index)}
                    className="project-selector-chip group relative w-full min-w-0 max-w-full py-3 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
                    aria-pressed={activeIndex === index}
                    aria-label={`${locale === "fa" ? "نمایش پروژه" : "Show project"} ${project.title}`}
                  >
                    <span className={`absolute -right-[1.62rem] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border transition ${activeIndex === index ? "border-neon-cyan bg-neon-cyan shadow-[0_0_16px_rgba(34,229,255,0.8)]" : "border-white/35 bg-ink group-hover:border-white/70"}`} />
                    <p className={`text-[10px] transition ${activeIndex === index ? "text-neon-cyan" : "text-silver/55"}`}>{locale === "fa" ? "پروژه" : "Project"} {formatProjectNumber(project.id, locale)}</p>
                    <p className={`mt-1 text-sm font-medium transition ${activeIndex === index ? "text-white" : "text-silver/80 group-hover:text-white"}`}>{project.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <article ref={stageRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="project-stage project-stage-shell relative isolate overflow-hidden px-1 py-5 md:px-3 lg:col-span-8 lg:px-5 lg:py-7">
            <div className="section-ambient absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(255,255,255,0.05),transparent_45%)]" />
            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="relative space-y-4 lg:col-span-6 lg:pl-4">
                <div className="pointer-events-none absolute -right-4 bottom-2 top-2 hidden w-px bg-gradient-to-b from-transparent via-white/20 to-transparent lg:block" />
                <p className="project-stage-item text-xs text-neon-cyan">{locale === "fa" ? "پروژه" : "Project"} {formatProjectNumber(activeProject.id, locale)} / {t(activeTheme.cue)}</p>
                <h3 className="project-stage-item display-font text-balance text-3xl font-bold text-white md:text-4xl">{activeProject.title}</h3>
                <div className="project-stage-item space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-silver/55">{t("معرفی")}</p>
                    <p className="text-base leading-relaxed text-silver/82">{activeProject.concept}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-silver/55">{t("تأثیر")}</p>
                    <p className="text-base leading-relaxed text-silver/82">{activeProject.impact}</p>
                  </div>
                </div>
                <div className="project-stage-item flex flex-wrap gap-2">
                  {activeProject.stack.map((tag) => <span key={tag} className="border-b border-white/25 pb-1 text-[10px] text-silver/75">{tag}</span>)}
                </div>
                <div className="project-stage-item flex flex-wrap items-center gap-3">
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="magnetic-button rounded-full border border-white/35 px-5 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
                  >
                    {activeProject.cta}
                  </a>
                  <button type="button" onClick={goPrev} aria-label={t("پروژه قبلی")} className="px-3 py-2 text-xs text-silver/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan">{t("قبلی")}</button>
                  <button type="button" onClick={goNext} aria-label={t("پروژه بعدی")} className="px-3 py-2 text-xs text-silver/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan">{t("بعدی")}</button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="project-visual-layer relative overflow-hidden [clip-path:polygon(0_0,100%_0,100%_100%,16%_100%,0_87%)]">
                  <div className="project-visual-inner relative min-h-[220px] md:min-h-[280px]" style={{ backgroundImage: activeTheme.gradient }}>
                    <div className="absolute right-5 top-5 flex gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-neon-magenta" />
                      <span className="h-2.5 w-2.5 rounded-full bg-neon-violet" />
                      <span className="h-2.5 w-2.5 rounded-full bg-neon-cyan" />
                    </div>
                    <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/40 px-3 py-1 backdrop-blur">
                      <p className="text-[10px] text-silver/80">{t("پیش‌نمایش پروژه")}</p>
                    </div>
                    <div className="absolute bottom-4 left-4 right-12 rounded-xl border border-white/10 bg-abyss/65 px-3 py-2 backdrop-blur-md">
                      <p className="text-[10px] text-silver/60">{t("فناوری‌های اصلی")}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {activeProject.stack.map((technology) => (
                          <span key={technology} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] leading-relaxed text-silver/85">
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-neon-violet/20 blur-2xl" />
                    <div className="absolute -right-10 bottom-14 h-20 w-20 rounded-full bg-neon-cyan/20 blur-2xl" />
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_35%,rgba(255,255,255,0.08)_50%,transparent_65%)] opacity-20 mix-blend-screen" />
                    <div className="grid-overlay absolute inset-0 opacity-25" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}