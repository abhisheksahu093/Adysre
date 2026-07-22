/*
 * SAFFRON - behaviour for the static builds.
 *
 * Vanilla and dependency-free: the scroll reveal (which also triggers the drawn
 * rules), the plate parallax, the header's scrolled state, the mobile menu and
 * the reservation form's confirmation. It mirrors what the React build does
 * with framer-motion so both downloads behave identically.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header ---------------------------------------------------------- */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile menu ----------------------------------------------------- */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) menu.removeAttribute('hidden');
      else menu.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---- Scroll reveal --------------------------------------------------- */
  var revealables = document.querySelectorAll('.saf-reveal');

  if (!('IntersectionObserver' in window)) {
    revealables.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '-90px' },
    );
    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---- Plate parallax -------------------------------------------------- */
  var parallaxes = document.querySelectorAll('[data-parallax]');

  if (parallaxes.length && !reduceMotion) {
    var frame = null;

    var applyParallax = function () {
      frame = null;
      var viewport = window.innerHeight;

      parallaxes.forEach(function (el) {
        var box = el.getBoundingClientRect();
        if (box.bottom < 0 || box.top > viewport) return;

        var range = Number(el.getAttribute('data-parallax')) || 60;
        // 0 when the element enters at the bottom, 1 as it leaves at the top.
        var progress = (viewport - box.top) / (viewport + box.height);
        var offset = (0.5 - progress) * range;
        el.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0)';
      });
    };

    var queueParallax = function () {
      if (frame === null) frame = requestAnimationFrame(applyParallax);
    };

    applyParallax();
    window.addEventListener('scroll', queueParallax, { passive: true });
    window.addEventListener('resize', queueParallax);
  }

  /* ---- Reservation form ------------------------------------------------ */
  var form = document.getElementById('reservation-form');
  var status = document.getElementById('reservation-status');

  if (form && status) {
    form.addEventListener('submit', function (event) {
      // Front-end only by design: point this at your booking provider.
      event.preventDefault();
      status.textContent = 'Thank you - we will confirm your table within the day.';
      form.querySelector('button[type="submit"]').textContent = 'Request received';
    });
  }
})();
