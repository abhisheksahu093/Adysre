/*
 * NOVA - behaviour for the static build.
 *
 * Vanilla, no dependencies, ~60 lines: the scroll-reveal, the stat counters,
 * the header's scrolled state and the contact form's confirmation. It mirrors
 * exactly what the React build does with framer-motion, so the two downloads
 * behave the same.
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

  /* ---- Scroll reveal --------------------------------------------------- */
  var revealables = document.querySelectorAll('.nova-reveal');

  if (!('IntersectionObserver' in window)) {
    // Old browser: show everything rather than hide it forever.
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
      { rootMargin: '-80px' },
    );
    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---- Stat counters --------------------------------------------------- */
  var counters = document.querySelectorAll('.nova-count');

  var runCounter = function (el) {
    var target = Number(el.getAttribute('data-value')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1100;
    var start = null;

    var step = function (now) {
      if (start === null) start = now;
      var progress = Math.min(1, (now - start) / duration);
      // Ease-out cubic, matching the React build's curve.
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '-60px' },
    );
    counters.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  /* ---- Contact form ---------------------------------------------------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('contact-status');

  if (form && status) {
    form.addEventListener('submit', function (event) {
      // Front-end only by design: point this at your own endpoint.
      event.preventDefault();
      status.textContent = 'Thanks - we reply within one business day.';
      form.querySelector('button[type="submit"]').textContent = 'Message sent';
    });
  }
})();
