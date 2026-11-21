// Service Worker — يجعل التطبيق يعمل بدون إنترنت لما سبق فتحه
const VERSION = 'v3';
const SHELL = `shell-${VERSION}`;
const DATA = `data-${VERSION}`;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => ![SHELL, DATA].includes(k)).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

const DATA_HOSTS = ['api.alquran.cloud', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // الصوتيات كبيرة الحجم — لا نخزنها
  if (/\.(mp3|ogg|m4a)$/i.test(url.pathname)) return;

  // صفحة التطبيق: من الشبكة أولًا، ثم من الذاكرة عند انقطاع الإنترنت
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(SHELL).then((c) => c.put('./index.html', res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // ملفات التطبيق نفسه: من الذاكرة أولًا
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(SHELL).then((c) => c.put(req, res.clone()));
            return res;
          })
      )
    );
    return;
  }

  // بيانات القرآن والأحاديث والخطوط: من الذاكرة مع التحديث في الخلفية
  if (DATA_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.open(DATA).then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req)
          .then((res) => {
            if (res.ok || res.type === 'opaque') c.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || net;
      })
    );
  }
});

// عند الضغط على إشعار الأذان: افتح التطبيق
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((list) => (list[0] ? list[0].focus() : self.clients.openWindow('./#/prayer')))
  );
});
