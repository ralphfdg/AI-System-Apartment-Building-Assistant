/* Sohei site: the lit building, the lift indicator and its section track. Plain JavaScript, no framework. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Home: light the finished windows one by one, ground floor first. */
  var wins = document.querySelectorAll(".win.is-done");
  if (wins.length && document.documentElement.classList.contains("js-motion")) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wins.forEach(function (w) { w.classList.add("is-lit"); });
      });
    });
  }

  /* Window and its line in the parts list highlight each other. */
  document.querySelectorAll(".win").forEach(function (w) {
    var row = document.getElementById("part-" + w.getAttribute("data-part"));
    if (!row) return;
    function on() { w.classList.add("is-hover"); row.classList.add("is-hover"); }
    function off() { w.classList.remove("is-hover"); row.classList.remove("is-hover"); }
    w.addEventListener("mouseenter", on); w.addEventListener("mouseleave", off);
    w.addEventListener("focus", on); w.addEventListener("blur", off);
    row.addEventListener("mouseenter", on); row.addEventListener("mouseleave", off);
  });

  /* Tables: copy each column heading onto its cells so phones can show rows as label/value lists. */
  document.querySelectorAll("main.reading table").forEach(function (t) {
    var heads = Array.prototype.map.call(t.querySelectorAll("thead th"), function (th) { return th.textContent.trim(); });
    if (heads.length < 2 || heads.every(function (h) { return h === ""; })) return;
    t.querySelectorAll("tbody tr").forEach(function (tr) {
      Array.prototype.forEach.call(tr.children, function (td, i) {
        td.setAttribute("data-label", heads[i] || "");
        /* Keep the cell's text and code together as one item next to its label. */
        var v = document.createElement("span");
        v.className = "cell-v";
        while (td.firstChild) v.appendChild(td.firstChild);
        td.appendChild(v);
      });
    });
    t.classList.add("is-stacked");
  });

  /* 2. The lift: count the floors from the level you came from to this one. */
  var lift = document.getElementById("lift");
  if (lift) {
    var order = (lift.getAttribute("data-levels") || "").split(",");
    var here = lift.getAttribute("data-level");
    var numEl = lift.querySelector(".lift-num");
    var dirEl = lift.querySelector(".lift-dir");
    var from = null;
    try { from = sessionStorage.getItem("sohei-level"); sessionStorage.setItem("sohei-level", here); } catch (e) { from = null; }
    var a = order.indexOf(from), b = order.indexOf(here);
    numEl.textContent = here;
    /* Only ride the lift when the page is actually on screen; a background tab just shows its level. */
    if (!reduce && a > -1 && b > -1 && a !== b && document.visibilityState === "visible") {
      var floors = Math.abs(b - a);
      var perFloor = Math.max(90, Math.min(180, 900 / floors));
      var arrow = a < b ? "M8 13V3.5M3.5 8L8 3.5 12.5 8" : "M8 3v9.5M3.5 8L8 12.5 12.5 8";
      dirEl.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="' + arrow + '"/></svg>';
      lift.classList.add("is-moving");
      var start = null;
      var finish = function () {
        numEl.textContent = here;
        setTimeout(function () { lift.classList.remove("is-moving"); }, 500);
      };
      var tick = function (now) {
        if (start === null) start = now;
        var passed = Math.min(floors, Math.floor((now - start) / perFloor));
        numEl.textContent = order[a + (a < b ? passed : -passed)];
        if (passed < floors) requestAnimationFrame(tick); else finish();
      };
      numEl.textContent = order[a];
      requestAnimationFrame(tick);
      /* If the tab is hidden mid-ride, jump straight to the right floor. */
      document.addEventListener("visibilitychange", function () { if (document.visibilityState !== "visible") finish(); }, { once: true });
    }

    /* Section track: one mark per section heading on this level. */
    var track = lift.querySelector(".lift-track");
    var heads = document.querySelectorAll("main.reading h2[id]");
    if (track && heads.length > 1) {
      var links = [];
      heads.forEach(function (h) {
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.href = "#" + h.id;
        link.title = h.textContent;
        link.setAttribute("aria-label", h.textContent);
        li.appendChild(link); track.appendChild(li); links.push(link);
      });
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            links.forEach(function (l) { l.classList.toggle("is-current", l.getAttribute("href") === "#" + en.target.id); });
          });
        }, { rootMargin: "-20% 0px -70% 0px" });
        heads.forEach(function (h) { io.observe(h); });
      }
    } else if (track) { track.remove(); }
  }
})();
