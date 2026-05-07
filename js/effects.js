(function () {

  /* ══════════════════════════════════════════
     1. Scroll progress bar
  ══════════════════════════════════════════ */
  var bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.appendChild(bar);

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }, { passive: true });


  /* ══════════════════════════════════════════
     2. Typewriter on hero title
  ══════════════════════════════════════════ */
  var title   = document.querySelector('.hero-title');
  var tagline = document.querySelector('.hero-tagline');
  var links   = document.querySelector('.hero-links');
  var frame   = document.querySelector('.app-frame');
  var howard  = document.querySelector('.howard-wrap');

  // Pre-hide elements for cascade reveal
  [tagline, links].forEach(function (el) {
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  });

  var fullText = title ? title.textContent.trim() : '';
  if (title) title.textContent = '';

  var cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  if (title) title.appendChild(cursor);

  var idx = 0;
  function typeNext() {
    if (idx < fullText.length) {
      cursor.insertAdjacentText('beforebegin', fullText[idx]);
      idx++;
      setTimeout(typeNext, 40);
    } else {
      setTimeout(function () { cursor.style.opacity = '0'; }, 600);
      function show(el, delay) {
        if (!el) return;
        setTimeout(function () {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
      }
      show(tagline, 120);
      show(links,   280);
    }
  }
  setTimeout(typeNext, 200);


  /* ══════════════════════════════════════════
     3. Scroll fade-in
  ══════════════════════════════════════════ */
  var fadeTargets = document.querySelectorAll('.feature-card, .setup-step');
  fadeTargets.forEach(function (el) { el.classList.add('fade-in'); });

  ['.features-grid', '.setup-steps'].forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (!grid) return;
    Array.from(grid.children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 0.05) + 's';
    });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeTargets.forEach(function (el) { io.observe(el); });
  } else {
    fadeTargets.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ══════════════════════════════════════════
     4. 3-D card tilt
  ══════════════════════════════════════════ */
  document.querySelectorAll('.feature-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r    = card.getBoundingClientRect();
      var rotX = ((e.clientY - r.top  - r.height / 2) / r.height) * -12;
      var rotY = ((e.clientX - r.left - r.width  / 2) / r.width)  *  12;
      card.style.transition = 'box-shadow 0.15s ease, background 0.15s ease';
      card.style.transform  =
        'perspective(700px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.5s ease, box-shadow 0.25s ease, background 0.25s ease';
      card.style.transform  = '';
    });
  });

})();
