(function () {
  'use strict';

  // ----- Year in footer -----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Nav scroll state -----
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- Logo hover: golden shimmer follows cursor -----
  var navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('mouseenter', function () {
      navLogo.style.setProperty('--logo-x', '50%');
      navLogo.style.setProperty('--logo-y', '50%');
    });
    navLogo.addEventListener('mousemove', function (e) {
      var rect = navLogo.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      navLogo.style.setProperty('--logo-x', x + '%');
      navLogo.style.setProperty('--logo-y', y + '%');
    });
  }

  // ----- Scroll to section if URL has hash (e.g. #contact) -----
  if (window.location.hash) {
    var hashEl = document.querySelector(window.location.hash);
    if (hashEl) {
      setTimeout(function () {
        hashEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // ----- Mobile nav toggle -----
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    var closeBtn = navLinks.querySelector('.nav-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  }

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----- Video modal -----
  var modal = document.getElementById('videoModal');
  var modalPlayer = modal && modal.querySelector('.video-modal-player');
  var modalVideo = modal && modal.querySelector('.video-modal-player video');
  var modalIframe = modal && modal.querySelector('.video-modal-iframe');
  var modalBackdrop = modal && modal.querySelector('.video-modal-backdrop');
  var modalClose = modal && modal.querySelector('.video-modal-close');
  var modalLoading = document.getElementById('videoModalLoading');

  function hideModalLoading() {
    if (modalLoading) modalLoading.classList.add('is-hidden');
  }

  function showModalLoading() {
    if (modalLoading) modalLoading.classList.remove('is-hidden');
  }

  function isDropboxUrl(src) {
    return src && src.indexOf('dropbox.com') !== -1;
  }

  function getGoogleDriveEmbedUrl(src) {
    if (!src || src.indexOf('drive.google.com') === -1) return null;
    var match = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    var base = 'https://drive.google.com/file/d/' + match[1] + '/preview';
    return base + (base.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
  }

  function openModal(src) {
    if (!modal || !modalPlayer) return;
    showModalLoading();
    var driveEmbed = getGoogleDriveEmbedUrl(src);
    if (driveEmbed) {
      if (modalVideo) {
        modalVideo.style.display = 'none';
        modalVideo.removeAttribute('src');
      }
      if (modalIframe) {
        modalIframe.style.display = 'block';
        modalIframe.onload = function () {
          modalIframe.onload = null;
          hideModalLoading();
        };
        modalIframe.src = driveEmbed;
      }
    } else if (isDropboxUrl(src)) {
      if (modalVideo) {
        modalVideo.style.display = 'none';
        modalVideo.removeAttribute('src');
      }
      if (modalIframe) {
        var viewUrl = src.replace('?dl=1', '').replace('?dl=0', '') || src;
        if (viewUrl.indexOf('?') === -1) viewUrl += '?dl=0';
        modalIframe.style.display = 'block';
        modalIframe.onload = function () {
          modalIframe.onload = null;
          hideModalLoading();
        };
        modalIframe.src = viewUrl;
      }
    } else {
      if (modalIframe) {
        modalIframe.style.display = 'none';
        modalIframe.removeAttribute('src');
      }
      if (modalVideo) {
        modalVideo.style.display = 'block';
        modalVideo.src = src;
        modalVideo.currentTime = 0;
        modalVideo.oncanplay = function () {
          modalVideo.oncanplay = null;
          hideModalLoading();
        };
        modalVideo.play().catch(function () {});
      }
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (modalLoading) modalLoading.classList.add('is-hidden');
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.style.display = 'block';
    }
    if (modalIframe) {
      modalIframe.removeAttribute('src');
      modalIframe.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  // ----- Portfolio: click to open video -----
  document.querySelectorAll('.portfolio-thumb').forEach(function (thumb) {
    var src = thumb.getAttribute('data-video-src');
    if (!src) return;

    // Hover preview: only for direct video URLs (not Drive/Dropbox)
    var hoverVideo = thumb.querySelector('.portfolio-thumb-video');
    if (hoverVideo && !getGoogleDriveEmbedUrl(src) && !isDropboxUrl(src)) {
      hoverVideo.src = src;
      thumb.addEventListener('mouseenter', function () {
        hoverVideo.style.opacity = '1';
        hoverVideo.play().catch(function () {});
      });
      thumb.addEventListener('mouseleave', function () {
        hoverVideo.style.opacity = '0';
        hoverVideo.pause();
      });
    }

    thumb.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(src);
    });
  });

  // ----- Portfolio: category filter -----
  var filterBtns = document.querySelectorAll('.filter-btn');
  var portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = this.getAttribute('data-category');
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      // If filtering by a specific category, expand grid so items inside "View all" block are visible
      if (portfolioGrid && viewAllBtn && category !== 'all' && !portfolioGrid.classList.contains('portfolio-grid--expanded')) {
        portfolioGrid.classList.add('portfolio-grid--expanded');
        viewAllBtn.textContent = 'Show less';
      }

      portfolioItems.forEach(function (item) {
        var itemCat = item.getAttribute('data-category');
        var show = category === 'all' || itemCat === category;
        item.classList.toggle('hidden', !show);
      });
      var visibleCount = 0;
      portfolioItems.forEach(function (item) {
        if (!item.classList.contains('hidden')) visibleCount++;
      });
      var portfolioEmpty = document.getElementById('portfolioEmpty');
      if (portfolioEmpty) {
        if (visibleCount === 0) {
          portfolioEmpty.removeAttribute('hidden');
        } else {
          portfolioEmpty.setAttribute('hidden', '');
        }
      }
    });
  });

  // ----- Portfolio: View all / Show less -----
  var portfolioGrid = document.querySelector('.portfolio-grid');
  var portfolioMore = document.getElementById('portfolioMore');
  var viewAllBtn = document.getElementById('portfolioViewAllBtn');
  var viewAllWrap = document.getElementById('portfolioViewAllWrap');

  if (portfolioGrid && portfolioMore && viewAllBtn) {
    viewAllBtn.addEventListener('click', function () {
      var isExpanded = portfolioGrid.classList.toggle('portfolio-grid--expanded');
      viewAllBtn.textContent = isExpanded ? 'Show less' : 'View all';
    });
  }

  // ----- Contact form: submit via fetch, show success on site -----
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var submitBtn = form && form.querySelector('button[type="submit"]');

  if (form && formSuccess) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = form.getAttribute('action');
      if (!action || action.indexOf('formspree') === -1) return;

      var origText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      var body = new FormData(form);

      fetch(action, {
        method: 'POST',
        body: body,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            form.style.display = 'none';
            formSuccess.removeAttribute('hidden');
            formSuccess.classList.add('form-success--visible');
          } else {
            throw new Error('Send failed');
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
          }
          alert('Something went wrong. Please try again or email hello@soulcut.video');
        })
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
          }
        });
    });
  }

  // ----- Scroll reveal: sections get .is-visible when in viewport -----
  var revealSections = document.querySelectorAll('.section-reveal');
  if (revealSections.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0 }
    );
    revealSections.forEach(function (section) {
      revealObserver.observe(section);
    });
  }

  // ----- Back to top: show after scroll, click scrolls to hero -----
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    var onScrollBack = function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScrollBack, { passive: true });
    onScrollBack();
    backToTop.addEventListener('click', function () {
      var hero = document.getElementById('hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ----- Testimonial carousel: auto-advance, prev/next, mobile scroll, dots -----
  var testimonialCarousel = document.getElementById('testimonialCarousel');
  var testimonialTrack = document.getElementById('testimonialTrack');
  var testimonialPrev = document.getElementById('testimonialPrev');
  var testimonialNext = document.getElementById('testimonialNext');
  var testimonialDots = document.getElementById('testimonialDots');
  if (testimonialCarousel && testimonialTrack && testimonialPrev && testimonialNext) {
    var slides = testimonialTrack.querySelectorAll('.testimonial-slide');
    var total = slides.length;
    var testimonialIndex = 0;
    var testimonialAutoTimer = null;
    var testimonialAutoDelay = 10000;

    function testimonialIsMobile() {
      return window.matchMedia('(max-width: 768px)').matches;
    }

    function updateTestimonialDots() {
      if (!testimonialDots) return;
      var dots = testimonialDots.querySelectorAll('.testimonial-dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === testimonialIndex);
        dot.setAttribute('aria-selected', i === testimonialIndex);
      });
    }

    function goToTestimonial(i) {
      testimonialIndex = ((i % total) + total) % total;
      if (testimonialIsMobile()) {
        testimonialTrack.style.transform = '';
        var w = testimonialCarousel.offsetWidth;
        testimonialCarousel.scrollTo({ left: testimonialIndex * w, behavior: 'smooth' });
      } else {
        testimonialTrack.style.transform = 'translateX(-' + testimonialIndex * 25 + '%)';
      }
      updateTestimonialDots();
    }

    function startTestimonialAuto() {
      if (testimonialAutoTimer) clearInterval(testimonialAutoTimer);
      testimonialAutoTimer = setInterval(function () {
        goToTestimonial(testimonialIndex + 1);
      }, testimonialAutoDelay);
    }

    if (testimonialDots) {
      for (var d = 0; d < total; d++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'testimonial-dot' + (d === 0 ? ' active' : '');
        btn.setAttribute('aria-label', 'Testimonial ' + (d + 1));
        btn.setAttribute('aria-selected', d === 0);
        btn.setAttribute('role', 'tab');
        (function (idx) {
          btn.addEventListener('click', function () {
            goToTestimonial(idx);
            startTestimonialAuto();
          });
        })(d);
        testimonialDots.appendChild(btn);
      }
    }

    updateTestimonialDots();
    startTestimonialAuto();
    testimonialPrev.addEventListener('click', function () {
      goToTestimonial(testimonialIndex - 1);
      startTestimonialAuto();
    });
    testimonialNext.addEventListener('click', function () {
      goToTestimonial(testimonialIndex + 1);
      startTestimonialAuto();
    });

    testimonialCarousel.addEventListener('scroll', function () {
      if (!testimonialIsMobile()) return;
      var w = testimonialCarousel.offsetWidth;
      if (w <= 0) return;
      var newIndex = Math.round(testimonialCarousel.scrollLeft / w);
      if (newIndex !== testimonialIndex) {
        testimonialIndex = newIndex;
        if (testimonialIndex < 0) testimonialIndex = 0;
        if (testimonialIndex >= total) testimonialIndex = total - 1;
        updateTestimonialDots();
        startTestimonialAuto();
      }
    }, { passive: true });
  }
})();
