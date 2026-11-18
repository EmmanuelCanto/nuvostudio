import { titles } from './data/site.js';
import { fitPills, reduceMotion } from './scenes/anim.js';
import { scrollYFor, scrollToY } from './screens.js';

/*
  Rutas por hash (misma semántica que el sitio original):
    #inicio (o vacío)   -> vista home, arriba
    #perfil-1 / #perfil-2 -> vistas de CV
    #otra-seccion       -> vista home y desplazamiento a esa sección (64 px de margen)
    hash inválido       -> inicio
  views: { home, 'perfil-1', 'perfil-2' } -> elementos .view
*/
export function createRouter(views) {
  let current = null;
  const reduce = reduceMotion();
  function show(name) {
    if (current === name) return false;
    Object.keys(views).forEach((k) => {
      views[k].hidden = (k !== name);
      views[k].classList.remove('enter');
    });
    void views[name].offsetWidth;
    views[name].classList.add('enter');
    document.title = titles[name];
    current = name;
    fitPills();
    return true;
  }
  function route() {
    let hash = (location.hash || '#inicio').replace(/^#/, '');
    if (!/^[a-z0-9-]+$/i.test(hash)) hash = 'inicio';
    if (hash === 'perfil-1' || hash === 'perfil-2') {
      show(hash);
      window.scrollTo(0, 0);
      return;
    }
    const changed = show('home');
    const target = document.getElementById(hash);
    if (!target || hash === 'inicio' || !views.home.contains(target)) {
      if (changed || hash === 'inicio') window.scrollTo(0, 0);
      return;
    }
    requestAnimationFrame(() => {
      const y = scrollYFor(target);
      scrollToY(y, !(changed || reduce));
    });
  }
  return { route, show };
}
