"use client";

import { useLocale, useResumeContent } from "@/components/LocaleProvider";
import { formatLocaleYear } from "@/lib/localeFormat";

export default function Footer() {
  const { locale, t } = useLocale();
  const { personal, siteMeta } = useResumeContent();
  const year = formatLocaleYear(new Date().getFullYear(), locale);

  return (
    <footer className="relative border-t border-white/10 py-8">
      <div className="section-shell flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="text-xs text-silver/55">
          {siteMeta.footerTagline}
        </p>
        <div className="flex flex-col items-start gap-1 md:items-end">
          <p className="text-xs text-silver/45">
            © {year} {personal.name}
          </p>
          <a
            href={siteMeta.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("دیدن سورس کد در گیت‌هاب")}
            className="text-[10px] text-neon-cyan/85 transition hover:text-neon-cyan"
          >
            {t("سورس کد در گیت‌هاب")}
          </a>
        </div>
      </div>
    </footer>
  );
}
