// Shared Three.js hero scenes for the concept project sites
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function scene(kind, el, opts) {
  opts = opts || {};
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  el.appendChild(renderer.domElement);
  var s = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  cam.position.set(0, 0, 8);
  s.add(new THREE.AmbientLight(0xffffff, 0.75));
  var dl = new THREE.DirectionalLight(0xffffff, 1.3); dl.position.set(3, 5, 6); s.add(dl);
  var g = new THREE.Group(); s.add(g);
  var c1 = new THREE.Color(opts.c1 || "#ffffff"), c2 = new THREE.Color(opts.c2 || "#888888");
  var tick = function () {};
  var PI = Math.PI;

  if (kind === "photo") {
    var loader = new THREE.TextureLoader(); loader.setCrossOrigin("anonymous");
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * PI * 2;
      var tex = loader.load("https://picsum.photos/seed/ines" + (11 + i) + "/400/500");
      tex.colorSpace = THREE.SRGBColorSpace;
      var m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
      m.position.set(Math.sin(a) * 3.3, 0, Math.cos(a) * 3.3);
      m.rotation.y = a;
      g.add(m);
    }
    cam.position.set(0, 0.8, 9);
    tick = function (t) { g.rotation.y = t * 0.18; };
  }

  if (kind === "cafe") {
    var pts = [new THREE.Vector2(0, -0.8)];
    for (var j = 0; j <= 12; j++) { var k = j / 12; pts.push(new THREE.Vector2(0.85 + 0.3 * Math.pow(k, 1.4), -0.8 + k * 1.6)); }
    var cupMat = new THREE.MeshStandardMaterial({ color: c1, roughness: 0.35, side: THREE.DoubleSide });
    g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 64), cupMat));
    var coffee = new THREE.Mesh(new THREE.CircleGeometry(1.08, 48), new THREE.MeshStandardMaterial({ color: c2, roughness: 0.2 }));
    coffee.rotation.x = -PI / 2; coffee.position.y = 0.6; g.add(coffee);
    var handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.11, 16, 40, PI), cupMat);
    handle.position.set(1.05, 0, 0); handle.rotation.z = -PI / 2; g.add(handle);
    var saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.6, 0.14, 64), cupMat);
    saucer.position.y = -0.88; g.add(saucer);
    var steam = [];
    for (var q = 0; q < 3; q++) {
      var st = new THREE.Mesh(new THREE.TorusGeometry(0.22 + q * 0.05, 0.025, 8, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
      st.rotation.x = PI / 2; st.userData.o = q; g.add(st); steam.push(st);
    }
    g.rotation.x = 0.38; cam.position.set(0, 0.4, 6.5);
    tick = function (t) {
      g.rotation.y = t * 0.4;
      steam.forEach(function (st) { var p = (t * 0.4 + st.userData.o / 3) % 1; st.position.y = 0.8 + p * 1.8; st.material.opacity = 0.5 * (1 - p); st.scale.setScalar(1 + p); });
    };
  }

  if (kind === "growth") {
    var bars = [];
    for (var b = 0; b < 7; b++) {
      var h = 0.5 + b * 0.45;
      var col = c1.clone().lerp(c2, b / 6);
      var bar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1, 0.55), new THREE.MeshStandardMaterial({ color: col, roughness: 0.3, metalness: 0.1 }));
      bar.position.set((b - 3) * 0.8, 0, 0); bar.userData.h = h; g.add(bar); bars.push(bar);
    }
    var curve = new THREE.CatmullRomCurve3(bars.map(function (br) { return new THREE.Vector3(br.position.x, br.userData.h - 1.2 + 0.45, 0); }));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.05, 8, false), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: c2, emissiveIntensity: 0.4 })));
    g.position.y = -0.3; g.rotation.x = 0.2; cam.position.set(0, 0.5, 8);
    tick = function (t) {
      g.rotation.y = Math.sin(t * 0.4) * 0.6;
      bars.forEach(function (br, n) { var grow = Math.min(1, Math.max(0.05, (t * 0.8 - n * 0.15))); var hh = br.userData.h * grow; br.scale.y = hh; br.position.y = hh / 2 - 1.2; });
    };
  }

  if (kind === "flow") {
    var path = new THREE.CatmullRomCurve3([new THREE.Vector3(-3, -1, 0), new THREE.Vector3(-1.5, 0.8, 0.6), new THREE.Vector3(0, -0.2, -0.4), new THREE.Vector3(1.5, 1, 0.5), new THREE.Vector3(3, -0.4, 0)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(path, 120, 0.05, 8, false), new THREE.MeshStandardMaterial({ color: 0x3a4a43 })));
    for (var n = 0; n <= 4; n++) {
      var node = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: n === 0 ? c1 : c2, roughness: 0.35 }));
      node.position.copy(path.getPoint(n / 4)); node.userData.r = n; g.add(node);
    }
    var pulses = [];
    for (var p2 = 0; p2 < 4; p2++) {
      var pu = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: c1 }));
      pu.userData.o = p2 / 4; g.add(pu); pulses.push(pu);
    }
    tick = function (t) {
      g.rotation.y = Math.sin(t * 0.3) * 0.5;
      g.children.forEach(function (c) { if (c.geometry && c.geometry.type === "BoxGeometry") { c.rotation.x = t * 0.6 + c.userData.r; c.rotation.y = t * 0.8; } });
      pulses.forEach(function (pu) { pu.position.copy(path.getPoint(Math.abs((t * 0.15 + pu.userData.o) % 1))); });
    };
  }

  if (kind === "ai") {
    var N = 1800, pos = new Float32Array(N * 3);
    for (var v = 0; v < N; v++) {
      var u = Math.random() * 2 - 1, th = Math.random() * PI * 2, rr = 2.4 + Math.random() * 0.15, sq = Math.sqrt(1 - u * u);
      pos[v * 3] = rr * sq * Math.cos(th); pos[v * 3 + 1] = rr * u; pos[v * 3 + 2] = rr * sq * Math.sin(th);
    }
    var geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: c1, size: 0.035 })));
    var core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), new THREE.MeshStandardMaterial({ color: c2, wireframe: true }));
    g.add(core);
    var inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), new THREE.MeshStandardMaterial({ color: c1, roughness: 0.2, metalness: 0.3, flatShading: true }));
    g.add(inner);
    tick = function (t) { g.rotation.y = t * 0.15; core.rotation.x = t * 0.3; inner.rotation.y = -t * 0.6; inner.scale.setScalar(1 + Math.sin(t * 2) * 0.06); };
  }

  var mx = 0, my = 0;
  el.addEventListener("pointermove", function (e) { var r = el.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5; });
  function size() { var w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  size(); window.addEventListener("resize", size);
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t0 = performance.now();
  function loop(now) {
    var t = still ? 2 : Math.max(0, (now - t0) / 1000);
    tick(t);
    s.rotation.x += (my * 0.25 - s.rotation.x) * 0.05;
    s.rotation.z += (-mx * 0.1 - s.rotation.z) * 0.05;
    renderer.render(s, cam);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
