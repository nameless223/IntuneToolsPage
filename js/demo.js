(function () {
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:0;pointer-events:none;display:block;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var mouse = { x: -9999, y: -9999 };
  var particles = [];

  // IntuneTools Microsoft-blue palette (r, g, b strings for rgba())
  var DOT_COLOR   = '71, 145, 219';
  var LINE_COLOR  = '0, 102, 204';
  var MOUSE_COLOR = '100, 180, 255';

  var CFG = {
    count       : 90,
    baseRadius  : 2.0,
    speed       : 0.28,
    proximity   : 160,
    mouseRadius : 200,
    lineWidth   : 0.9
  };

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

  function Particle() { this.reset(true); }

  Particle.prototype.reset = function (anywhere) {
    this.x  = anywhere ? Math.random() * canvas.width  : (Math.random() < 0.5 ? -10 : canvas.width  + 10);
    this.y  = anywhere ? Math.random() * canvas.height : (Math.random() < 0.5 ? -10 : canvas.height + 10);
    var angle = Math.random() * Math.PI * 2;
    var spd   = (Math.random() * 0.6 + 0.4) * CFG.speed;
    this.vx = Math.cos(angle) * spd;
    this.vy = Math.sin(angle) * spd;
    this.r  = Math.random() * 1.2 + CFG.baseRadius * 0.5;
  };

  Particle.prototype.update = function () {
    var dx = this.x - mouse.x;
    var dy = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CFG.mouseRadius && dist > 0) {
      var force = (CFG.mouseRadius - dist) / CFG.mouseRadius * 0.015;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    // Speed cap + gentle damping
    var spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > CFG.speed * 1.8) {
      this.vx = (this.vx / spd) * CFG.speed * 1.8;
      this.vy = (this.vy / spd) * CFG.speed * 1.8;
    }
    this.vx *= 0.999;
    this.vy *= 0.999;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap edges
    if (this.x < -20)               this.x = canvas.width  + 20;
    if (this.x > canvas.width  + 20) this.x = -20;
    if (this.y < -20)               this.y = canvas.height + 20;
    if (this.y > canvas.height + 20) this.y = -20;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + DOT_COLOR + ',0.9)';
    ctx.fill();
  };

  function initParticles() {
    particles = [];
    for (var i = 0; i < CFG.count; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx   = particles[i].x - particles[j].x;
        var dy   = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= CFG.proximity) continue;

        var alpha = (1 - dist / CFG.proximity) * 0.5;

        // Brighten lines near the cursor
        var mx    = (particles[i].x + particles[j].x) * 0.5;
        var my    = (particles[i].y + particles[j].y) * 0.5;
        var mdx   = mx - mouse.x;
        var mdy   = my - mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        var color = mdist < CFG.mouseRadius ? MOUSE_COLOR : LINE_COLOR;
        if (mdist < CFG.mouseRadius) alpha = Math.min(alpha * 2.5, 0.8);

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = 'rgba(' + color + ',' + alpha.toFixed(3) + ')';
        ctx.lineWidth   = CFG.lineWidth;
        ctx.stroke();
      }
    }
  }

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
