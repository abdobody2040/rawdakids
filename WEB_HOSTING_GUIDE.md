# دليل رفع واستضافة تطبيق روضة كيدز (Rawdakids Web Hosting Guide) 🌐🚀

هذا الدليل يشرح خطوة بخطوة كيفية رفع ونشر تطبيق **روضة كيدز (Rawdakids)** على خوادم الإنترنت والاستضافات السحابية ليتمكن أي مستخدم أو طفل من فتحه واستخدامه عبر المتصفح على أي جهاز (كمبيوتر، تابلت، أو هاتف).

---

## ⚠️ شرط أساسي وحاسم قبل البدء (HTTPS / شهادة الأمان)

> **تنبيه هام:**
> **ميزة تسجيل صوت الطفل في استوديو التلاوة (`Microphone / getUserMedia`) لا تعمل في متصفحات الويب (Chrome, Safari, Firefox, Edge) إلا في بيئة آمنة مشفرة عبر رابط `https://` حصراً!**
> إذا تم رفع الموقع على رابط عادي `http://`، سيقوم المتصفح بحظر الميكروفون تلقائياً ولن يتمكن الطفل من تسجيل تلاوته. لذلك تأكد دائماً من تفعيل شهادة SSL (وهي مجانية وتلقائية على أغلب المنصات الحديثة).

---

## الخطوة التمهيدية: تجهيز ملفات الويب للإنتاج (Production Build)

في مجلد المشروع على جهازك، قم بتشغيل الأمر التالي لإنتاج النسخة النهائية المصغرة والمحسنة في مجلد `dist/`:

```bash
npx expo export --platform web
```

* بعد انتهاء الأمر بنجاح، ستجد مجلد باسم **`dist`** يحتوي على ملف `index.html`، ملفات الـ Javascript (`_expo/static/js/web/`), وأصول الصور والأيقونات.

---

## الخيار 1: الاستضافة السحابية المجانية والسريعة (Vercel) — (الخيار الأسهل والموصى به ⭐)

تعتبر **Vercel** المنصة الأسرع والأفضل لتطبيقات React و Next.js و Expo، وتمنحك رابطاً سحابياً مجانياً فورياً مع HTTPS مجاني دائم وشبكة CDN عالمية فائقة السرعة.

### الخطوات:
1. ارفع المشروع إلى حسابك على **GitHub** (يمكن أن يكون المستودع خاصاً Private).
2. افتح موقع [Vercel.com](https://vercel.com) وسجل الدخول بحساب GitHub الخاص بك.
3. اضغط على **"Add New..."** ثم **"Project"**.
4. اختر مستودع المشروع واضغط **"Import"**.
5. في إعدادات النشر (**Build and Output Settings**):
   - **Framework Preset:** اختر `Other`.
   - **Build Command:** اكتب `npx expo export --platform web`.
   - **Output Directory:** اكتب `dist`.
   - **Install Command:** اكتب `npm install`.
6. اضغط على زر **"Deploy"**.
7. خلال دقيقة واحدة سيصبح موقعك متاحاً برابط مجاني مثل: `https://rawdakids.vercel.app`.

> **حل مشكلة إعادة تحميل الصفحات (SPA Routing) على Vercel:**
> تم إنشاء ملف `vercel.json` في المشروع تلقائياً بهذا المحتوى لمنع خطأ 404 عند تحديث الصفحات الداخلية:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## الخيار 2: الاستضافة السحابية عبر Netlify

منصة ممتازة جداً وتدعم الرفع المباشر عن طريق السحب والإفلات (Drag & Drop) بدون الحاجة إلى GitHub:

### الطريقة المباشرة (Drag & Drop):
1. قم بتشغيل `npx expo export --platform web` على جهازك.
2. ادخل إلى [Netlify.com](https://www.netlify.com).
3. في لوحة التحكم، اذهب إلى قسم **Sites** واسحب مجلد **`dist`** مباشرة إلى المتصفح في منطقة النشر.
4. سيتم رفع الموقع في ثوانٍ وإعطاؤك رابطاً فورياً مجانياً يدعم الـ HTTPS.

### ضبط إعادة التوجيه لـ Netlify:
ضع ملفاً باسم `_redirects` داخل مجلد `public/` (أو `dist/`) يحتوي على السطر التالي:
```text
/*    /index.html   200
```

---

## الخيار 3: استضافة Full-Stack كاملة مع سيرفر Node.js (Render أو Railway)

إذا أردت تشغيل سيرفر المشروع الكامل `server.js` الذي يقوم بدمج وتوزيع التفسير الصوتي `/api/tts` وضبط معدل الطلبات وحماية الـ Rate Limiting:

### الخطوات على Render.com:
1. ادخل إلى [Render.com](https://render.com) وأنشئ حساباً جديداً.
2. اضغط على **"New +"** ثم اختر **"Web Service"**.
3. اربط مستودع GitHub الخاص بالمشروع.
4. اضبط الإعدادات التالية:
   - **Environment:** `Node`.
   - **Build Command:** `npm install && npx expo export --platform web`.
   - **Start Command:** `node server.js`.
5. في قسم **Environment Variables** أضف:
   - `PORT`: `3000` (أو اترك Render يضبطه تلقائياً).
   - `NODE_ENV`: `production`.
6. اضغط **"Create Web Service"**.
7. سيتولى Render بناء الويب وتشغيل السيرفر ومنحك نطاقاً آمناً مع شهادة SSL تلقائية.

---

## الخيار 4: الاستضافة على سيرفر خاص (VPS / Ubuntu / Nginx / Hostinger / DigitalOcean)

إذا كان لديك سيرفر سحابي خاص (VPS) يعمل بنظام Ubuntu Linux:

### 1. تثبيت Node.js ومدير العمليات PM2 و Nginx:
```bash
# تحديث الحزم
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# تثبيت PM2 لتشغيل السيرفر في الخلفية بشكل دائم
sudo npm install -g pm2
```

### 2. نقل ملفات المشروع وتشغيله:
```bash
cd /var/www
git clone https://github.com/your-username/quran-app-for-kids.git rawdakids
cd rawdakids
npm install
npx expo export --platform web

# تشغيل السيرفر عبر PM2
pm2 start server.js --name "rawdakids"
pm2 startup
pm2 save
```

### 3. إعداد خادم Nginx مع شهادة SSL المجانية (Certbot):
أنشئ ملف إعداد للموقع:
```bash
sudo nano /etc/nginx/sites-available/rawdakids
```
ضع فيه الإعدادات التالية:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
ثم تفعيل الموقع وتثبيت شهادة SSL مجانية:
```bash
sudo ln -s /etc/nginx/sites-available/rawdakids /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# تثبيت شهادة الأمان HTTPS مجاناً بضغطة زر
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## الخيار 5: الاستضافة المشتركة التقليدية (cPanel / Shared Hosting)

إذا كان لديك استضافة عادية عبر لوحة تحكم cPanel:

1. قم بتشغيل `npx expo export --platform web` على جهازك.
2. افتح مجلد **`dist`** على جهازك وقم بضغط جميع محتوياته في ملف واحد بصيغة `.zip`.
3. ادخل إلى **cPanel** وافتح **File Manager** (مدير الملفات).
4. اذهب إلى مجلد الموقع العام (غالباً `public_html`).
5. ارفع الملف المضغوط ثم فك ضغطه داخل `public_html`.
6. أنشئ ملفاً باسم **`.htaccess`** داخل `public_html` وضع فيه الكود التالي لضمان عمل الروابط الداخلية وحمايتها:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # فرض تشغيل HTTPS المشفر
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # توجيه جميع الصفحات لملف index.html ليعمل نظام التنقل بسلاسة
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
7. من لوحة cPanel اذهب إلى قسم **SSL/TLS Status** وتأكد من تفعيل **AutoSSL** للنطاق لتشغيل الميكروفون والصوتيات بأمان.

---

## ملخص المقارنة السريعة للاستضافات

| المنصة | التكلفة | سهولة الإعداد | دعم HTTPS تلقائي | مناسب لـ |
| :--- | :--- | :--- | :--- | :--- |
| **Vercel** | مجاني | فائقة (ربط بـ GitHub) | نعم مدمج | أنسب خيار سريع ومستقر |
| **Netlify** | مجاني | فائقة (سحب وإفلات) | نعم مدمج | النشر السريع دون تعقيد |
| **Render / Railway** | خطة مجانية / رخيصة | سهلة | نعم مدمج | تشغيل السيرفر الكامل مع الـ APIs |
| **VPS (Ubuntu)** | مدفوع ($4-5 شهرياً) | تتطلب معرفة بـ Linux | نعم (Certbot) | أقصى تحكم وحرية للمشاريع الكبيرة |
| **cPanel** | حسب اشتراك استضافتك | متوسطة | نعم (AutoSSL) | إذا كانت لديك استضافة موجودة مسبقاً |
