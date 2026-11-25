/* Retro playful kit: stickers, badges, marquees, tilt, reveal and parallax */
(function () {
  var STAR = "M50 0C55 35 65 45 100 50C65 55 55 65 50 100C45 65 35 55 0 50C35 45 45 35 50 0Z";
  function burst() {
    var p = [];
    for (var i = 0; i < 24; i++) { var r = i % 2 ? 38 : 50, a = i / 24 * Math.PI * 2; p.push((50 + r * Math.cos(a)).toFixed(1) + "," + (50 + r * Math.sin(a)).toFixed(1)); }
    return '<polygon points="' + p.join(" ") + '"/>';
  }
  function flower(c2) {
    var s = "";
    for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; s += '<circle cx="' + (50 + 26 * Math.cos(a)).toFixed(1) + '" cy="' + (50 + 26 * Math.sin(a)).toFixed(1) + '" r="21"/>'; }
    return s + '<circle cx="50" cy="50" r="16" style="fill:' + c2 + '"/>';
  }
  var shapes = {
    star: function () { return '<path d="' + STAR + '"/>'; },
    burst: function () { return burst(); },
    flower: function (c2) { return flower(c2); },
    heart: function () { return '<path d="M50 88C20 65 5 48 5 30A22 22 0 0 1 50 22A22 22 0 0 1 95 30C95 48 80 65 50 88Z"/>'; },
    circle: function () { return '<circle cx="50" cy="50" r="46"/>'; },
    smile: function () { return '<circle cx="50" cy="50" r="46"/><circle cx="36" cy="42" r="5" style="fill:var(--ink)"/><circle cx="64" cy="42" r="5" style="fill:var(--ink)"/><path d="M32 60Q50 78 68 60" style="fill:none"/>'; }
  };
  document.querySelectorAll("[data-sticker]").forEach(function (el) {
    var k = el.getAttribute("data-sticker"), c = el.getAttribute("data-color") || "var(--a1)", c2 = el.getAttribute("data-color2") || "var(--a3)";
    var f = shapes[k] || shapes.star;
    el.innerHTML = '<svg viewBox="0 0 100 100"><g style="fill:' + c + ';stroke:var(--ink);stroke-width:3;stroke-linejoin:round">' + f(c2) + "</g></svg>";
  });
  var n = 0;
  document.querySelectorAll("[data-badge]").forEach(function (el) {
    var t = el.getAttribute("data-badge"), bg = el.getAttribute("data-color") || "var(--a3)", id = "bp" + (n++);
    el.innerHTML = '<svg viewBox="0 0 200 200"><defs><path id="' + id + '" d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0"/></defs>' +
      '<circle cx="100" cy="100" r="95" style="fill:' + bg + ';stroke:var(--ink);stroke-width:4"/>' +
      '<text style="font:700 16px DM Sans,sans-serif;letter-spacing:3.2px;fill:var(--ink);text-transform:uppercase"><textPath href="#' + id + '">' + t + "</textPath></text>" +
      '<path transform="translate(72 72) scale(.56)" d="' + STAR + '" style="fill:var(--a1);stroke:var(--ink);stroke-width:5"/></svg>';
  });
  document.querySelectorAll("[data-marquee]").forEach(function (el) {
    var items = el.getAttribute("data-marquee").split("|"), html = "";
    items.forEach(function (it) { html += "<span>" + it + '</span><span class="sep">✦</span>'; });
    el.innerHTML = "<div>" + html + html + html + html + "</div>";
  });
  document.querySelectorAll(".tilt").forEach(function (c) {
    var amt = parseFloat(c.getAttribute("data-tilt") || "10");
    c.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = "perspective(900px) rotateY(" + (x * amt) + "deg) rotateX(" + (-y * amt) + "deg) translateZ(8px)";
    });
    c.addEventListener("mouseleave", function () { c.style.transform = ""; });
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el, i) { el.style.transitionDelay = ((i % 4) * 0.08) + "s"; io.observe(el); });
  } else { document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); }); }
  var deep = document.querySelectorAll("[data-depth]");
  window.addEventListener("mousemove", function (e) {
    var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
    deep.forEach(function (el) { var d = parseFloat(el.getAttribute("data-depth")); el.style.transform = "translate(" + (x * d) + "px," + (y * d) + "px)"; });
  });
  var spins = document.querySelectorAll("[data-scroll-spin]");
  window.addEventListener("scroll", function () { var s = window.scrollY; spins.forEach(function (el) { el.style.rotate = (s * 0.15) + "deg"; }); }, { passive: true });
})();
