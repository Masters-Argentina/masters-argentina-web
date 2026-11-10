let cleanupManualCarousels = () => {};

function initManualCarousels() {
  cleanupManualCarousels();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const rails = [];
  document.querySelectorAll('.home-logo-window,.conference-circle-window').forEach((viewport, index) => {
    const track = viewport.firstElementChild;
    if (!track) return;
    const area = viewport.closest('.home-partners,.conference-universities,.conference-archive-carousels');
    const toggle = area?.querySelector('.home-motion-toggle,.conference-carousel-toggle');
    const title = viewport.getAttribute('aria-label')?.split('.')[0] || 'Carrusel';
    const shell = document.createElement('div');
    shell.className = 'carousel-shell';
    viewport.before(shell);
    shell.append(viewport);
    viewport.id = `carousel-${index}`;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', `${title}. Desplazamiento horizontal`);
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    shell.append(controls);

    function pause() {
      area?.classList.add('is-paused');
      if (toggle) {
        toggle.setAttribute('aria-pressed', 'true');
        toggle.textContent = toggle.textContent.includes('carruseles') ? 'Reanudar carruseles' : 'Reanudar carrusel';
      }
    }
    function move(direction) {
      pause();
      const cycle = track.firstElementChild?.getBoundingClientRect().width || 0;
      if (!reducedMotion.matches && cycle) {
        // The repeated groups allow moving left from the beginning without a dead end.
        viewport.scrollLeft = ((viewport.scrollLeft % cycle) + cycle) % cycle;
        if (direction < 0 && viewport.scrollLeft < 1) viewport.scrollLeft = cycle;
      }
      viewport.scrollBy({left:direction * Math.max(180, viewport.clientWidth * .75), behavior:reducedMotion.matches ? 'instant' : 'smooth'});
    }
    for (const [direction, symbol, name] of [[-1,'←','Anterior'],[1,'→','Siguiente']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'carousel-arrow';
      button.textContent = symbol;
      button.setAttribute('aria-label', `${name}: ${title}`);
      button.setAttribute('aria-controls', viewport.id);
      button.addEventListener('click', () => move(direction));
      controls.append(button);
    }
    viewport.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    });
    viewport.addEventListener('wheel', event => {
      if (Math.abs(event.deltaX) > 0 || event.shiftKey) pause();
    }, {passive:true});
    let drag = null;
    viewport.addEventListener('pointerdown', event => {
      pause();
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      event.preventDefault();
      viewport.focus({preventScroll:true});
      drag = {x:event.clientX, left:viewport.scrollLeft};
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    });
    viewport.addEventListener('pointermove', event => {
      if (drag) viewport.scrollLeft = drag.left - (event.clientX - drag.x);
    });
    const endDrag = () => {drag = null;viewport.classList.remove('is-dragging');};
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('lostpointercapture', endDrag);
    const duration = viewport.closest('.e26-speakers') ? 150 : viewport.closest('.conference-universities') ? 115 : track.classList.contains('conference-circle-track-sponsors') ? 28 : track.classList.contains('home-logo-track') ? 34 : 48;
    rails.push({viewport, track, area, duration, position:0});
  });
  let frame = 0;
  let previous = 0;
  function animate(now) {
    const elapsed = previous ? Math.min(now - previous, 50) / 1000 : 0;
    previous = now;
    for (const rail of rails) {
      const {viewport, track, area, duration} = rail;
      const bounds = viewport.getBoundingClientRect();
      if (reducedMotion.matches || area?.classList.contains('is-paused') || viewport.matches(':hover,:focus-within') || bounds.bottom < 0 || bounds.top > innerHeight) {
        rail.position = viewport.scrollLeft;
        continue;
      }
      const cycle = track.firstElementChild?.getBoundingClientRect().width || 0;
      if (!cycle || viewport.scrollWidth <= viewport.clientWidth) continue;
      rail.position = (rail.position + cycle / duration * elapsed) % cycle;
      viewport.scrollLeft = rail.position;
    }
    frame = requestAnimationFrame(animate);
  }
  frame = requestAnimationFrame(animate);
  cleanupManualCarousels = () => cancelAnimationFrame(frame);
}
