import { formatLocaleNumber } from "@/lib/localeFormat";

export const sectionNav = [
  { id: "hero", label: "شروع" },
  { id: "about", label: "درباره من" },
  { id: "journey", label: "مسیر شغلی" },
  { id: "skills", label: "مهارت‌ها" },
  { id: "education", label: "تحصیلات" },
  { id: "oss", label: "متن‌باز" },
  { id: "projects", label: "پروژه‌ها" },
  { id: "achievements", label: "افتخارات" },
  { id: "blogs", label: "مقالات" },
  { id: "podcast", label: "پادکست" },
  { id: "github", label: "گیت‌هاب" },
  { id: "experience", label: "تجربیات کلیدی" },
  { id: "philosophy", label: "فلسفه کاری" },
  { id: "contact", label: "تماس" }
];

export const sectionVisibility = {
  hero: true,
  about: true,
  journey: true,
  skills: true,
  education: true,
  oss: true,
  projects: true,
  achievements: true,
  blogs: false,
  podcast: false,
  github: true,
  experience: true,
  philosophy: true,
  contact: true
};

export function getSceneLabel(id, locale = "fa") {
  const index = sectionNav
    .filter((item) => sectionVisibility[item.id] !== false)
    .findIndex((item) => item.id === id);

  if (index < 0) return "بخش";

  const number = formatLocaleNumber(index + 1, locale, { minimumIntegerDigits: 2 });
  return locale === "fa" ? `صحنه ${number}` : `Scene ${number}`;
}

export const siteMeta = {
  titleSuffix: "توسعه‌دهنده فول‌استک وب",
  footerTagline: "طراحی و توسعه با دقت، کنجکاوی و توجه به جزئیات.",
  description: "رزومه و نمونه‌کارهای محمد آیت، توسعه‌دهنده فول‌استک وب؛ سازنده محصولات دیجیتال با تمرکز بر Laravel، Next.js و تجربه کاربری.",
  siteUrl: "https://bitwizarder.github.io",
  repositoryUrl: "https://github.com/bitwizarder/bitwizarder.github.io",
  locale: "fa_IR",
  ogImage: "/og-profile.jpg",
  keywords: [
    "محمد آیت",
    "bitwizarder",
    "توسعه‌دهنده فول‌استک",
    "رزومه برنامه‌نویس",
    "طراحی وب",
    "Laravel",
    "Next.js",
    "BitWizarder"
  ],
  twitterHandle: "@bitwizarder",
  themeColor: "#06050d"
};

export const personal = {
  name: "محمد آیت",
  title: "توسعه‌دهنده فول‌استک وب",
  location: "ایران / دورکاری",
  heroKicker: "سازنده تجربه‌های دیجیتال",
  heroHeadline: "من تجربه‌های دیجیتال مدرن، روان و ماندگار می‌سازم.",
  heroStatement: "طراحی و توسعه وب‌اپلیکیشن‌های سریع و قابل‌اعتماد با Laravel، Next.js و TypeScript.",
  aboutHeading: "من محصولات دیجیتالی می‌سازم که سریع، مدرن و ماندگار هستند.",
  aboutParagraphs: [
    "من محمد آیت هستم؛ توسعه‌دهنده فول‌استک با تمرکز بر ساخت رابط‌های کاربری روان، تجربه‌های محصول جذاب و سیستم‌های بک‌اند قدرتمند.",
    "در هر پروژه، از شناخت مسئله و طراحی راه‌حل تا پیاده‌سازی و بهبود تجربه کاربری پیش می‌روم؛ با تمرکز بر عملکرد، سادگی و نگهداشت‌پذیری."
  ]
};

export const journey = [
  {
    year: "۲۰۲۶ - اکنون",
    role: "توسعه‌دهنده مستقل",
    company: "پروژه‌های شخصی و فریلنسری",
    summary: "طراحی و توسعه‌ی محصولات وب و پروژه‌های نرم‌افزاری مستقل.",
    impact: "• تمرکز بر ساخت تجربه‌های دیجیتال کاربردی و فارسی.\n• توسعه و نگهداری پروژه‌های متن‌باز."
  },
  {
    year: "۲۰۲۱ - ۲۰۲۶",
    role: "توسعه‌دهنده وب",
    company: "پروژه‌های فریلنسری",
    summary: "توسعه وب‌سایت‌ها و اپلیکیشن‌های تحت وب برای پروژه‌های مختلف.",
    impact: "• توسعه رابط کاربری و قابلیت‌های سمت سرور.\n• همکاری در طراحی، پیاده‌سازی و بهبود محصولات وب."
  },
  {
    year: "۲۰۱۹ - ۲۰۲۱",
    role: "توسعه‌دهنده فرانت‌اند",
    company: "پروژه‌های مختلف",
    summary: "طراحی و پیاده‌سازی رابط‌های کاربری وب.",
    impact: "• ساخت صفحات واکنش‌گرا و سازگار با اندازه‌های مختلف.\n• تبدیل طرح‌ها به رابط‌های کاربری قابل استفاده."
  }
];

export const skills = [
  {
    category: "توسعه سمت سرور",
    accent: "violet",
    items: ["Laravel", "PHP", "Python", "Node.js", "REST APIs", "MySQL"]
  },
  {
    category: "توسعه سمت کاربر",
    accent: "cyan",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vanilla JS", "HTML/CSS"]
  },
  {
    category: "ابزارها و زیرساخت",
    accent: "magenta",
    items: ["Git", "Docker", "Linux", "WordPress", "SEO", "WebSockets"]
  },
  {
    category: "توسعه بازی",
    accent: "amber",
    items: ["Canvas API", "WebRTC", "شبکه همتا‌به‌همتا (P2P)", "فیزیک بازی", "طراحی رابط و تجربه کاربری بازی"]
  }
];

export const education = [
  {
    period: "۲۰۱۷ – ۲۰۲۱",
    degree: "کارشناسی مهندسی کامپیوتر",
    institution: "دانشگاه آزاد اسلامی",
    focus: "توسعه نرم‌افزار، طراحی سیستم‌ها، الگوریتم‌ها",
    note: "فارغ‌التحصیل در رشته مهندسی کامپیوتر با تمرکز بر توسعه وب و اپلیکیشن."
  }
];

export const projects = [
  {
    id: "01",
    title: "نمایشگر فایل‌های Markdown",
    concept: "افزونه‌ای آفلاین برای نوشتن، پیش‌نمایش و خروجی گرفتن از فایل‌های Markdown؛ با پشتیبانی از فارسی، راست‌چین و چپ‌چین.",
    stack: ["JavaScript", "Markdown", "RTL / LTR", "Mermaid"],
    impact: "نمایش کد، نمودارها و فرمول‌ها در محیطی یکپارچه و مناسب برای نوشتن مستندات.",
    cta: "مشاهده پروژه",
    url: "https://github.com/bitwizarder/markdown-viewer",
    image: "/projects/markdown.jpg" // 👈 مسیر عکس اول
  },
  {
    id: "02",
    title: "بازار آگهی دیوار",
    concept: "بازار آنلاین آگهی با الهام از دیوار که با Laravel و Next.js توسعه داده شده است.",
    stack: ["Laravel 13", "Next.js 16", "TypeScript"],
    impact: "شامل ثبت و مدیریت آگهی، احراز هویت، پنل مدیریت و گفت‌وگوی زنده.",
    cta: "مشاهده پروژه",
    url: "https://github.com/bitwizarder/divar-clone",
    image: "/projects/divar.jpg" // 👈 مسیر عکس دوم
  },
  {
    id: "03",
    title: "وب‌سایت شخصی",
    concept: "رزومه و نمونه‌کارهای آنلاین من، با طراحی راست‌چین و محتوای فارسی.",
    stack: ["Next.js", "React", "Tailwind CSS", "GSAP"],
    impact: "روایتی تعاملی از مسیر حرفه‌ای، مهارت‌ها و پروژه‌های منتخب.",
    cta: "مشاهده کد منبع",
    url: "https://github.com/bitwizarder/bitwizarder.github.io",
    image: "/projects/portfolio.jpg" // 👈 مسیر عکس سوم
  }
];

export const openSourceFallback = [
  {
    name: "markdown-viewer",
    description: "افزونه‌ای آفلاین برای نوشتن و پیش‌نمایش Markdown با پشتیبانی از فارسی و چیدمان راست‌چین.",
    language: "JavaScript",
    stars: 2,
    url: "https://github.com/bitwizarder/markdown-viewer"
  },
  {
    name: "divar-clone",
    description: "بازار آنلاین آگهی با امکانات احراز هویت، پنل مدیریت و گفت‌وگوی زنده.",
    language: "TypeScript",
    stars: 2,
    url: "https://github.com/bitwizarder/divar-clone"
  },
  {
    name: "bitwizarder",
    description: "مخزن پروفایل توسعه‌دهنده و مجموعه‌ای از پروژه‌ها و آزمایش‌های من.",
    language: "Mixed",
    stars: 2,
    url: "https://github.com/bitwizarder/bitwizarder"
  }
];

export const openSourceDescriptions = {
  bitwizarder: "مجموعه‌ای از پروژه‌ها، آزمایش‌ها و ابزارهایی که در حال توسعه‌ام.",
  "markdown-viewer": "افزونه‌ای آفلاین برای نوشتن و پیش‌نمایش Markdown؛ با پشتیبانی از فارسی، راست‌چین و چپ‌چین، نمودار و فرمول.",
  "divar-clone": "بازار آگهی فول‌استک با Laravel و Next.js؛ شامل مدیریت آگهی، احراز هویت، پنل مدیریت و گفت‌وگوی زنده.",
  "bitwizarder.github.io": "وب‌سایت فارسی رزومه و نمونه‌کارهای محمد آیت.",
  "multi-arena-privacy": "صفحهٔ سیاست حفظ حریم خصوصی پروژهٔ MULTI ARENA."
};

export const achievements = [
  {
    year: "۲۰۲۶",
    title: "انتشار بازی در مایکت",
    issuer: "مایکت",
    detail: "انتشار بازی MULTI ARENA به‌عنوان یک اپلیکیشن مستقل اندروید."
  }
];

export const blogs = []; // می‌تونی بعداً مقاله اضافه کنی

export const podcasts = []; // خالی گذاشتم

export const githubProfile = {
  username: "bitwizarder",
  intro: "توسعه‌دهنده فول‌استک؛ علاقه‌مند به ساخت محصولات کاربردی، حل مسئله و تبدیل ایده‌ها به نرم‌افزار."
};

export const experiencePanels = [
  {
    title: "پیوند طراحی و مهندسی",
    body: "از طراحی رابط کاربری تا پیاده‌سازی سمت سرور، هر دو سوی محصول را با نگاهی یکپارچه پیش می‌برم."
  },
  {
    title: "سرعت از ابتدا",
    body: "بهینه‌سازی زمان بارگذاری و استفاده‌ی سنجیده از منابع را از آغاز توسعه در نظر می‌گیرم."
  },
  {
    title: "ساخت برای نگهداشت",
    body: "ساختار روشن و اجزای بازاستفاده‌پذیر را انتخاب می‌کنم تا توسعه و نگهداری محصول ساده‌تر باشد."
  }
];

export const philosophy = {
  quote: "بهترین رابط‌های کاربری فقط اطلاعات نمی‌دهند، بلکه حس حرکت و پیشرفت را به کاربر منتقل می‌کنند.",
  body: "فلسفه من ساده است: وضوح، اعتماد می‌سازد؛ حرکت، خاطره می‌سازد؛ و هنر مهندسی، تفاوت ایجاد می‌کند."
};

export const contact = {
  headline: "بیایید با هم یک تجربه دیجیتال فراموش‌نشدنی بسازیم.",
  statement: "آماده همکاری در پروژه‌های فول‌استک، توسعه وب‌اپلیکیشن و ساخت بازی‌های تحت وب هستم.",
  methods: [
    { label: "ایمیل", value: "bitwizarder@gmail.com", href: "mailto:bitwizarder@gmail.com" },
    { label: "گیت‌هاب", value: "github.com/bitwizarder", href: "https://github.com/bitwizarder" }
  ]
};