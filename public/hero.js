/* Hero visual: a living systems diagram (client, API, auth, database, cache, queue, worker).
   Labelled nodes drift and react to the pointer; data packets travel along the edges.
   Pauses when off-screen or when the tab is hidden. Static frame under reduced motion. */
(function () {
  "use strict";
  var canvas = document.getElementById("net");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var reduce = document.documentElement.classList.contains("rm");
  var ACC = "240,185,104", COOL = "124,147,255", INK = "240,239,236";

  var W = 0, H = 0, dpr = 1, nodes = [], dust = [], edges = [], packets = [];
  var mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
  var running = false, visible = true, last = 0, t = 0, small = false;

  // [label, x, y, depth(0.4..1.2)] in fractions of the "stage" area
  var DEFS = [
    ["Client", 0.08, 0.50, 1.0],
    ["API", 0.36, 0.30, 1.1],
    ["Auth", 0.34, 0.78, 0.8],
    ["Database", 0.70, 0.20, 1.0],
    ["Cache", 0.72, 0.58, 0.9],
    ["Queue", 0.92, 0.42, 0.7],
    ["Worker", 0.88, 0.86, 0.6]
  ];
  var LINKS = [[0, 1], [1, 2], [1, 3], [1, 4], [4, 5], [5, 6], [3, 4], [2, 3]];

  function build() {
    small = W < 760;
    var stage = small
      ? { x: 0.04 * W, y: H * 0.5, w: W * 0.92, h: H * 0.46 }
      : { x: W * 0.5, y: H * 0.1, w: W * 0.46, h: H * 0.52 };
    nodes = DEFS.map(function (d, i) {
      return {
        label: d[0], bx: stage.x + d[1] * stage.w, by: stage.y + d[2] * stage.h, z: d[3],
        ph: i * 1.7, x: 0, y: 0, r: 4 + d[3] * 3
      };
    });
    edges = LINKS.map(function (l) { return { a: nodes[l[0]], b: nodes[l[1]] }; });
    var n = small ? 22 : 46;
    dust = [];
    for (var i = 0; i < n; i++) {
      dust.push({ bx: Math.random() * W, by: Math.random() * H, z: 0.2 + Math.random() * 0.6, ph: Math.random() * 6, r: 0.7 + Math.random() * 1.2 });
    }
    packets = [];
  }

  function resize() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    if (reduce || !running) draw(0);
  }

  function pos(o, time) {
    var mx = (mouse.x - 0.5), my = (mouse.y - 0.5);
    var par = 26 * o.z;
    o.x = o.bx + Math.sin(time * 0.5 + o.ph) * 7 * o.z - mx * par;
    o.y = o.by + Math.cos(time * 0.42 + o.ph) * 7 * o.z - my * par;
  }

  function spawn() {
    if (!edges.length || packets.length > 9) return;
    var e = edges[(Math.random() * edges.length) | 0];
    var fwd = Math.random() > 0.35;
    packets.push({ e: e, p: 0, v: 0.35 + Math.random() * 0.35, dir: fwd ? 1 : -1, hue: Math.random() > 0.5 ? ACC : COOL });
  }

  function draw(dt) {
    t += dt;
    mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
    ctx.clearRect(0, 0, W, H);

    var i, j, o;
    for (i = 0; i < dust.length; i++) pos(dust[i], t);
    for (i = 0; i < nodes.length; i++) pos(nodes[i], t);

    // dust + faint proximity links
    for (i = 0; i < dust.length; i++) {
      o = dust[i];
      ctx.fillStyle = "rgba(" + INK + "," + (0.12 + o.z * 0.2) + ")";
      ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 6.2832); ctx.fill();
      for (j = i + 1; j < dust.length; j++) {
        var dx = o.x - dust[j].x, dy = o.y - dust[j].y, d2 = dx * dx + dy * dy;
        if (d2 < 9000) {
          ctx.strokeStyle = "rgba(" + INK + "," + (0.06 * (1 - d2 / 9000)) + ")";
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(dust[j].x, dust[j].y); ctx.stroke();
        }
      }
    }

    var a = small ? 0.55 : 1;

    // edges
    for (i = 0; i < edges.length; i++) {
      var e = edges[i];
      ctx.strokeStyle = "rgba(" + INK + "," + 0.16 * a + ")";
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
    }

    // packets
    for (i = packets.length - 1; i >= 0; i--) {
      var p = packets[i];
      p.p += p.v * dt;
      if (p.p >= 1) { packets.splice(i, 1); continue; }
      var f = p.dir === 1 ? p.p : 1 - p.p;
      var px = p.e.a.x + (p.e.b.x - p.e.a.x) * f, py = p.e.a.y + (p.e.b.y - p.e.a.y) * f;
      var g = ctx.createRadialGradient(px, py, 0, px, py, 12);
      g.addColorStop(0, "rgba(" + p.hue + "," + 0.9 * a + ")"); g.addColorStop(1, "rgba(" + p.hue + ",0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 12, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255," + a + ")"; ctx.beginPath(); ctx.arc(px, py, 1.8, 0, 6.2832); ctx.fill();
    }

    // nodes
    for (i = 0; i < nodes.length; i++) {
      o = nodes[i];
      var pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + o.ph);
      var hg = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 5);
      hg.addColorStop(0, "rgba(" + (i % 2 ? COOL : ACC) + "," + (0.22 + 0.1 * pulse) * a + ")"); hg.addColorStop(1, "rgba(" + ACC + ",0)");
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(o.x, o.y, o.r * 5, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#0a0a0b"; ctx.strokeStyle = "rgba(" + (i % 2 ? COOL : ACC) + "," + a + ")"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 6.2832); ctx.fill(); ctx.stroke();
      if (!small) {
        ctx.font = '500 11px "JetBrains Mono",ui-monospace,monospace';
        ctx.fillStyle = "rgba(" + INK + ",.55)";
        ctx.fillText(o.label.toUpperCase(), o.x + o.r + 10, o.y + 4);
      }
    }
  }

  function loop(ts) {
    if (!running) return;
    var dt = Math.min((ts - last) / 1000, 0.05); last = ts;
    if (Math.random() < dt * 1.6) spawn();
    draw(dt);
    requestAnimationFrame(loop);
  }
  function start() { if (reduce || running || !visible || document.hidden) return; running = true; last = performance.now(); requestAnimationFrame(loop); }
  function stop() { running = false; }

  window.addEventListener("resize", resize);
  var host = canvas.parentElement;
  host.addEventListener("pointermove", function (e) {
    var r = host.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.width; mouse.ty = (e.clientY - r.top) / r.height;
  });
  host.addEventListener("pointerleave", function () { mouse.tx = 0.5; mouse.ty = 0.5; });
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(host);
  }

  resize();
  if (reduce) { spawn(); draw(0); } else start();
})();
