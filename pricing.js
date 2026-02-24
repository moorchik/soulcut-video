(function () {
  'use strict';

  var tabs = document.querySelectorAll('.pricing-tab');
  var panels = document.querySelectorAll('.pricing-panel');
  var liveAnnounce = document.querySelector('.pricing-live-announce');

  var packageLabels = {
    teaser: { name: 'Teaser', price: 'from $100' },
    highlight: { name: 'Highlight', price: 'from $250' },
    film: { name: 'Full Film', price: 'from $300' },
    highlight-film: { name: 'Highlight + Full Film', price: 'from $400' },
    'highlight-film-teaser': { name: 'Highlight + Film + Teaser', price: 'from $450' },
    custom: { name: 'Custom', price: 'Contact us' }
  };

  function setActiveTab(activeBtn) {
    var pkg = activeBtn.getAttribute('data-package');
    tabs.forEach(function (btn) {
      btn.classList.toggle('active', btn === activeBtn);
      btn.setAttribute('aria-selected', btn === activeBtn ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      var id = panel.id;
      var isMatch = id === 'panel-' + pkg;
      panel.classList.toggle('is-visible', isMatch);
      panel.hidden = !isMatch;
    });
    if (liveAnnounce && packageLabels[pkg]) {
      liveAnnounce.textContent = packageLabels[pkg].name + ' package, ' + packageLabels[pkg].price;
    }
  }

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActiveTab(btn);
    });
  });

  // Keyboard: arrow keys and Enter/Space (role=tab)
  var tabList = document.querySelector('.pricing-tabs');
  if (tabList) {
    tabList.addEventListener('keydown', function (e) {
      var idx = Array.prototype.indexOf.call(tabs, document.activeElement);
      if (idx === -1) return;
      var next = idx;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        next = (idx + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        next = (idx - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        next = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        next = tabs.length - 1;
      }
      if (next !== idx) {
        tabs[next].focus();
        setActiveTab(tabs[next]);
      }
    });
  }
})();
