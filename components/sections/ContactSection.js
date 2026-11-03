"use client";

import { useEffect, useRef } from "react";
import { getSceneLabel } from "@/data/resumeContent";
import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function ContactSection() {
  const { locale, t } = useLocale();
  const { contact } = useResumeContent();
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
        .fromTo(".contact-title", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85 })
        .fromTo(".contact-copy", { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, "-=0.5")
        .fromTo(".contact-card", { y: 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.14, duration: 0.7 }, "-=0.38")
        .fromTo(".contact-footer-glow", { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9 }, "-=0.45");

      gsap.to(".contact-ambient", {
        y: -20,
        x: 12,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sectionRef);

    const cards = Array.from(sectionRef.current.querySelectorAll(".magnetic-button"));
    const listeners = cards.map((card) => {
      const move = (event) => {
        const rect = card.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;
        gsap.to(card, {
          x: offsetX * 0.12,
          y: offsetY * 0.14,
          duration: 0.35,
          ease: "power2.out"
        });
      };

      const leave = () => gsap.to(card, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });

      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      return () => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      };
    });

    return () => {
      listeners.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section id="contact" data-section ref={sectionRef} className="relative overflow-hidden pb-16 pt-20 md:pb-20 md:pt-28">
      <div className="contact-ambient absolute -right-8 top-12 h-44 w-44 rounded-full bg-neon-cyan/20 blur-[90px]" />
      <div className="contact-ambient absolute -left-10 bottom-4 h-56 w-56 rounded-full bg-neon-magenta/20 blur-[110px]" />

      <div className="section-shell relative z-10">
        <p className="label-chip">{getSceneLabel("contact", locale)} / {t("تماس")}</p>
        <h2 className="contact-title display-font text-balance mt-7 max-w-5xl text-[clamp(2.1rem,5.8vw,5.4rem)] font-bold leading-[1.3] text-white">
          {contact.headline}
        </h2>
        <p className="contact-copy mt-6 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">{contact.statement}</p>

        <div className="mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          {contact.methods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              target={method.href.startsWith("http") ? "_blank" : undefined}
              rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="contact-card magnetic-button surface-panel rounded-2xl border border-white/20 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
            >
              <p className="mono-font text-[10px] uppercase tracking-[0.22em] text-silver/65">{method.label}</p>
              <p className="mt-3 text-sm font-semibold text-white">{method.value}</p>
            </a>
          ))}
        </div>

        <div className="contact-footer-glow mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/65 to-transparent" />
      </div>
    </section>
  );
}
