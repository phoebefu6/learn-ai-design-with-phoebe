/* design-live.js - the Cadence critique lab: a real rendered UI, really measured.
   Usage:
     <div class="dlbox" data-mode="lab" data-levers=""></div>
     <div class="dlbox" data-mode="ladder"></div>
   data-levers = which levers start ON (comma list of: hierarchy,typescale,spacing,contrast,accent,morecolor).

   HONESTY RAIL: the "AI first draft" is a scripted starting point - a plausible composite of
   what an unbriefed generator hands you. Everything after that is REAL measurement, not a
   script: contrast ratios are computed from getComputedStyle with the WCAG 2.1 relative
   luminance formula, spacing conformance is measured off actual computed pixel values, the
   type scale is checked against a real 1.25 modular scale, and the hue count comes from
   converting every rendered colour to HSL. Change the DOM and the score changes with it.

   The sixth lever, "morecolor", is an ANTI-lever. It never raises the score. That is the point:
   more colour is the move most people reach for, and it is the one that costs the most.
*/
(function () {
  "use strict";

  /* ---------- levers ---------- */

  var LEVERS = [
    { key: "hierarchy", label: "Hierarchy",  hint: "One loudest thing. The title jumps a real step above body text, and the shouty banner and button stop competing with it." },
    { key: "typescale", label: "Type scale", hint: "Every size snaps to one 1.25 modular scale (12 / 14 / 16 / 20 / 25 / 31 / 39) instead of seven arbitrary numbers." },
    { key: "spacing",   label: "Spacing",    hint: "Every padding, margin and gap is a multiple of 8. Rhythm you can feel but not name." },
    { key: "contrast",  label: "Contrast",   hint: "Text colours raised until they pass WCAG AA against their real background (4.5:1 body, 3:1 large text)." },
    { key: "accent",    label: "One accent", hint: "A single accent hue family. Everything else becomes neutral and earns its colour back only if it means something." },
    { key: "morecolor", label: "Add colour", hint: "Brighten it up - a teal tag, a pink badge, a yellow highlight. Try it and watch the score." }
  ];

  var SCALE = [12, 14, 16, 20, 25, 31, 39];

  /* ---------- the mock: Cadence, an AI meeting-notes app ---------- */
  /* Each node declares its role; every visual value comes from theme(levers), so the preview
     you see and the numbers we measure are the same thing. */

  function theme(L) {
    var t = {};

    /* --- type sizes --- */
    var off = { eyebrow: 13, h1: 19, meta: 15, bullet: 15, banner: 18, sechead: 15.5, owner: 13, btn: 18, btn2: 15, note: 13.5 };
    t.size = {};
    Object.keys(off).forEach(function (k) { t.size[k] = L.typescale ? snap(off[k]) : off[k]; });
    if (L.hierarchy) {
      t.size.h1 = 31;
      t.size.banner = 12;
      t.size.btn = 16;
      t.size.sechead = 14;
      t.size.eyebrow = 12;
    }

    /* --- weights: off-state has three things shouting at once --- */
    t.weight = {
      eyebrow: 700, h1: 700, meta: 400, bullet: 400,
      banner: 800, sechead: 700, owner: 700,
      btn: L.hierarchy ? 650 : 800, btn2: 600, note: 400
    };
    if (L.hierarchy) { t.weight.h1 = 800; t.weight.banner = 700; t.weight.sechead = 650; }

    /* --- spacing: off-state is 21/13/11/7/19 - no rhythm --- */
    t.sp = L.spacing
      ? { cardPad: 24, gap: 8, blockGap: 24, rowPad: 16, pillPadY: 8, pillPadX: 16, headGap: 8, btnPadY: 16, btnPadX: 24, noteTop: 16 }
      : { cardPad: 21, gap: 11, blockGap: 19, rowPad: 13, pillPadY: 7, pillPadX: 13, headGap: 5, btnPadY: 13, btnPadX: 21, noteTop: 19 };

    /* --- colour: contrast lever raises text, accent lever collapses hue families --- */
    t.c = {};
    t.c.paper = "#FFFFFF";
    t.c.ink = L.contrast ? "#2A1A28" : "#A9A9B8";
    t.c.muted = L.contrast ? "#6B5A69" : "#C7C7D2";
    t.c.note = L.contrast ? "#6B5A69" : "#CFCFD8";
    t.c.hairline = "#EDE2EB";

    /* accent families. off = plum + orange + blue (three families fighting) */
    t.c.accent = "#6B2D5C";
    t.c.bannerBg = L.accent ? "#F9EFF6" : "#FDEDE1";
    t.c.bannerInk = L.accent ? (L.contrast ? "#6B2D5C" : "#C79BB8") : (L.contrast ? "#9A4E12" : "#E8A877");
    t.c.ownerBg = L.accent ? "#F2E9EF" : "#E3EEFD";
    t.c.ownerInk = L.accent ? (L.contrast ? "#4A3546" : "#B9A7B6") : (L.contrast ? "#1D4ED8" : "#93B8F2");
    t.c.btnBg = "#6B2D5C";
    t.c.btnInk = "#FFFFFF";
    t.c.btn2Ink = L.contrast ? "#6B2D5C" : "#B98FAE";
    t.c.btn2Border = "#D8A8C8";
    t.c.bulletDot = L.accent ? "#6B2D5C" : "#E07B39";

    /* the anti-lever: three more hue families, plus a low-contrast highlight */
    t.more = !!L.morecolor;
    if (t.more) {
      t.c.tagBg = "#CCFBF1"; t.c.tagInk = "#14B8A6";   /* teal */
      t.c.badgeBg = "#FCE7F3"; t.c.badgeInk = "#EC4899"; /* pink */
      t.c.hiBg = "#FEF3C7"; t.c.hiInk = "#F5C518";       /* yellow on yellow */
    }
    return t;
  }

  function snap(px) {
    var best = SCALE[0], bd = Infinity;
    SCALE.forEach(function (s) { var d = Math.abs(s - px); if (d < bd) { bd = d; best = s; } });
    return best;
  }

  /* ---------- render the preview from a theme ---------- */

  function el(tag, css, text) {
    var n = document.createElement(tag);
    if (css) n.setAttribute("style", css);
    if (text != null) n.textContent = text;
    return n;
  }

  function px(n) { return n + "px"; }

  function buildStage(t) {
    var stage = el("div", "background:" + t.c.paper + ";padding:" + px(t.sp.cardPad) +
      ";font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;");

    var head = el("div", "display:flex;flex-direction:column;gap:" + px(t.sp.headGap) + ";");
    head.appendChild(el("div", "font-size:" + px(t.size.eyebrow) + ";font-weight:" + t.weight.eyebrow +
      ";letter-spacing:.08em;text-transform:uppercase;color:" + t.c.muted + ";background:" + t.c.paper + ";", "Cadence"));
    head.appendChild(el("h3", "font-size:" + px(t.size.h1) + ";font-weight:" + t.weight.h1 +
      ";line-height:1.25;color:" + t.c.ink + ";background:" + t.c.paper + ";", "Weekly product sync"));
    head.appendChild(el("div", "font-size:" + px(t.size.meta) + ";font-weight:" + t.weight.meta +
      ";color:" + t.c.muted + ";background:" + t.c.paper + ";", "Yesterday, 42 min - 6 participants"));
    stage.appendChild(head);

    var banner = el("div", "margin-top:" + px(t.sp.blockGap) + ";padding:" + px(t.sp.pillPadY) + " " + px(t.sp.pillPadX) +
      ";border-radius:10px;display:inline-block;background:" + t.c.bannerBg + ";color:" + t.c.bannerInk +
      ";font-size:" + px(t.size.banner) + ";font-weight:" + t.weight.banner + ";letter-spacing:.02em;",
      t.more ? "AI SUMMARY - AUTO-GENERATED - NEW" : "AI SUMMARY - AUTO-GENERATED");
    stage.appendChild(banner);

    if (t.more) {
      var tag = el("span", "margin-left:8px;padding:6px 12px;border-radius:999px;background:" + t.c.tagBg +
        ";color:" + t.c.tagInk + ";font-size:12px;font-weight:700;", "Beta");
      stage.appendChild(tag);
      var badge = el("span", "margin-left:8px;padding:6px 12px;border-radius:999px;background:" + t.c.badgeBg +
        ";color:" + t.c.badgeInk + ";font-size:12px;font-weight:700;", "Pro");
      stage.appendChild(badge);
    }

    var sum = el("div", "margin-top:" + px(t.sp.blockGap) + ";display:flex;flex-direction:column;gap:" + px(t.sp.gap) + ";");
    sum.appendChild(el("div", "font-size:" + px(t.size.sechead) + ";font-weight:" + t.weight.sechead +
      ";color:" + t.c.ink + ";background:" + t.c.paper + ";", "Summary"));
    [
      "Pricing page rewrite slipped a week; copy is the blocker.",
      "Churn in the free tier traced to the import step, not onboarding.",
      "Design review moved to Thursdays so engineering can attend."
    ].forEach(function (line, i) {
      var row = el("div", "display:flex;gap:" + px(t.sp.gap) + ";align-items:baseline;");
      row.appendChild(el("span", "color:" + t.c.bulletDot + ";font-size:" + px(t.size.bullet) + ";background:" + t.c.paper + ";", "-"));
      var bg = t.more && i === 1 ? t.c.hiBg : t.c.paper;
      var fg = t.more && i === 1 ? t.c.hiInk : t.c.ink;
      row.appendChild(el("span", "font-size:" + px(t.size.bullet) + ";font-weight:" + t.weight.bullet +
        ";line-height:1.7;color:" + fg + ";background:" + bg + ";", line));
      sum.appendChild(row);
    });
    stage.appendChild(sum);

    var acts = el("div", "margin-top:" + px(t.sp.blockGap) + ";display:flex;flex-direction:column;gap:" + px(t.sp.gap) + ";");
    acts.appendChild(el("div", "font-size:" + px(t.size.sechead) + ";font-weight:" + t.weight.sechead +
      ";color:" + t.c.ink + ";background:" + t.c.paper + ";", "Action items"));
    [["Rewrite pricing copy", "Mei"], ["Instrument the import step", "Dev"]].forEach(function (pair) {
      var row = el("div", "display:flex;justify-content:space-between;align-items:center;gap:" + px(t.sp.gap) +
        ";padding:" + px(t.sp.rowPad) + ";border:1px solid " + t.c.hairline + ";border-radius:10px;background:" + t.c.paper + ";");
      row.appendChild(el("span", "font-size:" + px(t.size.bullet) + ";color:" + t.c.ink + ";background:" + t.c.paper + ";", pair[0]));
      row.appendChild(el("span", "padding:" + px(t.sp.pillPadY) + " " + px(t.sp.pillPadX) +
        ";border-radius:999px;background:" + t.c.ownerBg + ";color:" + t.c.ownerInk +
        ";font-size:" + px(t.size.owner) + ";font-weight:" + t.weight.owner + ";", pair[1]));
      acts.appendChild(row);
    });
    stage.appendChild(acts);

    var btns = el("div", "margin-top:" + px(t.sp.blockGap) + ";display:flex;gap:" + px(t.sp.gap) + ";align-items:center;");
    btns.appendChild(el("button", "padding:" + px(t.sp.btnPadY) + " " + px(t.sp.btnPadX) +
      ";border:none;border-radius:10px;background:" + t.c.btnBg + ";color:" + t.c.btnInk +
      ";font-size:" + px(t.size.btn) + ";font-weight:" + t.weight.btn + ";font-family:inherit;cursor:default;" +
      (t.weight.btn >= 800 ? "text-transform:uppercase;letter-spacing:.06em;" : ""), "Share summary"));
    btns.appendChild(el("button", "padding:" + px(t.sp.btnPadY) + " " + px(t.sp.btnPadX) +
      ";border:1.5px solid " + t.c.btn2Border + ";border-radius:10px;background:" + t.c.paper + ";color:" + t.c.btn2Ink +
      ";font-size:" + px(t.size.btn2) + ";font-weight:" + t.weight.btn2 + ";font-family:inherit;cursor:default;", "Export"));
    stage.appendChild(btns);

    stage.appendChild(el("div", "margin-top:" + px(t.sp.noteTop) + ";font-size:" + px(t.size.note) +
      ";color:" + t.c.note + ";background:" + t.c.paper + ";", "Transcribed automatically. Review before sharing."));

    return stage;
  }

  /* ---------- real measurement ---------- */

  function srgb(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }

  function parseRGB(s) {
    var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(s || "");
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  }

  function lum(c) { return 0.2126 * srgb(c.r) + 0.7152 * srgb(c.g) + 0.0722 * srgb(c.b); }

  function ratio(fg, bg) {
    var a = lum(fg), b = lum(bg);
    var hi = Math.max(a, b), lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05);
  }

  function effectiveBg(node, root) {
    var n = node;
    while (n && n !== root.parentNode) {
      var c = parseRGB(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.1) return c;
      n = n.parentNode;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  function toHSL(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    var h = 0, l = (mx + mn) / 2;
    var s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d !== 0) {
      if (mx === r) h = 60 * (((g - b) / d) % 6);
      else if (mx === g) h = 60 * ((b - r) / d + 2);
      else h = 60 * ((r - g) / d + 4);
    }
    if (h < 0) h += 360;
    return { h: h, s: s, l: l };
  }

  function ownText(node) {
    var s = "";
    for (var i = 0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].nodeType === 3) s += node.childNodes[i].nodeValue;
    }
    return s.trim();
  }

  function audit(stage) {
    var nodes = [stage].concat(Array.prototype.slice.call(stage.querySelectorAll("*")));

    /* --- 1. contrast (real WCAG 2.1) --- */
    var texts = [], failWorst = { r: 99 }, passCount = 0;
    nodes.forEach(function (n) {
      var txt = ownText(n);
      if (!txt) return;
      var cs = getComputedStyle(n);
      var fg = parseRGB(cs.color);
      if (!fg) return;
      var bg = effectiveBg(n, stage);
      var r = ratio(fg, bg);
      var size = parseFloat(cs.fontSize), w = parseInt(cs.fontWeight, 10) || 400;
      var large = size >= 24 || (size >= 18.66 && w >= 700);
      var need = large ? 3 : 4.5;
      var ok = r >= need - 0.005;
      texts.push({ txt: txt, r: r, need: need, ok: ok, size: size });
      if (ok) passCount++;
      else if (r < failWorst.r) failWorst = { r: r, txt: txt };
    });
    var contrastScore = texts.length ? passCount / texts.length : 1;

    /* --- 2. spacing rhythm (real computed px) --- */
    var spVals = [], spOk = 0;
    nodes.forEach(function (n) {
      var cs = getComputedStyle(n);
      ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight",
        "marginTop", "marginBottom", "rowGap", "columnGap"].forEach(function (p) {
          var v = parseFloat(cs[p]);
          if (!v || isNaN(v) || v < 1) return;
          spVals.push(v);
          if (Math.abs(v % 8) < 0.5 || Math.abs(8 - (v % 8)) < 0.5) spOk++;
        });
    });
    var spacingScore = spVals.length ? spOk / spVals.length : 1;

    /* --- 3. type scale conformance (weighted by node count) --- */
    var sizeNodes = 0, sizeOk = 0, sizeSet = {};
    nodes.forEach(function (n) {
      if (!ownText(n)) return;
      var s = parseFloat(getComputedStyle(n).fontSize);
      sizeNodes++;
      sizeSet[s] = (sizeSet[s] || 0) + 1;
      if (SCALE.indexOf(Math.round(s * 10) / 10) !== -1) sizeOk++;
    });
    var scaleScore = sizeNodes ? sizeOk / sizeNodes : 1;
    var distinct = Object.keys(sizeSet).length;

    /* --- 4. hierarchy: one loudest thing, and a real step above body --- */
    var maxSize = 0, bodyCount = {};
    nodes.forEach(function (n) {
      if (!ownText(n)) return;
      var cs = getComputedStyle(n), s = parseFloat(cs.fontSize);
      if (s > maxSize) maxSize = s;
      bodyCount[s] = (bodyCount[s] || 0) + 1;
    });
    var bodySize = 16, bc = -1;
    Object.keys(bodyCount).forEach(function (k) { if (bodyCount[k] > bc) { bc = bodyCount[k]; bodySize = parseFloat(k); } });
    var competing = 0;
    nodes.forEach(function (n) {
      if (!ownText(n)) return;
      var cs = getComputedStyle(n), s = parseFloat(cs.fontSize), w = parseInt(cs.fontWeight, 10) || 400;
      if (s >= maxSize * 0.9 && w >= 700) competing++;
      else if (w >= 800 && s >= bodySize * 1.05) competing++;
    });
    var step = bodySize ? maxSize / bodySize : 1;
    var hierScore = (competing <= 1 ? 0.5 : 0.5 / competing) + Math.min(step / 1.6, 1) * 0.5;

    /* --- 5. accent restraint: real hue families on screen --- */
    var buckets = {};
    nodes.forEach(function (n) {
      var cs = getComputedStyle(n);
      [cs.color, cs.backgroundColor, cs.borderTopColor].forEach(function (v) {
        var c = parseRGB(v);
        if (!c || c.a < 0.1) return;
        var hsl = toHSL(c);
        if (hsl.s < 0.18 || hsl.l > 0.94 || hsl.l < 0.08) return;
        buckets[Math.floor(hsl.h / 30)] = true;
      });
    });
    var families = Object.keys(buckets).length;
    var accentScore = families <= 1 ? 1 : families === 2 ? 0.6 : families === 3 ? 0.3 : families === 4 ? 0.12 : 0;

    var total = Math.round(
      (contrastScore * 0.25 + spacingScore * 0.2 + scaleScore * 0.2 + hierScore * 0.2 + accentScore * 0.15) * 100
    );

    return {
      total: total,
      rows: [
        { k: "Contrast", ok: contrastScore > 0.999, pct: contrastScore,
          why: passCount + " of " + texts.length + " text elements meet WCAG AA" +
            (failWorst.txt ? " - worst " + failWorst.r.toFixed(1) + ":1 on “" + short(failWorst.txt) + "”" : "") },
        { k: "Spacing rhythm", ok: spacingScore > 0.999, pct: spacingScore,
          why: spOk + " of " + spVals.length + " spacing values sit on the 8px grid" },
        { k: "Type scale", ok: scaleScore > 0.999, pct: scaleScore,
          why: sizeOk + " of " + sizeNodes + " text elements use a scale size - " + distinct + " distinct sizes on screen" },
        { k: "Hierarchy", ok: competing <= 1 && step >= 1.6, pct: hierScore,
          why: competing + " element" + (competing === 1 ? "" : "s") + " shouting, title/body step " + step.toFixed(2) + "x (want 1.6x+)" },
        { k: "Colour restraint", ok: families <= 1, pct: accentScore,
          why: families + " hue famil" + (families === 1 ? "y" : "ies") + " on screen" }
      ]
    };
  }

  function short(s) { return s.length > 34 ? s.slice(0, 32) + "…" : s; }

  /* ---------- UI ---------- */

  function scoreClass(n) { return n >= 85 ? "ag-pass" : n >= 60 ? "ag-mid" : "ag-fail"; }

  function renderScore(host, res) {
    host.innerHTML = "";
    var big = el("div", null);
    big.className = "ag-score-big " + scoreClass(res.total);
    big.textContent = "Design score " + res.total + " / 100";
    host.appendChild(big);

    var tbl = el("div", null); tbl.className = "ag-score-table";
    res.rows.forEach(function (r) {
      var row = el("div", null);
      row.className = "ag-score-row " + (r.ok ? "ag-row-pass" : "ag-row-fail");
      var mark = el("span", null, r.ok ? "✓" : "✗"); mark.className = "ag-mark";
      var q = el("span", null); q.className = "ag-q";
      q.textContent = r.k + " - " + Math.round(r.pct * 100) + "%";
      var out = el("span", null, r.why); out.className = "ag-out";
      row.appendChild(mark); row.appendChild(q); row.appendChild(out);
      tbl.appendChild(row);
    });
    host.appendChild(tbl);
  }

  function offscreenScore(L) {
    var wrap = el("div", "position:absolute;left:-9999px;top:0;width:640px;");
    wrap.appendChild(buildStage(theme(L)));
    document.body.appendChild(wrap);
    var res = audit(wrap.firstChild);
    document.body.removeChild(wrap);
    return res;
  }

  function keysToObj(list) {
    var o = {};
    LEVERS.forEach(function (l) { o[l.key] = list.indexOf(l.key) !== -1; });
    return o;
  }

  function buildLab(box) {
    var on = (box.getAttribute("data-levers") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var L = keysToObj(on);

    var bar = el("div", null); bar.className = "ag-levers";
    LEVERS.forEach(function (lv) {
      var b = el("button", null, lv.label);
      b.className = "ag-lever" + (L[lv.key] ? " ag-on" : "") + (lv.key === "morecolor" ? " dl-anti" : "");
      b.title = lv.hint;
      b.addEventListener("click", function () {
        L[lv.key] = !L[lv.key];
        b.classList.toggle("ag-on", L[lv.key]);
        paint();
      });
      bar.appendChild(b);
    });
    box.appendChild(bar);

    var presets = el("div", null); presets.className = "dl-presets";
    [
      { t: "AI first draft", set: [] },
      { t: "Art-directed", set: ["hierarchy", "typescale", "spacing", "contrast", "accent"] }
    ].forEach(function (p) {
      var b = el("button", null, p.t);
      b.className = "dl-preset";
      b.addEventListener("click", function () {
        LEVERS.forEach(function (lv) { L[lv.key] = p.set.indexOf(lv.key) !== -1; });
        Array.prototype.forEach.call(bar.children, function (btn, i) {
          btn.classList.toggle("ag-on", L[LEVERS[i].key]);
        });
        paint();
      });
      presets.appendChild(b);
    });
    box.appendChild(presets);

    var frame = el("div", null); frame.className = "dl-frame";
    var chrome = el("div", null); chrome.className = "dl-chrome";
    chrome.appendChild(el("span", null, "● ● ●"));
    chrome.appendChild(el("span", null, "Cadence - meeting summary"));
    frame.appendChild(chrome);
    var mount = el("div", null); mount.className = "dl-mount";
    frame.appendChild(mount);
    box.appendChild(frame);

    var scoreHost = el("div", null); scoreHost.className = "dl-score";
    box.appendChild(scoreHost);

    var hint = el("p", null); hint.className = "ag-rail";
    hint.textContent = "The starting draft is scripted. Every number below is measured live off this " +
      "preview - real WCAG contrast ratios, real computed pixel values, real hue count. " +
      "Hover a lever to see what it changes.";
    box.appendChild(hint);

    function paint() {
      mount.innerHTML = "";
      mount.appendChild(buildStage(theme(L)));
      renderScore(scoreHost, audit(mount.firstChild));
    }
    paint();
  }

  function buildLadder(box) {
    var rungs = [
      { t: "AI first draft - no direction", set: [] },
      { t: "+ Hierarchy", set: ["hierarchy"] },
      { t: "+ Type scale", set: ["hierarchy", "typescale"] },
      { t: "+ Spacing", set: ["hierarchy", "typescale", "spacing"] },
      { t: "+ Contrast", set: ["hierarchy", "typescale", "spacing", "contrast"] },
      { t: "+ One accent (art-directed)", set: ["hierarchy", "typescale", "spacing", "contrast", "accent"] },
      { t: "Then “add colour” (the anti-lever)", set: ["hierarchy", "typescale", "spacing", "contrast", "accent", "morecolor"], anti: true }
    ];
    var tbl = el("div", null); tbl.className = "ag-score-table dl-ladder";
    var prev = null;
    rungs.forEach(function (r) {
      var res = offscreenScore(keysToObj(r.set));
      var row = el("div", null);
      row.className = "ag-score-row " + (r.anti ? "ag-row-fail" : "ag-row-pass");
      var mark = el("span", null, r.anti ? "✗" : String(res.total)); mark.className = "ag-mark dl-num";
      var q = el("span", null, r.t); q.className = "ag-q";
      var delta = prev === null ? "baseline" : (res.total - prev >= 0 ? "+" : "") + (res.total - prev) + " points";
      var out = el("span", null, r.anti ? res.total + " / 100 - " + delta + ". More colour, less design."
        : res.total + " / 100 - " + delta); out.className = "ag-out";
      row.appendChild(mark); row.appendChild(q); row.appendChild(out);
      tbl.appendChild(row);
      prev = res.total;
    });
    box.appendChild(tbl);
    var rail = el("p", null); rail.className = "ag-rail";
    rail.textContent = "Every score in this table is computed in your browser right now by rendering " +
      "that version of the screen offscreen and measuring it. Nothing here is a hard-coded number.";
    box.appendChild(rail);
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".dlbox"), function (box) {
      var mode = box.getAttribute("data-mode") || "lab";
      if (mode === "ladder") buildLadder(box);
      else buildLab(box);
    });
  });

  window.DESIGN_LIVE = { score: function (list) { return offscreenScore(keysToObj(list || [])); } };
})();
