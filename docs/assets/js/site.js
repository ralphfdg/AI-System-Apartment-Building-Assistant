/* Sohei site: the building navigation, the lift ride between floors, rooms on each floor,
   the person outside, phone tables and evidence carousels. Plain JavaScript, no framework. */
(function () {
  "use strict";
  var root = document.documentElement;
  var motion = root.classList.contains("js-motion");
  var reduce = !motion;
  var ICON = {
    up: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" aria-hidden="true"><path d="M8 13V3.5M3.5 8L8 3.5 12.5 8"/></svg>',
    down: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" aria-hidden="true"><path d="M8 3v9.5M3.5 8L8 12.5 12.5 8"/></svg>',
    next: '<svg class="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>'
  };

  /* ---------- The building: floors in order, ground floor first ---------- */
  var floorLinks = Array.prototype.slice.call(document.querySelectorAll(".floor a")).reverse();
  var floors = floorLinks.map(function (a) {
    return { level: a.getAttribute("data-level"), name: a.getAttribute("data-name"), path: cleanPath(new URL(a.href, location.href).pathname), li: a.parentNode };
  });
  var hereLevel = document.body.getAttribute("data-level");
  var hereIndex = indexOfLevel(hereLevel);

  /* The silver lift car in the shaft: it waits at your floor and rides with you. */
  var car = document.querySelector(".car");
  function carTo(i, ms) {
    if (!car || i < 0 || !floors[i]) return;
    var li = floors[i].li;
    car.style.transitionDuration = (ms || 0) + "ms";
    car.style.setProperty("--car-y", (li.offsetTop + 5) + "px");
    car.style.setProperty("--car-h", Math.max(8, li.offsetHeight - 13) + "px");
  }
  carTo(hereIndex, 0);
  window.addEventListener("resize", function () { if (!riding) carTo(hereIndex, 0); });

  function cleanPath(p) { return p.replace(/index\.html$/, "").replace(/\/+$/, "/"); }
  function indexOfLevel(level) { for (var i = 0; i < floors.length; i++) { if (floors[i].level === level) return i; } return -1; }
  function indexOfPath(path) { path = cleanPath(path); for (var i = 0; i < floors.length; i++) { if (floors[i].path === path) return i; } return -1; }

  /* ---------- Phones: the building slides in from the left ---------- */
  var tower = document.getElementById("tower");
  var opener = document.querySelector(".topbar-floor");
  var closer = document.querySelector(".tower-close");
  function setTower(open) {
    root.classList.toggle("tower-open", open);
    if (opener) opener.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      var current = tower.querySelector('[aria-current="page"]') || tower.querySelector(".floor a");
      if (current) current.focus({ preventScroll: true });
    } else if (opener && tower.contains(document.activeElement)) {
      opener.focus();
    }
  }
  if (opener) opener.addEventListener("click", function () { setTower(!root.classList.contains("tower-open")); });
  if (closer) closer.addEventListener("click", function () { setTower(false); });
  document.addEventListener("click", function (e) {
    if (root.classList.contains("tower-open") && !tower.contains(e.target) && !(opener && opener.contains(e.target))) setTower(false);
  });

  /* ---------- The person outside the door: hover or focus shows the intro; a tap or click pins it ---------- */
  var spot = document.querySelector(".person-spot");
  var person = document.querySelector(".person");
  function setIntro(open) {
    if (!spot) return;
    spot.classList.toggle("is-open", open);
    person.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (person) {
    person.addEventListener("click", function (e) { e.stopPropagation(); setIntro(!spot.classList.contains("is-open")); });
    document.addEventListener("click", function (e) { if (spot.classList.contains("is-open") && !spot.contains(e.target)) setIntro(false); });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (spot && spot.classList.contains("is-open")) { setIntro(false); person.focus(); }
    if (root.classList.contains("tower-open")) setTower(false);
  });

  /* ---------- The lift ride: doors shut, the floors count past, doors open on the new floor ---------- */
  var doorsNum = document.querySelector(".doors-num");
  var doorsName = document.querySelector(".doors-name");
  var doorsDir = document.querySelector(".doors-dir");
  var riding = false;

  function ride(from, to, href) {
    riding = true;
    try { sessionStorage.setItem("sohei-ride", JSON.stringify({ from: floors[from].level, to: floors[to].level })); } catch (e) {}
    root.classList.remove("tower-open");
    var up = to > from;
    doorsDir.innerHTML = up ? ICON.up : ICON.down;
    doorsNum.textContent = floors[from].level;
    doorsName.textContent = floors[to].name;
    root.classList.add("doors-shut");
    var steps = Math.abs(to - from);
    var per = Math.max(80, Math.min(150, 560 / steps));
    carTo(to, 140 + steps * per);
    var passing = null;
    for (var s = 1; s <= steps; s++) {
      (function (s) {
        setTimeout(function () {
          var i = from + (up ? s : -s);
          doorsNum.textContent = floors[i].level;
          if (passing) passing.classList.remove("is-passing");
          passing = floors[i].li;
          passing.classList.add("is-passing");
        }, 140 + s * per);
      })(s);
    }
    setTimeout(function () { location.href = href; }, Math.max(460, 140 + steps * per + 120));
  }

  if (motion && floors.length) {
    document.addEventListener("click", function (e) {
      if (riding || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      var to = indexOfPath(url.pathname);
      if (to < 0 || hereIndex < 0) return;
      if (to === hereIndex) return; /* same floor: just a room or an anchor */
      e.preventDefault();
      ride(hereIndex, to, url.href);
    });

    /* Arriving: the doors were kept shut on first paint by the script in <head>. */
    if (root.classList.contains("is-arriving")) {
      var trip = null;
      try { trip = JSON.parse(sessionStorage.getItem("sohei-ride")); sessionStorage.removeItem("sohei-ride"); } catch (e) {}
      if (trip && hereIndex > -1) {
        doorsDir.innerHTML = indexOfLevel(trip.to) >= indexOfLevel(trip.from) ? ICON.up : ICON.down;
        doorsNum.textContent = floors[hereIndex].level;
        doorsName.textContent = floors[hereIndex].name;
      }
      if (trip) carTo(indexOfLevel(trip.from), 0);
      requestAnimationFrame(function () {
        root.classList.remove("is-arriving");
        setTimeout(function () { carTo(hereIndex, 520); }, 60);
        void root.offsetWidth; /* let the doors' transition come back before they open */
        setTimeout(function () { root.classList.remove("doors-shut"); }, 90);
      });
    }

    /* Back/forward cache: never come back to shut doors. */
    window.addEventListener("pageshow", function (e) {
      if (!e.persisted) return;
      riding = false;
      root.classList.remove("doors-shut", "is-arriving");
      floors.forEach(function (f) { f.li.classList.remove("is-passing"); });
    });
  }

  /* ---------- Rooms: each h2 section of a floor is a room, one open at a time ---------- */
  var main = document.querySelector("main.reading");
  var heads = main && main.getAttribute("data-rooms") !== "off" ? Array.prototype.filter.call(main.children, function (el) { return el.tagName === "H2"; }) : [];
  if (heads.length > 1) {
    var level = main.getAttribute("data-level");
    var bar = document.createElement("div");
    bar.className = "rooms";
    bar.setAttribute("role", "tablist");
    bar.setAttribute("aria-label", "Rooms on this floor");
    var rooms = [], tabs = [];

    heads.forEach(function (h, i) {
      if (!h.id) h.id = "room-" + (i + 1);
      var room = document.createElement("section");
      room.className = "room";
      room.id = "room-" + h.id;
      room.setAttribute("role", "tabpanel");
      room.setAttribute("tabindex", "-1");
      main.insertBefore(room, h);
      var node = h;
      while (node && !(node !== h && node.tagName === "H2")) {
        var nextNode = node.nextSibling;
        room.appendChild(node);
        node = nextNode;
      }
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "room-tab";
      tab.id = "tab-" + h.id;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", room.id);
      tab.innerHTML = '<span class="r-num">' + level + "." + (i + 1) + "</span>";
      tab.appendChild(document.createTextNode(h.textContent));
      room.setAttribute("aria-labelledby", tab.id);
      bar.appendChild(tab);
      rooms.push(room); tabs.push(tab);
    });

    rooms.forEach(function (room, i) {
      if (i === rooms.length - 1) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "room-next";
      btn.innerHTML = '<span><small>Next room</small><span class="r-num">' + level + "." + (i + 2) + "</span> </span>" + ICON.next;
      btn.firstChild.appendChild(document.createTextNode(heads[i + 1].textContent));
      btn.addEventListener("click", function () { open(i + 1, { focus: true, scroll: true, hash: true }); });
      room.appendChild(btn);
    });

    var anchor = document.createElement("div");
    main.insertBefore(anchor, rooms[0]);
    main.insertBefore(bar, rooms[0]);
    main.classList.add("has-rooms");
    var current = -1;

    var open = function (i, opts) {
      opts = opts || {};
      rooms.forEach(function (room, k) {
        var on = k === i;
        room.hidden = !on;
        tabs[k].setAttribute("aria-selected", on ? "true" : "false");
        tabs[k].tabIndex = on ? 0 : -1;
      });
      if (i !== current && current !== -1) {
        rooms[i].classList.remove("is-entering");
        void rooms[i].offsetWidth;
        rooms[i].classList.add("is-entering");
      }
      current = i;
      tabs[i].scrollIntoView({ block: "nearest", inline: "nearest" });
      if (opts.hash) { try { history.replaceState(null, "", "#" + heads[i].id); } catch (e) {} }
      if (opts.scroll) {
        /* If the reader is further down, bring the room's start back under the room bar. */
        var top = anchor.getBoundingClientRect().top + window.pageYOffset - (parseFloat(getComputedStyle(bar).top) || 0);
        if (window.pageYOffset > top) window.scrollTo(0, top);
      }
      if (opts.focus) rooms[i].focus({ preventScroll: true });
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { open(i, { scroll: true, hash: true }); });
      tab.addEventListener("keydown", function (e) {
        var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k === undefined) return;
        e.preventDefault();
        k = (k + tabs.length) % tabs.length;
        open(k, { hash: true });
        tabs[k].focus();
      });
    });

    /* Links to an id inside a room (from another page, or this one) open that room first. */
    var openHash = function () {
      var id = decodeURIComponent(location.hash.slice(1));
      var el = id && document.getElementById(id);
      var room = el && el.closest ? el.closest(".room") : null;
      if (!room) return false;
      open(rooms.indexOf(room));
      if (el === room.firstElementChild) {
        var top = anchor.getBoundingClientRect().top + window.pageYOffset - (parseFloat(getComputedStyle(bar).top) || 0);
        window.scrollTo(0, top);
      } else {
        el.scrollIntoView();
      }
      return true;
    };
    if (!openHash()) open(0);
    window.addEventListener("hashchange", openHash);
  }

  /* ---------- Tables: copy each column heading onto its cells so phones can show rows as label/value lists ---------- */
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

  /* ---------- Evidence carousels: buttons, counter, ticks and arrow keys on top of the CSS scroll-snap track ---------- */
  document.querySelectorAll(".plate.is-carousel").forEach(function (plate) {
    var view = plate.querySelector(".carousel-view");
    var track = plate.querySelector(".carousel-track");
    var slides = track.querySelectorAll(".carousel-slide");
    var prev = plate.querySelector('[data-dir="-1"]');
    var next = plate.querySelector('[data-dir="1"]');
    var now = plate.querySelector(".carousel-now");
    var ticks = plate.querySelectorAll(".carousel-ticks i");
    var index = 0, target = null, release = 0;
    function step() { return (slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth) || 1; }
    function show(i) {
      index = i;
      now.textContent = i + 1;
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
      ticks.forEach(function (t, k) { t.classList.toggle("is-on", k === i); });
    }
    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      target = i;
      clearTimeout(release);
      release = setTimeout(function () { target = null; }, 1500);
      track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: reduce ? "auto" : "smooth" });
      show(i);
    }
    track.addEventListener("scroll", function () {
      var w = step();
      if (target !== null) {
        /* A button or key started this scroll: keep showing its target until it arrives. */
        if (Math.abs(track.scrollLeft - target * w) < 2) target = null;
        return;
      }
      var i = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / w)));
      if (i !== index) show(i);
    }, { passive: true });
    prev.addEventListener("click", function () { go(index - 1); });
    next.addEventListener("click", function () { go(index + 1); });
    view.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    });
    show(0);
    plate.classList.add("is-ready");
  });
})();
