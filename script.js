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

  function isDropboxUrl(src) {
    return src && src.indexOf('dropbox.com') !== -1;
  }

  function getGoogleDriveEmbedUrl(src) {
    if (!src || src.indexOf('drive.google.com') === -1) return null;
    var match = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? 'https://drive.google.com/file/d/' + match[1] + '/preview' : null;
  }

  function openModal(src) {
    if (!modal || !modalPlayer) return;
    var driveEmbed = getGoogleDriveEmbedUrl(src);
    if (driveEmbed) {
      if (modalVideo) {
        modalVideo.style.display = 'none';
        modalVideo.removeAttribute('src');
      }
      if (modalIframe) {
        modalIframe.src = driveEmbed;
        modalIframe.style.display = 'block';
      }
    } else if (isDropboxUrl(src)) {
      if (modalVideo) {
        modalVideo.style.display = 'none';
        modalVideo.removeAttribute('src');
      }
      if (modalIframe) {
        var viewUrl = src.replace('?dl=1', '').replace('?dl=0', '') || src;
        if (viewUrl.indexOf('?') === -1) viewUrl += '?dl=0';
        modalIframe.src = viewUrl;
        modalIframe.style.display = 'block';
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

      portfolioItems.forEach(function (item) {
        var itemCat = item.getAttribute('data-category');
        var show = category === 'all' || itemCat === category;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  // ----- Contact form: basic submit handling -----
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Replace with your form backend or mailto
      var name = form.querySelector('#name').value;
      var email = form.querySelector('#email').value;
      var message = form.querySelector('#message').value;
      var mailto = 'mailto:hello@soulcut.video?subject=Quote request from ' + encodeURIComponent(name) + '&body=' + encodeURIComponent(message + '\n\n---\nReply to: ' + email);
      window.location.href = mailto;
    });
  }
})();
