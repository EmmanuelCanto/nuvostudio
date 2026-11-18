/* Utilidades de animación: port literal del script original. */
export function bez(x1, y1, x2, y2) {
  return function (x) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let lo = 0, hi = 1, u = x, i, cx;
    for (i = 0; i < 24; i++) {
      cx = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
      if (Math.abs(cx - x) < 1e-4) break;
      if (cx < x) lo = u; else hi = u;
      u = (lo + hi) / 2;
    }
    return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  };
}
export const E = bez(.65, 0, .35, 1);
export function seg(t, a, b) { return t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a); }
export function back(p) { if (p <= 0) return 0; if (p >= 1) return 1; p -= 1; return 1 + 2.70158 * p * p * p + 1.70158 * p * p; }
export function draw(el, p) { el.style.strokeDashoffset = 1 - p; el.style.visibility = p > 0.003 ? 'visible' : 'hidden'; }
export function T(el, x, y, s, r) { el.setAttribute('transform', 'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ') rotate(' + (r || 0) + ') scale(' + Math.max(0, s).toFixed(3) + ')'); }
export function pad(n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; }
// momento (en segundos) en que una transición E entre a y b alcanza la fracción f
export function when(a, b, f) { for (let t = a; t < b; t += .01) { if (E(seg(t, a, b)) >= f) return t; } return b; }
export function popPill(g, k) { T(g, +g.dataset.x, +g.dataset.y, k, +g.dataset.r * (2 - k)); g.style.opacity = Math.min(1, k * 2.5); }
export const q = (el, s) => el.querySelector(s);
export const qa = (el, s) => Array.prototype.slice.call(el.querySelectorAll(s));

export function fitPills(root) {
  qa(root || document, 'g.pill').forEach(function (g) {
    const tx = q(g, 'text'), r = q(g, 'rect');
    let w = 0;
    try { w = tx.getComputedTextLength(); } catch (e) { /* noop */ }
    if (!w) w = tx.textContent.length * 9.4;
    r.setAttribute('x', -(w / 2 + 17)); r.setAttribute('width', w + 34);
    r.setAttribute('y', -20); r.setAttribute('height', 40); r.setAttribute('rx', 20);
    if (!g.hasAttribute('transform')) T(g, +g.dataset.x, +g.dataset.y, 1, +g.dataset.r);
  });
}

// ondas de audio (barras)
export function bars(el, n) {
  const a = [];
  el.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const v = .28 + .72 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * .53 + 1));
    const b = document.createElement('i'); el.appendChild(b); a.push({ el: b, v: v });
  }
  return a;
}

export const reduceMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
