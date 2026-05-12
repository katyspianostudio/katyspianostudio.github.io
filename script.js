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

  const closeNav = () => {
    if (!nav?.classList.contains('open')) return;
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };
  const openNav = () => {
    nav?.classList.add('open');
    menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  menuBtn?.addEventListener('click', () => {
    nav?.classList.contains('open') ? closeNav() : openNav();
  });
  // close menu when a link is tapped
  nav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });
  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('open')) closeNav();
  });
  // close on tap outside the nav
  document.addEventListener('click', (e) => {
    if (!nav?.classList.contains('open')) return;
    const t = e.target;
    if (nav.contains(t) || menuBtn.contains(t)) return;
    closeNav();
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
  let lastFocused = null;

  const toWebp = (src) => src.replace(/\.jpe?g$/i, '.webp');

  const renderSlide = (idx) => {
    const item = galleryItems[idx];
    if (!item || !lbImage) return;
    const src = item.getAttribute('data-img');
    const lang = html.getAttribute('data-lang') || 'en';
    const caption = item.getAttribute(lang === 'zh' ? 'data-caption-zh' : 'data-caption-en') || '';
    const safeCaption = caption.replace(/"/g, '&quot;');
    // <picture> with WebP source + JPEG fallback
    lbImage.innerHTML =
      `<picture>` +
        `<source type="image/webp" srcset="${toWebp(src)}" />` +
        `<img src="${src}" alt="${safeCaption}" decoding="async" />` +
      `</picture>`;
    if (lbCaption) lbCaption.textContent = caption;
    currentIdx = idx;
  };

  const focusableSelector = 'button, [href], [tabindex]:not([tabindex="-1"])';
  const trapFocus = (e) => {
    if (e.key !== 'Tab' || !lightbox?.classList.contains('open')) return;
    const focusables = lightbox.querySelectorAll(focusableSelector);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const openLightbox = (idx) => {
    lastFocused = document.activeElement;
    renderSlide(idx);
    lightbox?.classList.add('open');
    lightbox?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // move focus into the modal
    setTimeout(() => lbClose?.focus(), 0);
  };
  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lbImage) lbImage.innerHTML = '';
    currentIdx = -1;
    // restore focus to the gallery thumb that opened the modal
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
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
    else if (e.key === 'ArrowRight') nextSlide();
    else if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'Tab') trapFocus(e);
  });

  // ---- lightbox touch swipe ----
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartT = 0;
  lightbox?.addEventListener('touchstart', (e) => {
    if (!lightbox.classList.contains('open')) return;
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchStartT = Date.now();
  }, { passive: true });
  lightbox?.addEventListener('touchend', (e) => {
    if (!lightbox.classList.contains('open')) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const dt = Date.now() - touchStartT;
    // horizontal swipe: > 50px, faster than 600ms, mostly horizontal
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 600) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // ---- footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
