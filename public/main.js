(function () {
  "use strict";
  var C = window.PORTFOLIO, ICONS = window.ICONS || {};
  var P = C.person;
  var root = document.documentElement;
  var RM = root.classList.contains("rm");
  var FINE = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var safeUrl = function (u) { return typeof u === "string" && /^(https?:\/\/|mailto:)/i.test(u.trim()) ? u.trim() : ""; };
  var safeSrc = function (u) { return typeof u === "string" && /^(https?:\/\/|assets\/|\.\/assets\/|\/assets\/)/i.test(u.trim()) ? u.trim() : ""; };
  var mailto = "mailto:" + P.email;

  /* ---------- Text splitting ---------- */
  function splitLetters(el, offset) {
    var txt = el.textContent, out = "";
    for (var i = 0; i < txt.length; i++) {
      out += '<span class="ch" aria-hidden="true"><i style="--i:' + (offset + i) + '">' + esc(txt[i]) + "</i></span>";
    }
    el.innerHTML = out;
    return txt.length;
  }
  function splitWords(el, accentFn) {
    var txt = el.textContent.trim(), words = txt.split(/\s+/), n = 0;
    el.setAttribute("aria-label", txt);
    el.innerHTML = words.map(function (w) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + (n++) + '">' + esc(w) + "</span></span>";
    }).join("");
  }

  /* ---------- Content ---------- */
  $("heroEyebrow").textContent = C.hero.eyebrow;
  var pill = $("heroPill"); pill.querySelector("span").textContent = P.availabilityText + ".";
  if (!P.available) pill.classList.add("off");
  var avail = $("navAvail"); if (!P.available) avail.classList.add("off");

  var tag = $("tagline"), gi = 0;
  tag.setAttribute("aria-label", C.hero.tagline.join(" "));
  tag.innerHTML = C.hero.tagline.map(function (line, li) {
    return '<span class="ln" style="display:block" aria-hidden="true">' + line.split(" ").map(function (w) {
      return '<span class="w"><span style="--i:' + (gi++) + '"' + (li === C.hero.accentLine ? ' class="acc"' : "") + ">" + esc(w) + "</span></span>";
    }).join("") + "</span>";
  }).join("");
  $("heroIntro").textContent = C.hero.intro;
  $("pLoc").textContent = P.location;
  (function () {
    var off = 0;
    $$("[data-letters]").forEach(function (r) { off += splitLetters(r, off) + 2; });
  })();

  function tick() {
    try {
      $("pTime").textContent = new Date().toLocaleTimeString("en-GB", { timeZone: P.timezone, hour: "2-digit", minute: "2-digit" }) + " WAT";
    } catch (e) { $("pTime").textContent = ""; }
  }
  tick(); setInterval(tick, 30000);

  $("aboutHeading").textContent = C.about.heading;
  $("aboutLead").textContent = C.about.lead;
  $("aboutText").innerHTML = C.about.paragraphs.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  $("aboutFacts").innerHTML = C.about.facts.map(function (f) { return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("");

  $("expList").innerHTML = C.experience.map(function (j) {
    return '<article class="job rv">' +
      (j.period ? '<div class="job__period">' + esc(j.period) + "</div>" : "") +
      "<h3>" + esc(j.org) + "</h3>" +
      (j.role ? '<div class="job__role">' + esc(j.role) + "</div>" : "") +
      (j.summary ? "<p>" + esc(j.summary) + "</p>" : "") +
      (j.points && j.points.length ? "<ul>" + j.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "") +
      (j.tags && j.tags.length ? '<div class="tags">' + j.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
      "</article>";
  }).join("");
  $("expNote").textContent = C.experienceNote || "";
  if (C.experienceNote) $("expNote").classList.add("rv");

  /* Skills */
  var ci = 0;
  $("skillList").innerHTML = C.skills.map(function (g) {
    var chips = g.items.map(function (it, i) {
      return '<span class="chip" style="--i:' + i + '">' + (ICONS[it.icon] || "") + esc(it.name) + "</span>";
    }).join("");
    ci++;
    return '<div class="sk"><div><h3>' + esc(g.group) + "</h3><p>" + esc(g.blurb) + '</p></div><div class="chips">' + chips + "</div></div>";
  }).join("");

  /* Interests */
  $("interestHeading").textContent = C.interests.heading;
  $("interestList").innerHTML = C.interests.items.map(function (it, i) {
    return '<div class="int rv" style="--d:' + (i % 3) * 90 + 'ms"><span>0' + (i + 1) + "</span><h3>" + esc(it[0]) + "</h3><p>" + esc(it[1]) + "</p></div>";
  }).join("");

  /* ---------- Projects (empty-safe, data from projects.js) ---------- */
  function renderProjects() {
    var host = $("projectList");
    var list = (Array.isArray(window.PROJECTS) ? window.PROJECTS : []).filter(function (p) {
      return p && typeof p.title === "string" && p.title.trim();
    });
    if (!list.length) {
      host.innerHTML = '<div class="empty rv"><h3>Selected work is being curated.</h3>' +
        "<p>New projects will appear here as full case studies. In the meantime I'm happy to talk through what I've built.</p>" +
        '<a class="btn" data-magnetic href="' + mailto + "?subject=" + encodeURIComponent("Your work") + '"><span class="btn__t">Ask about my work</span></a></div>';
      return;
    }
    host.innerHTML = list.map(function (p, i) {
      var n = (i + 1 < 10 ? "0" : "") + (i + 1);
      var src = safeSrc(p.image);
      var media;
      if (src) {
        media = '<div class="proj__media"><img src="' + esc(src) + '" alt="' + esc(p.imageAlt || p.title + " preview") + '" loading="lazy" decoding="async" /></div>';
      } else if (Number.isInteger(p.visualIndex) && p.visualIndex >= 0 && p.visualIndex < 16) {
        var vx = Math.round((p.visualIndex % 4) * (100 / 3) * 1000) / 1000;
        var vy = Math.round(Math.floor(p.visualIndex / 4) * (100 / 3) * 1000) / 1000;
        var bg = "background-image:url('assets/project-visuals.jpg');background-size:400% 400%;background-position:" + vx + "% " + vy + "%";
        media = '<div class="proj__media proj__media--ai" role="img" aria-label="AI-generated project visual for ' + esc(p.title) + '" style="' + bg + '"></div>';
      } else {
        media = '<div class="proj__media proj__media--none" aria-hidden="true">' + esc(p.title.charAt(0)) + "</div>";
      }
      var tech = Array.isArray(p.technologies) && p.technologies.length
        ? '<div class="tags">' + p.technologies.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" : "";
      var links = "";
      var live = safeUrl(p.liveUrl), gh = safeUrl(p.githubUrl);
      if (live) links += '<a class="btn btn--solid" data-magnetic href="' + esc(live) + '" target="_blank" rel="noopener noreferrer" aria-label="Open live site of ' + esc(p.title) + '"><span class="btn__t">Live site ↗</span></a>';
      if (gh) links += '<a class="btn" data-magnetic href="' + esc(gh) + '" target="_blank" rel="noopener noreferrer" aria-label="View ' + esc(p.title) + ' on GitHub"><span class="btn__t">GitHub ↗</span></a>';
      var cs = "";
      if (typeof p.caseStudy === "string" && safeUrl(p.caseStudy)) {
        links += '<a class="btn" data-magnetic href="' + esc(safeUrl(p.caseStudy)) + '" target="_blank" rel="noopener noreferrer"><span class="btn__t">Case study ↗</span></a>';
      } else if (p.caseStudy && typeof p.caseStudy === "object") {
        var rows = [["Problem", p.caseStudy.problem], ["Approach", p.caseStudy.approach], ["Outcome", p.caseStudy.outcome]].filter(function (r) { return r[1]; });
        if (rows.length) cs = '<details class="case"><summary>Case study</summary><dl>' + rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl></details>";
      }
      return '<article class="proj rv">' + media + "<div><span class=\"proj__n\">" + n + "</span><h3>" + esc(p.title) + "</h3>" +
        (p.description ? '<p class="proj__d">' + esc(p.description) + "</p>" : "") + tech + cs +
        (links ? '<div class="proj__links">' + links + "</div>" : "") + "</div></article>";
    }).join("");
    $$(".proj__media img", host).forEach(function (img) {
      img.addEventListener("error", function () {
        var d = document.createElement("div");
        d.className = "proj__media proj__media--none"; d.setAttribute("aria-hidden", "true");
        d.textContent = (img.alt || "•").charAt(0);
        img.parentNode.replaceWith(d);
      });
    });
  }
  renderProjects();

  /* ---------- CV: real download only if the PDF exists ---------- */
  function setCv(ok) {
    var cvBtn = $("cvBtn"), t = cvBtn.querySelector(".btn__t"), link = $("linkCv"), lt = $("linkCvText");
    var req = mailto + "?subject=" + encodeURIComponent("CV request") + "&body=" + encodeURIComponent("Hi Ahmed,\n\nCould you please send me your CV?\n\nThanks");
    [[cvBtn, t, "Download CV", "Request my CV"], [link, lt, "Download CV", "Request CV"]].forEach(function (x) {
      var a = x[0], label = x[1];
      if (ok) { a.href = P.cv; a.setAttribute("download", P.cvFilename || "CV.pdf"); label.textContent = x[2]; }
      else { a.href = req; a.removeAttribute("download"); label.textContent = x[3]; }
    });
    $("cvNote").textContent = ok ? "PDF · direct download" : "CV available on request.";
  }
  setCv(false);
  if (window.fetch && P.cv && location.protocol !== "file:") {
    fetch(P.cv, { method: "HEAD", cache: "no-store" }).then(function (r) {
      var ct = (r.headers.get("content-type") || "").toLowerCase();
      setCv(r.ok);
    }).catch(function () { setCv(false); });
  }

  /* ---------- Contact ---------- */
  $("contactHeading").textContent = C.contact.heading;
  $("contactText").textContent = C.contact.text;
  var cm = $("contactMail"); cm.textContent = P.email; cm.href = mailto;
  $("fMail").href = mailto;
  ["linkLinkedIn", "fLinkedIn"].forEach(function (id) { $(id).href = P.linkedin; });
  ["linkGitHub", "fGitHub"].forEach(function (id) { $(id).href = P.github; });
  $("year").textContent = new Date().getFullYear();

  var copyBtn = $("copyMail");
  copyBtn.addEventListener("click", function () {
    function done(ok) {
      copyBtn.textContent = ok ? "Copied" : "Press Ctrl+C";
      setTimeout(function () { copyBtn.textContent = "Copy"; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(P.email).then(function () { done(true); }, function () { done(false); });
    } else {
      try {
        var ta = document.createElement("textarea"); ta.value = P.email; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); var ok = document.execCommand("copy"); document.body.removeChild(ta); done(ok);
      } catch (e) { done(false); }
    }
  });

  var form = $("form"), msg = $("formMsg"), fbtn = $("formBtn"), endpoint = (C.contact.formEndpoint || "").trim();
  $("formHint").textContent = endpoint ? "" : "This opens your email app with the message pre-filled.";
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements, ok = true;
    ["name", "email", "message"].forEach(function (k) {
      var v = f[k].value.trim();
      var bad = !v || (k === "email" && !/^\S+@\S+\.\S+$/.test(v));
      f[k].setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) ok = false;
    });
    msg.className = "form__msg";
    if (!ok) { msg.textContent = "Please add your name, a valid email and a message."; return; }
    var data = { name: f.name.value.trim(), email: f.email.value.trim(), message: f.message.value.trim() };
    if (endpoint) {
      var label = fbtn.querySelector(".btn__t");
      fbtn.disabled = true; label.textContent = "Sending…";
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error("bad"); msg.className = "form__msg ok"; msg.textContent = "Thanks, your message is on its way."; form.reset(); })
        .catch(function () { msg.textContent = "That didn't send. Please email " + P.email + " directly."; })
        .then(function () { fbtn.disabled = false; label.textContent = "Send message"; });
    } else {
      window.location.href = mailto + "?subject=" + encodeURIComponent("Portfolio enquiry from " + data.name) +
        "&body=" + encodeURIComponent(data.message + "\n\n— " + data.name + " (" + data.email + ")");
      msg.className = "form__msg ok";
      msg.textContent = "Opening your email app. If nothing opens, write to " + P.email + ".";
    }
  });

  /* ---------- Nav ---------- */
  var nav = $("nav"), links = $("navLinks"), burger = $("burger"), ind = $("navInd");
  var anchors = $$("a", links);
  function moveInd(a) {
    if (!a || getComputedStyle(ind).display === "none") return;
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = "translateX(" + a.offsetLeft + "px)";
    ind.style.opacity = "1";
  }
  function setActive(id) {
    var cur = null;
    anchors.forEach(function (a) { var on = a.getAttribute("href") === "#" + id; a.classList.toggle("is-on", on); if (on) cur = a; });
    moveInd(cur);
  }
  function closeMenu() { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); }
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  window.addEventListener("resize", function () { var a = anchors.filter(function (x) { return x.classList.contains("is-on"); })[0]; moveInd(a); });

  /* ---------- Scroll effects ---------- */
  var progress = $("progress"), heroIn = $("heroIn"), par = $$("[data-parallax]"), tl = $("timeline");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    nav.classList.toggle("is-stuck", y > 12);
    var max = document.documentElement.scrollHeight - vh;
    progress.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0) + ")";
    if (!RM) {
      par.forEach(function (el) { el.style.transform = "translate3d(0," + (y * parseFloat(el.dataset.parallax)).toFixed(1) + "px,0)"; });
      if (y < vh * 1.2) {
        heroIn.style.transform = "translate3d(0," + (y * 0.1).toFixed(1) + "px,0)";
        heroIn.style.opacity = String(clamp(1 - y / (vh * 0.85), 0, 1));
      }
    }
    var r = tl.getBoundingClientRect();
    tl.style.setProperty("--p", clamp((vh * 0.7 - r.top) / r.height, 0, 1).toFixed(3));
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------- Observers ---------- */
  function observe() {
    var revealSel = ".rv, [data-split], .sk, .proj, .job";
    if (!("IntersectionObserver" in window)) {
      $$(revealSel).forEach(function (el) { el.classList.add("in"); });
      $$(".sec").forEach(function (el) { el.classList.add("seen"); });
      return;
    }
    var rv = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    $$(revealSel).forEach(function (el) { rv.observe(el); });

    var sec = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("seen"); sec.unobserve(en.target); } });
    }, { threshold: 0.05 });
    $$(".sec").forEach(function (el) { sec.observe(el); });

    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "about", "experience", "projects", "skills", "contact"].forEach(function (id) { spy.observe($(id)); });
  }
  observe();

  /* Skill spotlight */
  $$(".sk").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px"); el.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- Cursor + magnetic (fine pointers only) ---------- */
  if (FINE && !RM) {
    var cur = $("cursor"), cx = 0, cy = 0, tx = 0, ty = 0, started = false;
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (!started) { started = true; cx = tx; cy = ty; cur.classList.add("on"); }
    });
    document.addEventListener("pointerleave", function () { cur.classList.remove("on"); started = false; });
    document.addEventListener("mouseover", function (e) {
      cur.classList.toggle("big", !!(e.target.closest && e.target.closest("a,button,summary,[data-hover]")));
    });
    (function loop() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cur.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      requestAnimationFrame(loop);
    })();

    $$("[data-magnetic]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.22, dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
        el.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Boot: loader → ready ---------- */
  function ready() {
    root.classList.add("ready");
    document.body.style.overflow = "";
    onScroll();
    setActive("home");
  }
  var loader = $("loader");
  if (RM || !loader) {
    if (loader) loader.remove();
    ready();
  } else {
    var num = $("loaderNum"), bar = $("loaderBar"), t0 = performance.now(), dur = 1200, fontsOk = false;
    document.body.style.overflow = "hidden";
    var fonts = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1500); })]) : Promise.resolve();
    fonts.then(function () { fontsOk = true; }, function () { fontsOk = true; });
    (function step(now) {
      var p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3), shown = fontsOk ? e : Math.min(e, 0.92);
      num.textContent = ("00" + Math.round(shown * 100)).slice(-3);
      bar.style.transform = "scaleX(" + shown + ")";
      if (p < 1 || !fontsOk) return requestAnimationFrame(step);
      num.textContent = "100"; bar.style.transform = "scaleX(1)";
      setTimeout(function () {
        loader.classList.add("done");
        setTimeout(ready, 350);
        setTimeout(function () { loader.remove(); }, 1100);
      }, 180);
    })(performance.now());
  }

  document.title = C.site.title;
})();
