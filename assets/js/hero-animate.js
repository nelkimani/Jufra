// ===== Premium hero entrance + ambient motion =====
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const eyebrow = document.getElementById('hpEyebrow');
  const lines = document.querySelectorAll('#hpHeading .hp-line');
  const sub = document.getElementById('hpSub');
  const actions = document.getElementById('hpActions');
  const badges = document.getElementById('hpBadges');
  const media = document.getElementById('hpMedia');
  const frame = media ? media.querySelector('.hp-media-frame') : null;

  if (!eyebrow || !window.gsap || reduceMotion) {
    // No GSAP loaded, or the user prefers reduced motion — reveal everything as-is.
    [eyebrow, sub, actions, badges, media].forEach(el => { if (el) el.style.opacity = '1'; });
    lines.forEach(l => { l.style.opacity = '1'; l.style.transform = 'none'; });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(eyebrow, { opacity: 1, y: 0, duration: .6 }, 0.1)
    .fromTo(lines, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .7, stagger: .12 }, 0.25)
    .to(sub, { opacity: 1, duration: .7 }, '-=.3')
    .to(actions, { opacity: 1, y: 0, duration: .6 }, '-=.35')
    .fromTo(actions.children, { y: 16 }, { y: 0, duration: .6, stagger: .08 }, '<')
    .to(badges, { opacity: 1, duration: .5 }, '-=.3')
    .fromTo(badges.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, stagger: .08 }, '<')
    .to(media, { opacity: 1, duration: .8 }, .2)
    .fromTo(frame, { scale: 1.03 }, { scale: 1, duration: 1.1, ease: 'power2.out' }, '<');

  // Gentle idle float once the entrance settles.
  tl.eventCallback('onComplete', () => {
    gsap.to(frame, {
      y: -10,
      duration: 3.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  });
})();
