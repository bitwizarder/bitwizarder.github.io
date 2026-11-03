function getNumberLocale(locale) {
  return locale === "fa" ? "fa-IR-u-nu-arabext" : "en-US-u-nu-latn";
}

export function formatLocaleNumber(value, locale, options = {}) {
  return new Intl.NumberFormat(getNumberLocale(locale), options).format(value);
}

export function formatLocaleYear(year, locale) {
  if (locale !== "fa") {
    return formatLocaleNumber(year, locale, { useGrouping: false });
  }

  const date = new Date(Date.UTC(Number(year), 6, 1));
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-arabext", {
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function formatLocaleYearLabel(value, locale) {
  if (value == null || value === "") return "";

  const normalized = String(value).replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
  });

  return normalized.replace(/\b(?:18|19|20|21)\d{2}\b/g, (year) => formatLocaleYear(year, locale));
}

export function formatLocaleDate(value, locale) {
  const date = value instanceof Date ? value : new Date(value);
  const dateLocale = locale === "fa"
    ? "fa-IR-u-ca-persian-nu-arabext"
    : "en-US-u-ca-gregory-nu-latn";

  return new Intl.DateTimeFormat(dateLocale, { dateStyle: "medium", timeZone: "UTC" }).format(date);
}
