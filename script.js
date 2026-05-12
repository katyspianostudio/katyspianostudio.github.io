// Yang Chen Piano Studio — interactivity

(function () {
  const html = document.documentElement;

  // ---- language toggle (persisted) ----
  const STORAGE_KEY = 'ycps-lang';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'zh' || saved === 'en') {
    html.setAttribute('data-lang', saved);
    html.setAttribute('lang', saved === 'zh' ? 'zh-CN' : 'en');
  }

  const langBtn = document.getElementById('langToggle');
  langBtn?.addEventListener('click', () => {
    const next = html.getAttribute('data-lang') === 'en' ? 'zh' : 'en';
    html.setAttribute('data-lang', next);
    html.setAttribute('lang', next === 'zh' ? 'zh-CN' : 'en');
    localStorage.setItem(STORAGE_KEY, next);
  });

  // ---- mobile nav ----
  const menuBtn = document.getElementById('menuToggle');
  const nav = document.querySelector('.primary-nav');
  menuBtn?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  // close menu when a link is tapped
  nav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- sticky header shadow + back-to-top ----
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 8);
    backToTop?.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- gallery lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lightboxImage');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose = lightbox?.querySelector('.lightbox-close');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');

  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIdx = -1;

  const renderSlide = (idx) => {
    const item = galleryItems[idx];
    if (!item || !lbImage) return;
    const src = item.getAttribute('data-img');
    const lang = html.getAttribute('data-lang') || 'en';
    const caption = item.getAttribute(lang === 'zh' ? 'data-caption-zh' : 'data-caption-en') || '';
    lbImage.innerHTML = `<img src="${src}" alt="${caption.replace(/"/g, '&quot;')}" />`;
    if (lbCaption) lbCaption.textContent = caption;
    currentIdx = idx;
  };

  const openLightbox = (idx) => {
    renderSlide(idx);
    lightbox?.classList.add('open');
    lightbox?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lbImage) lbImage.innerHTML = '';
    currentIdx = -1;
  };
  const nextSlide = () => {
    if (currentIdx < 0) return;
    renderSlide((currentIdx + 1) % galleryItems.length);
  };
  const prevSlide = () => {
    if (currentIdx < 0) return;
    renderSlide((currentIdx - 1 + galleryItems.length) % galleryItems.length);
  };

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });
  lbClose?.addEventListener('click', closeLightbox);
  lbNext?.addEventListener('click', nextSlide);
  lbPrev?.addEventListener('click', prevSlide);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // ---- footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
