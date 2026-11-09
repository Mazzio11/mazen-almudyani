# النشر على GitHub Pages

الموقع مجهز للنشر لكنه لم يُنشر. لم يُقدّم اسم مستخدم GitHub أو مستودع وجهة. لا تُرفع الملفات الخاصة أو مجلد node_modules أو .tools أو qa.

1. راجع محتوى الموقع وصوره وكتابة الاسم العربي. البريد المعروض معتمد منك.
2. أنشئ مستودعًا باسم حسابك متبوعًا بـ `.github.io` إذا أردت نطاق المستخدم الرئيسي، أو اختر اسم مشروع عادي. لا يتطلب التطبيق تعديل المسارات لأن أصوله نسبية وروابط المشاريع تستخدم hash.
3. ارفع ملفات المصدر وpublic وpackage.json وpnpm-lock.yaml وpnpm-workspace.yaml وملفات الإعداد ومجلد .github. احترم .gitignore.
4. من Settings → Pages اختر GitHub Actions كمصدر النشر.
5. من Actions اختر Deploy portfolio to GitHub Pages ثم Run workflow على الفرع الذي رفعت إليه الملفات.
6. انتظر نجاح مرحلتي build وdeploy. افتح الرابط الفعلي الذي تعرضه خطوة النشر.
7. جرّب اللغة العربية والهاتف وافتح رابط مشروع مباشرة وأعد تحميله.

التشغيل اليدوي متعمّد حتى تنشر بعد مراجعة المحتوى. لا حاجة لأي مفاتيح AI أو قاعدة بيانات أو حساب ElevenLabs لتشغيل البورتفوليو.

للتشغيل على جهازك بعد تثبيت Node.js 24:

```sh
npm install -g pnpm@11
pnpm install --frozen-lockfile
pnpm dev
```

للمراجعة النهائية:

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
```

الدليل الرسمي المستخدم لإعداد النشر: https://vite.dev/guide/static-deploy.html

