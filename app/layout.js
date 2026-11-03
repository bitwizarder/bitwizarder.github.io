import { IBM_Plex_Sans_Arabic, Manrope, Space_Grotesk, Vazirmatn } from "next/font/google";
import { contact, personal, siteMeta } from "@/data/resumeContent";
import githubSnapshot from "@/data/githubSnapshot.json";
import themeConfig from "@/data/themeConfig.json";
import { LocaleProvider } from "@/components/LocaleProvider";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn"
});
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic"
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL(siteMeta.siteUrl),
  title: {
    default: `${personal.name} | ${siteMeta.titleSuffix}`,
    template: `%s | ${siteMeta.titleSuffix}`
  },
  description: siteMeta.description,
  applicationName: siteMeta.titleSuffix,
  keywords: siteMeta.keywords,
  verification: {
    google: "gFNW3zkm6grfHGJlF8t0XIQG-ikVEkdkwkeScB8nNl8"
  },
  authors: [{ name: personal.name, url: siteMeta.siteUrl }],
  creator: personal.name,
  publisher: personal.name,
  category: "technology",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: {
    type: "website",
    url: siteMeta.siteUrl,
    title: `${personal.name} | ${siteMeta.titleSuffix}`,
    description: siteMeta.description,
    siteName: siteMeta.titleSuffix,
    locale: siteMeta.locale,
    images: [{
      url: githubSnapshot?.profile?.avatarUrl || siteMeta.ogImage,
      width: 1200,
      height: 630,
      alt: `تصویر پروفایل ${personal.name}`
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: `${personal.name} | ${siteMeta.titleSuffix}`,
    description: siteMeta.description,
    images: [githubSnapshot?.profile?.avatarUrl || siteMeta.ogImage],
    creator: siteMeta.twitterHandle
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteMeta.themeColor
};

function hexToRgbString(hex) {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const int = Number.parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `${r} ${g} ${b}`;
}

export default function RootLayout({ children }) {
  const email = contact.methods.find((item) => item.label.toLowerCase() === "email")?.value;
  const sameAs = contact.methods.filter((item) => item.href.startsWith("http")).map((item) => item.href);

  // 👈 ما به زور فونت رو وزیرمتن می‌کنیم
  const themeVars = {
    "--bg-0": themeConfig.base.bg0,
    "--bg-1": themeConfig.base.bg1,
    "--surface-a": themeConfig.base.surfaceA,
    "--surface-b": themeConfig.base.surfaceB,
    "--surface-a-rgb": hexToRgbString(themeConfig.base.surfaceA),
    "--surface-b-rgb": hexToRgbString(themeConfig.base.surfaceB),
    "--text-main": themeConfig.base.textMain,
    "--text-soft": themeConfig.base.textSoft,
    "--loader-bg": themeConfig.loader?.background || themeConfig.base.bg0,
    "--loader-text": themeConfig.loader?.text || themeConfig.base.textMain,
    "--bg-start": themeConfig.background.start,
    "--bg-mid": themeConfig.background.mid,
    "--bg-end": themeConfig.background.end,
    "--violet": themeConfig.accent.violet,
    "--cyan": themeConfig.accent.cyan,
    "--magenta": themeConfig.accent.magenta,
    "--amber": themeConfig.accent.amber,
    "--violet-rgb": hexToRgbString(themeConfig.accent.violet),
    "--cyan-rgb": hexToRgbString(themeConfig.accent.cyan),
    "--magenta-rgb": hexToRgbString(themeConfig.accent.magenta),
    "--amber-rgb": hexToRgbString(themeConfig.accent.amber),
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: siteMeta.titleSuffix, url: siteMeta.siteUrl, description: siteMeta.description, inLanguage: "fa" },
      { "@type": "Person", name: personal.name, jobTitle: personal.title, description: personal.heroStatement, url: siteMeta.siteUrl, email: email ? `mailto:${email}` : undefined, sameAs }
    ]
  };

  return (
    // 👈 اضافه کردن lang="fa" و dir="rtl"
    <html lang="fa" dir="rtl" data-locale="fa" className={`${vazirmatn.variable} ${ibmPlexSansArabic.variable} ${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans" style={themeVars}>
        <LocaleProvider>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}