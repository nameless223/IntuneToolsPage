(function () {
  var canvas = document.createElement('canvas');
  canvas.className = 'pg-canvas';
  document.getElementById('particles').appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var mouse = { x: -9999, y: -9999 };
  var particles = [];

  // IntuneTools brand palette
  var DOT_COLOR   = '71, 145, 219';   // #4791DB — mid Microsoft blue
  var LINE_COLOR  = '0, 102, 204';    // #0066CC — deeper blue
  var MOUSE_COLOR = '100, 180, 255';  // brighter highlight near cursor

  var CFG = {
    count      : 90,
    radius     : 2.2,
    speed      : 0.28,
    proximity  : 160,   // px — max line draw distance
    mouseRadius: 200,   // px — cursor repel / attract radius
    lineWidth  : 0.9,
    parallax   : 0.018  // mouse parallax strength
  };

  /* ── Resize ── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', function () {
    resize();
    initParticles();
  });

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  /* ── Particle ── */
  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    var angle = Math.random() * Math.PI * 2;
    var spd   = (Math.random() * 0.6 + 0.4) * CFG.speed;
    this.vx = Math.cos(angle) * spd;
    this.vy = Math.sin(angle) * spd;
    this.r  = Math.random() * 0.8 + CFG.radius * 0.6;
  };

  Particle.prototype.update = function () {
    // Gentle mouse repulsion
    var dx = this.x - mouse.x;
    var dy = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CFG.mouseRadius) {
      var force = (CFG.mouseRadius - dist) / CFG.mouseRadius * 0.015;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    // Speed cap
    var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > CFG.speed * 1.8) {
      this.vx = (this.vx / speed) * CFG.speed * 1.8;
      this.vy = (this.vy / speed) * CFG.speed * 1.8;
    }

    // Drift back to base speed (damping)
    this.vx *= 0.999;
    this.vy *= 0.999;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap edges
    if (this.x < -10)               this.x = canvas.width  + 10;
    if (this.x > canvas.width  + 10) this.x = -10;
    if (this.y < -10)               this.y = canvas.height + 10;
    if (this.y > canvas.height + 10) this.y = -10;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + DOT_COLOR + ', 0.85)';
    ctx.fill();
  };

  /* ── Init ── */
  function initParticles() {
    particles = [];
    for (var i = 0; i < CFG.count; i++) {
      particles.push(new Particle());
    }
  }

  /* ── Draw connections ── */
  function drawLines() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx   = particles[i].x - particles[j].x;
        var dy   = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CFG.proximity) {
          // Alpha fades to 0 at max proximity
          var alpha = (1 - dist / CFG.proximity) * 0.55;

          // Brighter lines near the cursor
          var mx = (particles[i].x + particles[j].x) / 2;
          var my = (particles[i].y + particles[j].y) / 2;
          var mdx = mx - mouse.x;
          var mdy = my - mouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          var nearMouse = mdist < CFG.mouseRadius;
          var color = nearMouse ? MOUSE_COLOR : LINE_COLOR;
          if (nearMouse) alpha = Math.min(alpha * 2.2, 0.75);

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + color + ', ' + alpha.toFixed(3) + ')';
          ctx.lineWidth   = CFG.lineWidth;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Loop ── */
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(loop);
  }

  resize();
  initParticles();
  loop();
})();
