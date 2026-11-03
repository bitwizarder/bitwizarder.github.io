"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as persianContent from "@/data/resumeContent";
import { englishContent, englishUi } from "@/data/englishContent";

const LocaleContext = createContext(null);
const englishResume = { ...persianContent, ...englishContent };

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState("fa");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("portfolio-locale");
    if (savedLocale === "en" || savedLocale === "fa") setLocale(savedLocale);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "fa" ? "rtl" : "ltr";
    root.dataset.locale = locale;
    window.localStorage.setItem("portfolio-locale", locale);

    const title = locale === "fa"
      ? `${persianContent.personal.name} | ${persianContent.siteMeta.titleSuffix}`
      : `${englishContent.personal.name} | ${englishContent.siteMeta.titleSuffix}`;
    document.title = title;
    const titleTimeout = window.setTimeout(() => {
      document.title = title;
    }, 250);

    const description = document.querySelector('meta[name="description"]');
    const localizedDescription = locale === "fa" ? persianContent.siteMeta.description : englishContent.siteMeta.description;
    if (description) {
      description.setAttribute("content", localizedDescription);
    }

    ["og:title", "twitter:title"].forEach((name) => {
      document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)?.setAttribute("content", title);
    });
    ["og:description", "twitter:description"].forEach((name) => {
      document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)?.setAttribute("content", localizedDescription);
    });
    const openGraphLocale = document.querySelector('meta[property="og:locale"]');
    if (openGraphLocale) openGraphLocale.setAttribute("content", locale === "fa" ? "fa_IR" : "en_US");
    return () => window.clearTimeout(titleTimeout);
  }, [locale]);

  const t = useCallback((text) => (
    locale === "en" ? englishUi[text] || text : text
  ), [locale]);
  const content = locale === "en" ? englishResume : persianContent;
  const value = useMemo(() => ({ locale, setLocale, t, content }), [content, locale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

export function useResumeContent() {
  return useLocale().content;
}
