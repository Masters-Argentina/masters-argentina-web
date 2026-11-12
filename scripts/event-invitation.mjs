// Invitación temporal: cambiar enabled a false y reconstruir para retirarla.
export const eventInvitation = Object.freeze({
  enabled: true,
  endsAt: '2026-12-17T20:00:00-03:00',
  registrationUrl: 'https://tally.so/r/WJE29v',
});

export function renderEventInvitation(now = new Date()) {
  if (!eventInvitation.enabled || now.getTime() >= Date.parse(eventInvitation.endsAt)) return '';
  return `<section class="event-invitation" id="encuentro-masters-ypf" tabindex="-1" aria-labelledby="invitation-title" data-event-ends="${eventInvitation.endsAt}">
  <div class="event-invitation-inner">
    <div class="event-invitation-heading">
      <div class="event-invitation-brands" aria-label="Masters Argentina e YPF">
        <img class="invitation-masters" src="assets/event-masters.webp" alt="Masters Argentina" width="360" height="134" decoding="async">
        <span class="invitation-brand-divider" aria-hidden="true"></span>
        <img class="invitation-ypf" src="assets/home-ypf.svg" alt="YPF" width="628" height="159" decoding="async">
      </div>
      <p class="invitation-kicker">Encuentro Masters Argentina + YPF</p>
    </div>
    <div class="event-invitation-grid">
      <div class="event-invitation-copy">
        <div class="invitation-speaker">
          <img class="invitation-portrait" src="assets/horacio-marin.jpg" alt="Horacio Marín" width="800" height="800" loading="lazy" decoding="async">
          <h2 id="invitation-title">Invitado: <span>Horacio Marín</span></h2>
        </div>
        <p class="invitation-program"><strong>Presentación del CEO de YPF y networking</strong> con estudiantes, alumni y profesionales.</p>
        <p class="invitation-community">Conocé al equipo de Masters Argentina y sumate a una comunidad para ayudarnos entre todos.</p>
      </div>
      <div class="event-invitation-details">
        <p class="invitation-date"><time datetime="2026-12-17">Jueves 17 de diciembre de 2026</time><span>17:30 a 20:00 hs <span class="invitation-timezone">(hora de Buenos Aires)</span></span></p>
        <p class="invitation-location"><strong>Auditorio YPF</strong><span>Puerto Madero, Buenos Aires</span></p>
      </div>
      <div class="event-invitation-action">
        <span class="invitation-capacity">Cupos limitados</span>
        <a class="invitation-register" href="${eventInvitation.registrationUrl}" aria-describedby="invitation-registration-note">Inscribirme <span aria-hidden="true">↗</span></a>
        <small id="invitation-registration-note">Inscripción sujeta a confirmación<br class="invitation-desktop-break"> por disponibilidad.</small>
      </div>
    </div>
    <p class="invitation-audience"><strong>Este encuentro es para vos</strong> si estás pensando en aplicar, estás aplicando o cursás un máster en el exterior, o si ya sos alumni.</p>
  </div>
</section>`;
}

// Ocupa el lugar del enlace de la edición anterior, sin sumar otra acción al hero.
export function renderEventInvitationLink() {
  return '<a class="text-link home-invitation-link" href="#encuentro-masters-ypf" data-event-link><span>Próximo encuentro · Masters + YPF</span><small>17 de diciembre · <strong>Cupos limitados</strong> · Inscribite <span aria-hidden="true">↓</span></small></a>';
}
