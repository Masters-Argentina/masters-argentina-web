'use strict';
// Retira la invitación vencida incluso si todavía no hubo otra publicación.
(() => {
  const invitation = document.querySelector('[data-event-ends]');
  if (!invitation) return;
  const end = Date.parse(invitation.dataset.eventEnds);
  if (!Number.isFinite(end)) return;
  function update() {
    const remaining = end - Date.now();
    if (remaining <= 0) {
      invitation.hidden = true;
      const heroLink = document.querySelector('[data-event-link]');
      if (heroLink) {
        heroLink.href = (document.body.dataset.siteRoot || './') + 'ediciones/2026/';
        heroLink.classList.remove('home-invitation-link');
        heroLink.textContent = 'Conocé la conferencia 2026 →';
        heroLink.removeAttribute('data-event-link');
      }
      const nextConference = document.querySelector('.home-event .eyebrow');
      if (nextConference) nextConference.textContent = 'El próximo encuentro';
      return;
    }
    window.setTimeout(update, Math.min(remaining, 2147483647));
  }
  update();
})();
