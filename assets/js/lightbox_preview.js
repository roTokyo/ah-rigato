
  (function () {
    const links = Array.from(document.querySelectorAll('a[data-lity]')).filter(a => !a.querySelector('img'));
    // Niente anteprima su dispositivi senza hover (touch)
    if (!links.length || !window.matchMedia('(hover: hover)').matches) return;

    const preview = document.createElement('img');
    preview.alt = '';
    Object.assign(preview.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '9000',
      pointerEvents: 'none',
      maxWidth: 'min(320px, 80vw)',
      maxHeight: '260px',
      borderRadius: '6px',
      boxShadow: '0 6px 24px rgba(0,0,0,.35)',
      background: '#fff',
      opacity: '0',
      transition: 'opacity .15s ease-out'
    });
    document.body.appendChild(preview);

    let current = null;

    function place(link) {
      const r = link.getBoundingClientRect();
      const gap = 8;
      const pw = preview.offsetWidth;
      const ph = preview.offsetHeight;
      // Sotto il link; se non c'è spazio, sopra
      let top = r.bottom + gap;
      if (top + ph > window.innerHeight - gap) {
        top = Math.max(gap, r.top - ph - gap);
      }
      const left = Math.min(Math.max(gap, r.left), window.innerWidth - pw - gap);
      preview.style.top = top + 'px';
      preview.style.left = left + 'px';
    }

    function show(link) {
      current = link;
      const img = new Image();
      img.onload = () => {
        if (current !== link) return;   // il mouse nel frattempo se n'è andato
        preview.onload = () => {
          if (current !== link) return;
          preview.style.display = 'block';
          place(link);
          preview.style.opacity = '1';
        };
        preview.src = link.href;
      };
      img.src = link.href;
    }

    function hide() {
      current = null;
      preview.style.opacity = '0';
      preview.style.display = 'none';
      preview.removeAttribute('src');
    }

    links.forEach(a => {
      a.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(a); });
      a.addEventListener('pointerleave', hide);
      a.addEventListener('focus', () => show(a));
      a.addEventListener('blur', hide);
      a.addEventListener('click', hide);   // evita la sovrapposizione col lightbox
    });
    window.addEventListener('scroll', hide, { passive: true });
  })();