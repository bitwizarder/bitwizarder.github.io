"use client";

import { useEffect, useRef, useState } from "react";
import { getSceneLabel } from "@/data/resumeContent";
import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatLocaleNumber, formatLocaleYearLabel } from "@/lib/localeFormat";

function formatTime(value, locale) {
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${formatLocaleNumber(minutes, locale, { minimumIntegerDigits: 2 })}:${formatLocaleNumber(seconds, locale, { minimumIntegerDigits: 2 })}`;
}

function PodcastPlayer({ src, title }) {
  const { locale, t } = useLocale();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-4 rounded-2xl border border-white/15 bg-black/25 p-3 md:p-4">
      <audio ref={audioRef} preload="none" className="hidden">
        <source src={src} type="audio/mpeg" />
      </audio>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={`${t(isPlaying ? "مکث پادکست" : "پخش پادکست")} ${title}`}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] transition hover:border-neon-cyan/65 hover:bg-neon-cyan/10"
        >
          {isPlaying ? (
            <span className="flex gap-1">
              <span className="h-3 w-1 bg-neon-cyan" />
              <span className="h-3 w-1 bg-neon-cyan" />
            </span>
          ) : (
            <span className="ml-0.5 h-0 w-0 border-b-[7px] border-l-[11px] border-t-[7px] border-b-transparent border-l-neon-cyan border-t-transparent" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            aria-label={`${t("موقعیت پخش پادکست")} ${title}`}
            onChange={(event) => {
              const next = Number(event.target.value || 0);
              const audio = audioRef.current;
              if (!audio) return;
              audio.currentTime = next;
              setCurrentTime(next);
            }}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-cyan-400"
            style={{
              background: `linear-gradient(90deg, rgba(55,244,255,0.95) ${progressPercent}%, rgba(255,255,255,0.16) ${progressPercent}%)`
            }}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="mono-font text-[10px] uppercase tracking-[0.18em] text-silver/65">{formatTime(currentTime, locale)}</span>
            <span className="mono-font text-[10px] uppercase tracking-[0.18em] text-silver/65">{formatTime(duration, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StreamBlock({ id, kicker, title, items, primaryKey, secondaryKey, t }) {
  return (
    <article id={id} className="stream-scene relative py-8 md:py-10">
      <div className="grid gap-7 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="text-[10px] text-neon-cyan">{kicker}</p>
          <h3 className="display-font mt-3 text-3xl font-bold text-white md:text-4xl">{title}</h3>
        </div>
        <div className="lg:col-span-8">
          <div className="space-y-3">
            {items.length ? items.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="stream-item group block border-b border-white/15 pb-4 pt-2 transition hover:border-white/35"
              >
                <p className="display-font text-2xl font-semibold text-white transition group-hover:translate-x-1">{item.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-silver/70">
                  <span className="mono-font uppercase tracking-[0.18em]">{item[primaryKey]}</span>
                  <span className="mono-font uppercase tracking-[0.18em] text-silver/55">{item[secondaryKey]}</span>
                </div>
              </a>
            )) : <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-silver/70">{t("مطالب این بخش به‌زودی منتشر می‌شوند.")}</p>}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MediaStreamsSection({ visible = {} }) {
  const { locale, t } = useLocale();
  const { blogs, podcasts } = useResumeContent();
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".stream-scene").forEach((scene) => {
        const sceneRoot = scene;
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: sceneRoot,
              start: "top 74%",
              end: "bottom 35%",
              toggleActions: "play none none none",
              once: true
            }
          })
          .fromTo(sceneRoot.querySelectorAll("h3, .stream-item"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.55 })
          .fromTo(sceneRoot.querySelector("p"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42 }, 0);
      });

      gsap.fromTo(
        ".podcast-card",
        { y: 22, autoAlpha: 0, filter: "blur(6px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.52,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 74%",
            end: "bottom 35%",
            toggleActions: "play none none none",
            once: true
          }
        }
      );

      gsap.to(".media-ambient", {
        yPercent: -8,
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
    <section ref={sectionRef} className="relative overflow-hidden py-6">
      <div className="media-ambient section-ambient pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(55,244,255,0.12),transparent_35%),radial-gradient(circle_at_88%_85%,rgba(255,77,184,0.12),transparent_38%)]" />
      <div className="section-shell relative z-10">
        {visible.blogs !== false && (
          <StreamBlock id="blogs" kicker={`${getSceneLabel("blogs", locale)} / ${t("مقالات")}`} title={t("نوشته‌ها")} items={blogs} primaryKey="outlet" secondaryKey="date" t={t} />
        )}

        {visible.podcast !== false && (
          <article id="podcast" className="stream-scene relative py-8 md:py-10">
            <div className="grid gap-7 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <p className="text-[10px] text-neon-cyan">{getSceneLabel("podcast", locale)} / {t("پادکست")}</p>
                <h3 className="display-font mt-3 text-3xl font-bold text-white md:text-4xl">{t("اپیزودهای پادکست")}</h3>
              </div>
              <div className="lg:col-span-8">
                <div className="space-y-4">
                  {podcasts.length ? podcasts.map((item) => (
                    <article key={item.title} className="podcast-card rounded-2xl border border-white/15 bg-white/[0.03] p-4 md:p-5">
                      <p className="display-font text-2xl font-semibold text-white">{item.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-silver/70">
                        <span className="mono-font uppercase tracking-[0.18em]">{item.show}</span>
                        <span className="mono-font uppercase tracking-[0.18em] text-silver/55">{formatLocaleYearLabel(item.date, locale)}</span>
                      </div>
                      <PodcastPlayer src={item.audioMp3} title={item.title} />
                      <span className="text-[10px] text-neon-cyan">{t("لینک اپیزود")}</span>

                    </article>
                  )) : <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-silver/70">{t("اپیزودهای پادکست به‌زودی منتشر می‌شوند.")}</p>}
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
