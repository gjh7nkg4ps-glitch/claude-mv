
/* v9.32: Node-editoren, trin 14. Indlæser den nye three.js (0.186.1) fra teksten i filen og tegner linjerne med WebGPURenderer og TSL.
   Kører for sig selv (type="module"), så r128 (window.THREE) ikke røres. Ved fejl bliver NE14.ok false, og linjerne tegnes med Canvas 2D som før. */
(async () => {
  const N = window.NE14; if (!N) return;
  const vent = async f => { for (let i = 0; i < 200; i++) { const v = f(); if (v) return v; await new Promise(r => setTimeout(r, 100)); } return null; };
  try {
    const tekst = id => document.getElementById(id).textContent, blob = s => URL.createObjectURL(new Blob([s], { type: 'text/javascript' }));
    const kerne = blob(tekst('three-ny-core'));
    /* v9.38: r128 har sat window.__THREE__; den nye three.js advarer så om "Multiple instances" (planens valg A: to udgaver med vilje). Mærket gemmes væk under indlæsningen og sættes tilbage bagefter. */
    const r128mærke = window.__THREE__; delete window.__THREE__;
    let T; try { T = await import(blob(tekst('three-ny-webgpu').split("'./three.core.js'").join("'" + kerne + "'"))); } finally { window.__THREE__ = r128mærke; }
    N.rev = T.REVISION;
    const { attribute, float, smoothstep, abs, max, exp, fract, step, mix } = T.TSL;
    const c2 = await vent(() => document.getElementById('ne-linjer'));
    if (!c2) { N.grund = 'lærredet findes ikke'; return; }
    const cv = document.createElement('canvas'); cv.id = 'ne-linjer-tsl'; cv.className = 'ne-linjer'; cv.setAttribute('aria-hidden', 'true'); c2.parentNode.insertBefore(cv, c2);
    const r = new T.WebGPURenderer({ canvas: cv, antialias: false, alpha: true, forceWebGL: true }); /* v9.62: altid WebGL2; WebGPU kunne ikke prøves i testen, og hos brugeren manglede linjer og lys dér */ /* kanten er allerede blød i materialet (smoothstep), så MSAA spares */
    await r.init(); r.setClearAlpha(0);
    N.backend = r.backend && r.backend.isWebGPUBackend ? 'WebGPU' : 'WebGL2';
    const scene = new T.Scene(), cam = new T.OrthographicCamera(0, 1, 0, 1, -1, 1);
    /* én flade pr. linjestykke: tv går fra −1 til 1 på tværs; kernen er linjens bredde, gløden falder blødt af udenfor */
    const d = abs(attribute('tv', 'float')).mul(attribute('halv', 'float')), w = attribute('bredde', 'float'), gl = attribute('gl', 'float');
    const kant = float(1).sub(smoothstep(w.sub(0.8), w.add(0.8), d));
    const glod = gl.mul(exp(max(d.sub(w), float(0)).mul(-0.22))).mul(0.6);
    const stiplet = mix(float(1), step(0.45, fract(attribute('langs', 'float').div(11))), attribute('stiplet', 'float'));
    const farve = attribute('farve', 'vec4');
    const mat = new T.MeshBasicNodeMaterial({ transparent: true, depthTest: false, depthWrite: false, side: T.DoubleSide }); /* kameraet har y nedad (som skærmen), så fladerne vender om */
    mat.colorNode = farve.xyz; mat.opacityNode = max(kant, glod).mul(farve.w).mul(stiplet);
    const geo = new T.BufferGeometry(), mesh = new T.Mesh(geo, mat); mesh.frustumCulled = false; scene.add(mesh);
    const FELT = [['position', 3], ['farve', 4], ['tv', 1], ['halv', 1], ['bredde', 1], ['gl', 1], ['langs', 1], ['stiplet', 1]];
    let kap = 0, A = {}, n = 0; const farver = new Map(), C = new T.Color();
    const sikr = k => { if (k <= kap) return; kap = Math.max(k, kap * 2, 6000); FELT.forEach(([f, s]) => { A[f] = new Float32Array(kap * s); const b = new T.BufferAttribute(A[f], s); b.setUsage(T.DynamicDrawUsage); geo.setAttribute(f, b); }); };
    const rgb = s => { let v = farver.get(s); if (!v) { try { C.setStyle(s); } catch (e) { C.setRGB(1, 1, 1); } v = [C.r, C.g, C.b]; farver.set(s, v); } return v; };
    const SEG = 24;
    N.start = (W, H, dpr) => { N.tom = !(W >= 1 && H >= 1); if (N.tom) { n = 0; return; } /* v9.39: skjult fane = 0 × 0; WebGPU giver fejl ved tegning på en tom flade */ if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { r.setPixelRatio(dpr); r.setSize(W, H, false); cv.style.width = W + 'px'; cv.style.height = H + 'px'; } cam.right = W; cam.bottom = H; cam.updateProjectionMatrix(); n = 0; N.stat = { links: 0, gloed: 0 }; cv.hidden = false; };
    N.lag = (p0, p1, dx, col, alfa, lw, stip, gloed) => {
      const [cr, cg, cb] = rgb(col), hb = lw / 2, hw = hb + (gloed > 0 ? 16 : 1.5); sikr(n + SEG * 6);
      let px = p0[0], py = p0[1], langs = 0; N.stat.links++; if (gloed > 0) N.stat.gloed++;
      const P = t => { const u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * (p0[0] + dx) + 3 * u * t * t * (p1[0] - dx) + t * t * t * p1[0], u * u * u * p0[1] + 3 * u * u * t * p0[1] + 3 * u * t * t * p1[1] + t * t * t * p1[1]]; };
      for (let s = 1; s <= SEG; s++) {
        const [qx, qy] = P(s / SEG), ex = qx - px, ey = qy - py, l = Math.hypot(ex, ey) || 1, nx = -ey / l * hw, ny = ex / l * hw, l0 = langs, l1 = langs + l;
        const V = [[px + nx, py + ny, 1, l0], [px - nx, py - ny, -1, l0], [qx + nx, qy + ny, 1, l1], [qx + nx, qy + ny, 1, l1], [px - nx, py - ny, -1, l0], [qx - nx, qy - ny, -1, l1]];
        for (const [x, y, tv, lg] of V) { const i = n++; A.position.set([x, y, 0], i * 3); A.farve.set([cr, cg, cb, alfa], i * 4); A.tv[i] = tv; A.halv[i] = hw; A.bredde[i] = hb; A.gl[i] = gloed; A.langs[i] = lg; A.stiplet[i] = stip ? 1 : 0; }
        px = qx; py = qy; langs = l1;
      }
    };
    N.slut = () => { try { FELT.forEach(([f]) => { const b = geo.getAttribute(f); if (b) { b.needsUpdate = true; } }); geo.setDrawRange(0, n); if (!N.tom) r.render(scene, cam); } catch (e) { N.ok = false; N.grund = 'fejl i tegningen: ' + e.message; cv.hidden = true; } };
    N.ryd = () => { n = 0; geo.setDrawRange(0, 0); try { if (!N.tom) r.render(scene, cam); } catch (e) { } cv.hidden = !N.brug(); };
    N.cv = cv; N.renderer = r; sikr(40000);
    N.ok = true; N.grund = '';
    if (typeof neLinjerTegn === 'function') neLinjerTegn();
    if (typeof ne2Kp === 'function' && !NE2.valgt) ne2Kp(true);
  } catch (e) { N.ok = false; N.grund = 'den nye three.js kunne ikke starte (' + (e && e.message || e) + ')'; }
})();
