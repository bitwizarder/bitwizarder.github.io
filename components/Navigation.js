"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { sectionVisibility } from "@/data/resumeContent";
import { useLocale } from "@/components/LocaleProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatLocaleNumber } from "@/lib/localeFormat";

export default function Navigation() {
  const { locale, setLocale, t, content } = useLocale();
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredSection, setHoveredSection] = useState(null);
  const [displaySceneId, setDisplaySceneId] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const progressFillRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const sceneMapButtonRef = useRef(null);
  const closingRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const items = useMemo(() => content.sectionNav.filter((item) => sectionVisibility[item.id] !== false), [content]);
  const activeLabel = items.find((item) => item.id === activeSection)?.label || t("صحنه");
  const previewTargetId = hoveredSection || activeSection;
  const displayScene = items.find((item) => item.id === displaySceneId) || items[0];
  const displayIndex = Math.max(0, items.findIndex((item) => item.id === displayScene?.id));
  const displaySceneNumber = formatLocaleNumber(displayIndex + 1, locale, { minimumIntegerDigits: 2 });

  const sceneDetails = content.sceneDetails || {
    hero: "فضای شروع و اولین برخورد با سایت.",
    about: "هویت، مسیر و داستان شخصی من.",
    journey: "خط زمانی مسیر شغلی و تحول نقش‌ها.",
    skills: "توانمندی‌های اصلی و دامنه فنی.",
    education: "پایه‌های آکادمیک و حرفه‌ای.",
    oss: "پروژه‌های متن‌باز و کدهای عمومی.",
    projects: "داستان پروژه‌های منتخب و نتایج آن‌ها.",
    achievements: "محصولات و دستاوردها.",
    blogs: "نوشته‌ها و بینش‌های مستند شده.",
    podcast: "مکالمات و اپیزودهای ضبط شده.",
    github: "آمار و اطلاعات عمومی پروفایل گیت‌هاب.",
    experience: "رویکرد من در طراحی و ساخت محصول.",
    philosophy: "اصول پشت اجرای محصول.",
    contact: "دعوت نهایی برای همکاری."
  };

  useEffect(() => {
    let frameId = 0;
    let displayedProgress = 0;
    let sections = [];

    const resolveSections = () => {
      sections = items.map((item) => document.getElementById(item.id)).filter(Boolean);
    };

    const update = () => {
      if (!sections.length) resolveSections();

      const scrollTop = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetProgress = Math.min(1, Math.max(0, scrollTop / max));
      displayedProgress += (targetProgress - displayedProgress) * 0.18;
      if (Math.abs(targetProgress - displayedProgress) < 0.001) displayedProgress = targetProgress;

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${displayedProgress})`;
      }

      if (sections.length) {
        const viewportProbe = window.innerHeight * 0.42;
        let nextActive = sections[0].id;
        let nearestDistance = Infinity;
        let hasExactMatch = false;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= viewportProbe && rect.bottom >= viewportProbe) {
            hasExactMatch = true;
            nextActive = section.id;
          }
          if (!hasExactMatch) {
            const center = rect.top + rect.height / 2;
            const distance = Math.abs(center - viewportProbe);
            if (distance < nearestDistance) {
              nearestDistance = distance;
              nextActive = section.id;
            }
          }
        });

        setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
      }
      frameId = window.requestAnimationFrame(update);
    };

    resolveSections();
    frameId = window.requestAnimationFrame(update);
    window.addEventListener("resize", resolveSections);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resolveSections);
    };
  }, [items]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSceneMap();
        return;
      }

      if (event.key !== "Tab" || !overlayRef.current) return;
      const focusable = overlayRef.current.querySelectorAll("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!overlayRef.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === overlayRef.current)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === overlayRef.current)) {
        event.preventDefault();
        first?.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, reducedMotion]);

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return undefined;
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    const ctx = gsap.context(() => {
      const sceneItems = gsap.utils.toArray(".scene-map-item");
      const meta = gsap.utils.toArray(".scene-map-meta");

      if (menuOpen) {
        closingRef.current = false;
        gsap.set(overlay, { display: "block", pointerEvents: "auto", autoAlpha: 0 });

        if (reducedMotion) {
          gsap.set(overlay, { autoAlpha: 1 });
          gsap.set(panel, { autoAlpha: 1, y: 0, scale: 1 });
          gsap.set(sceneItems, { autoAlpha: 1, x: 0 });
          gsap.set(meta, { autoAlpha: 1, y: 0 });
          closeButtonRef.current?.focus();
          return;
        }

        gsap.timeline()
          .to(overlay, { autoAlpha: 1, duration: 0.28, ease: "power2.out" })
          .fromTo(panel, { y: 34, scale: 0.97, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.42, ease: "power3.out" }, 0.02)
          /* 👈 تغییر x از -20 به 20 برای ورود از سمت راست در RTL */
          .fromTo(sceneItems, { x: 20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.04, duration: 0.4, ease: "power3.out" }, 0.12)
          .fromTo(meta, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.32, ease: "power2.out" }, 0.18)
          .call(() => closeButtonRef.current?.focus());
      }
    }, overlayRef);
    return () => ctx.revert();
  }, [menuOpen, reducedMotion]);

  useEffect(() => {
    if (!menuOpen || !displayScene || previewTargetId === displayScene.id) return undefined;
    if (reducedMotion) {
      setDisplaySceneId(previewTargetId);
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.timeline().to(".scene-preview-animate", {
        autoAlpha: 0, y: 8, filter: "blur(12px)", duration: 0.16, stagger: 0.03, ease: "power2.out",
        onComplete: () => setDisplaySceneId(previewTargetId)
      });
    }, panelRef);
    return () => ctx.revert();
  }, [displayScene, menuOpen, previewTargetId, reducedMotion]);

  useEffect(() => {
    if (!menuOpen || !displayScene) return undefined;
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(".scene-preview-animate",
        { autoAlpha: 0, y: 10, filter: "blur(12px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.28, stagger: 0.04, ease: "power2.out" }
      );
    }, panelRef);
    return () => ctx.revert();
  }, [displayScene, menuOpen, reducedMotion]);

  const closeSceneMap = (onClosed) => {
    if (!menuOpen) { onClosed?.(); return; }
    if (closingRef.current) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) {
      setMenuOpen(false);
      onClosed?.();
      window.requestAnimationFrame(() => sceneMapButtonRef.current?.focus());
      return;
    }

    closingRef.current = true;
    setHoveredSection(null);
    gsap.killTweensOf([".scene-map-item", ".scene-map-meta", ".scene-preview-animate", overlay, panel]);

    if (reducedMotion) {
      gsap.set(overlay, { autoAlpha: 0, display: "none", pointerEvents: "none" });
      closingRef.current = false;
      setMenuOpen(false);
      onClosed?.();
      window.requestAnimationFrame(() => sceneMapButtonRef.current?.focus());
      return;
    }

    gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: "none", pointerEvents: "none" });
        closingRef.current = false;
        setMenuOpen(false);
        onClosed?.();
        window.requestAnimationFrame(() => sceneMapButtonRef.current?.focus());
      }
    })
      /* 👈 تغییر x برای خروج به سمت راست */
      .to(".scene-map-item", { x: 12, autoAlpha: 0, duration: 0.2, stagger: { each: 0.02, from: "end" }, ease: "power2.in" })
      .to(".scene-map-meta", { autoAlpha: 0, y: 10, duration: 0.16, ease: "power2.in" }, 0)
      .to(panel, { y: 22, scale: 0.985, autoAlpha: 0, duration: 0.24, ease: "power2.in" }, 0.05)
      .to(overlay, { autoAlpha: 0, duration: 0.24, ease: "power1.out" }, 0.06);
  };

  const handleJump = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    setDisplaySceneId(id);
    const behavior = reducedMotion ? "auto" : "smooth";
    if (!menuOpen) { target.scrollIntoView({ behavior, block: "start" }); return; }
    closeSceneMap(() => target.scrollIntoView({ behavior, block: "start" }));
  };

  return (
    <>
      <div className="fixed right-0 top-0 z-[74] h-[2px] w-full bg-white/10">
        <div ref={progressFillRef} className="h-full origin-right scale-x-0 bg-gradient-to-l from-neon-cyan via-neon-violet to-neon-magenta" />
      </div>

      <header className="fixed right-1/2 top-4 z-[72] w-[calc(100%-1.5rem)] translate-x-1/2 md:w-[min(1120px,93vw)]">
        <nav className="surface-panel rounded-2xl px-4 py-3 shadow-card md:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => handleJump(items[0]?.id || "hero")}
              aria-label={t("بازگشت به ابتدای صفحه")}
              className="display-font text-sm font-bold text-silver/90"
            >
              {locale === "fa" ? "م.آ." : "MA"}
            </button>
            <div className="hidden items-center gap-3 lg:flex">
              <span className="text-xs text-silver/60">{t("در حال مطالعه")}</span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white">{activeLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLocale(locale === "fa" ? "en" : "fa")}
                aria-label={t(locale === "fa" ? "تغییر زبان به انگلیسی" : "تغییر زبان به فارسی")}
                className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-semibold text-silver/80 transition hover:border-neon-cyan/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
              >
                {locale === "fa" ? "EN" : "فا"}
              </button>
              <button
                ref={sceneMapButtonRef}
                onClick={() => {
                  if (menuOpen) { closeSceneMap(); return; }
                  setDisplaySceneId(activeSection);
                  setMenuOpen(true);
                }}
                aria-expanded={menuOpen}
                aria-controls="scene-map-dialog"
                className="rounded-full border border-white/25 px-4 py-1.5 text-xs text-silver/80 transition hover:border-white/50 hover:text-white"
              >
                {t("نقشه صحنه")}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div
        ref={overlayRef}
        id="scene-map-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={t("نقشه مسیر سایت")}
        tabIndex={-1}
        className="fixed inset-0 z-[71] hidden bg-[rgba(4,4,10,0.72)] backdrop-blur-[8px]"
      >
        <div className="absolute inset-0 section-ambient bg-[radial-gradient(circle_at_15%_18%,rgba(34,229,255,0.12),transparent_42%),radial-gradient(circle_at_84%_78%,rgba(167,139,250,0.18),transparent_44%)]" />
        <div className="grain-overlay absolute inset-0 opacity-25" />
        <div className="pointer-events-none absolute inset-y-0 right-1/2 w-px bg-gradient-to-b from-transparent via-white/12 to-transparent max-lg:hidden" />

        <div className="section-shell relative z-10 flex min-h-screen items-center py-24">
          <div ref={panelRef} className="scene-map-panel relative w-full">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-silver/65">{t("ناوبر صحنه")}</p>
                <p className="scene-map-meta display-font mt-2 text-2xl font-semibold text-white md:text-3xl">{t("نقشه مسیر")}</p>
              </div>
              <button ref={closeButtonRef} onClick={() => closeSceneMap()} className="scene-map-meta rounded-full border border-white/25 bg-white/[0.03] px-4 py-1.5 text-xs text-silver/80 transition hover:border-white/55 hover:text-white">
                {t("بستن")}
              </button>
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="no-scrollbar max-h-[60vh] space-y-1 overflow-y-auto pl-2" onMouseLeave={() => setHoveredSection(null)}>
                  {items.map((item, index) => {
                    const isActive = activeSection === item.id;
                    const sceneNo = formatLocaleNumber(index + 1, locale, { minimumIntegerDigits: 2 });
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleJump(item.id)}
                        onMouseEnter={() => setHoveredSection(item.id)}
                        onFocus={() => setHoveredSection(item.id)}
                        onBlur={() => setHoveredSection(null)}
                        className={`scene-map-item group relative flex w-full items-center gap-4 border-b px-2 py-4 text-right transition md:py-5 ${isActive ? "border-neon-cyan/45" : "border-white/12 hover:border-white/30"}`}
                      >
                        <span className={`absolute -right-2 top-1/2 h-9 w-[2px] -translate-y-1/2 rounded-full transition ${isActive ? "bg-neon-cyan shadow-[0_0_18px_rgba(34,229,255,0.9)]" : "bg-transparent"}`} />
                        <span className={`display-font text-3xl leading-none md:text-4xl ${isActive ? "text-neon-cyan" : "text-white/30 group-hover:text-white/60"}`}>{sceneNo}</span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-[10px] ${isActive ? "text-neon-cyan" : "text-silver/55"}`}>{t("صحنه")}</p>
                          <p className={`mt-1 text-sm md:text-base ${isActive ? "text-white" : "text-silver/78 group-hover:text-white"}`}>{item.label}</p>
                        </div>
                        <span className={`h-px w-14 bg-gradient-to-l ${isActive ? "from-neon-cyan via-neon-violet to-neon-magenta" : "from-white/0 to-white/20"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="scene-map-meta relative lg:col-span-5">
                <p className="scene-preview-animate display-font pointer-events-none absolute -top-8 left-0 text-[18vw] font-bold leading-none text-white/[0.06] lg:text-[8vw]">
                  {displaySceneNumber}
                </p>
                <div className="relative mt-6 lg:mt-10">
                  <p className="scene-preview-animate text-[10px] text-silver/60">{t("صحنه فعلی")}</p>
                  <p className="scene-preview-animate display-font mt-3 text-4xl font-bold leading-[1.25] text-white md:text-5xl">{displayScene?.label || activeLabel}</p>
                  <p className="scene-preview-animate mt-2 text-[10px] text-neon-cyan">{t("صحنه")} {displaySceneNumber}</p>
                  <p className="scene-preview-animate mt-4 max-w-sm text-sm leading-relaxed text-silver/75 md:text-base">{sceneDetails[displayScene?.id] || t("پیش‌نمایش صحنه.")}</p>
                  <div className="mt-6 h-px bg-gradient-to-l from-neon-cyan/70 via-white/30 to-transparent" />
                  <p className="mt-4 text-[10px] text-neon-cyan">
                    {formatLocaleNumber(items.length, locale)} {t("صحنه بارگذاری شد")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}