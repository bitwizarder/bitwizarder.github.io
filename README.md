# محمد آیت | توسعه‌دهنده فول‌استک وب

وب‌سایت رزومه و نمونه‌کارهای من؛ فضایی برای معرفی مسیر حرفه‌ای، مهارت‌ها و پروژه‌هایی که ساخته‌ام.

## مشاهده وب‌سایت

[bitwizarder.github.io](https://bitwizarder.github.io)

## امکانات

- طراحی فارسی و راست‌چین، سازگار با موبایل و دسکتاپ
- پیمایش بخش‌ها با نقشه‌ی مسیر و حرکت‌های نرم
- معرفی پروژه‌ها با پیوند مستقیم به مخزن‌های گیت‌هاب
- نمایش آمار و مخزن‌های منتخب گیت‌هاب
- دریافت اطلاعات عمومی گیت‌هاب هنگام ساخت سایت
- انتشار خودکار روی GitHub Pages با GitHub Actions

## فناوری‌ها

- Next.js و React
- JavaScript
- Tailwind CSS
- GSAP و ScrollTrigger

## اجرای محلی

```bash
npm install
npm run dev
```

سپس [http://localhost:3000](http://localhost:3000) را باز کنید.

برای ساخت نسخه‌ی قابل انتشار:

```bash
npm run snapshot:github
npm run build
```

خروجی ایستا در پوشه‌ی `out/` ساخته می‌شود.

## ویرایش محتوا

اطلاعات رزومه، متن‌ها و روشن/خاموش‌کردن بخش‌ها در [data/resumeContent.js](./data/resumeContent.js) قرار دارد. برای تغییر رنگ‌ها و تنظیمات ظاهری، [data/themeConfig.json](./data/themeConfig.json) را ویرایش کنید.

شناسه‌ی کاربری گیت‌هاب در `githubProfile.username` تنظیم شده است. اسکریپت `npm run snapshot:github` اطلاعات عمومی پروفایل و مخزن‌ها را در `data/githubSnapshot.json` به‌روزرسانی می‌کند.

## انتشار در GitHub Pages

مخزن برای انتشار خودکار با GitHub Actions آماده شده است:

1. در تنظیمات مخزن، بخش **Pages** را باز کنید.
2. منبع انتشار را روی **GitHub Actions** قرار دهید.
3. تغییرات را به شاخه‌ی `main` بفرستید.

گردش‌کار [deploy-pages.yml](./.github/workflows/deploy-pages.yml) اطلاعات گیت‌هاب را دریافت می‌کند، سایت را می‌سازد و منتشر می‌کند. تنظیم مسیر خروجی نیز بین مخزن کاربری `username.github.io` و مخزن‌های پروژه تفاوت قائل می‌شود.
