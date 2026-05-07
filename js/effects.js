(function () {

  /* ══════════════════════════════════════════
     1. Scroll progress bar
  ══════════════════════════════════════════ */
  var bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.appendChild(bar);

  window.addEventListener('scroll', function () {
    var scrollTop  = window.scrollY || document.documentElement.scrollTop;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }, { passive: true });


  /* ══════════════════════════════════════════
     2. Typewriter on the h2 title
  ══════════════════════════════════════════ */
  var h2       = document.querySelector('#intro h2');
  var subtitle = document.querySelector('#intro .subtitle');
  var links    = document.querySelector('.profile-links');
  var divider  = document.querySelector('#intro hr');
  var frame    = document.querySelector('.app-frame');

  // Hide intro elements so they reveal in sequence
  [subtitle, links, divider, frame].forEach(function (el) {
    if (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
  });

  var fullText = h2.textContent.trim();
  h2.textContent = '';

  var cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  h2.appendChild(cursor);

  var idx = 0;
  function typeNext() {
    if (idx < fullText.length) {
      cursor.insertAdjacentText('beforebegin', fullText[idx]);
      idx++;
      setTimeout(typeNext, 70);
    } else {
      // Fade cursor out
      setTimeout(function () {
        cursor.style.opacity = '0';
      }, 900);
      // Reveal remaining intro elements in a cascade
      function reveal(el, delay) {
        if (!el) return;
        setTimeout(function () {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
      }
      reveal(subtitle, 250);
      reveal(links,    480);
      reveal(divider,  650);
      reveal(frame,    820);
    }
  }
  setTimeout(typeNext, 350);


  /* ══════════════════════════════════════════
     3. Scroll fade-in for cards and steps
  ══════════════════════════════════════════ */
  var fadeTargets = document.querySelectorAll('.feature-card, .setup-step, .setup-prereqs');
  fadeTargets.forEach(function (el) { el.classList.add('fade-in'); });

  // Stagger children within the same grid/list
  ['.features-grid', '.setup-steps'].forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (!grid) return;
    Array.from(grid.children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 0.09) + 's';
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
    }, { threshold: 0.12 });

    fadeTargets.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show everything immediately
    fadeTargets.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ══════════════════════════════════════════
     4. 3-D tilt on feature cards
  ══════════════════════════════════════════ */
  document.querySelectorAll('.feature-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r    = card.getBoundingClientRect();
      var rotX = ((e.clientY - r.top  - r.height / 2) / r.height) * -14;
      var rotY = ((e.clientX - r.left - r.width  / 2) / r.width)  *  14;
      card.style.transition = 'box-shadow 0.15s ease, background 0.15s ease';
      card.style.transform  =
        'perspective(700px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateY(-4px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.55s ease, box-shadow 0.25s ease, background 0.25s ease';
      card.style.transform  = '';
    });
  });

})();
