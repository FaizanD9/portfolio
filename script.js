/* script.js — Comportement interactif du portfolio */

// IIFE pour isoler le scope
(function(){
  'use strict';

  // Small helpers
  function qs(sel, ctx){ return (ctx||document).querySelector(sel) }
  function qsa(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)) }

  // Navigation toggle for mobile
  var navToggle = qs('#nav-toggle');
  var navLinks = qs('#nav-links');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', function(){
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      if(!expanded){
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.gap = '12px';
      } else {
        navLinks.style.display = '';
      }
    });
  }

  // Smooth scroll for internal links
  qsa('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        var target = document.querySelector(href);
        if(target){
          target.scrollIntoView({behavior:'smooth', block:'start'});
          // close mobile nav after click
          if(window.innerWidth <= 900 && navLinks){
            navLinks.style.display = '';
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });

  // Populate current year in footer
  var yearEl = qs('#currentYear');
  if(yearEl) yearEl.textContent = (new Date()).getFullYear();

  // Keyboard accessible overlays for projects: show overlay on focus
  qsa('.project-card').forEach(function(card){
    card.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        // toggle a focused class
        card.classList.toggle('project-active');
      }
    });
  });

  // Basic image fallback handler (if image missing, replace by placeholder)
  qsa('img').forEach(function(img){
    img.addEventListener('error', function(){
      var placeholder = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="%23f3efe6"/><text x="50%" y="50%" font-size="20" text-anchor="middle" fill="%23999" dy=".3em">Image manquante — placez vos images dans /images</text></svg>'
      );
      if(this.src !== placeholder) this.src = placeholder;
    });
  });

  // Accessibility: focus visible ring if keyboard navigation detected
  function handleFirstTab(e){
    if(e.key === 'Tab'){
      document.documentElement.classList.add('show-focus-outlines');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);

  // Tiny analytics placeholder (local only) — count project hovers/clicks in session
  var analytics = { projectHovers: {}, projectClicks: {} };
  qsa('.project-card').forEach(function(card, idx){
    var key = 'project-'+(idx+1);
    analytics.projectHovers[key] = 0;
    analytics.projectClicks[key] = 0;

    card.addEventListener('mouseenter', function(){ analytics.projectHovers[key] += 1 });
    card.addEventListener('click', function(){ analytics.projectClicks[key] += 1 });
  });

  // Expose a debug method for dev (only in dev builds — safe to keep)
  window.__portfolioDebug = function(){
    return Object.assign({}, analytics);
  };

  // Ensure tab order and skip link by creating a skip-to-main button if not present
  if(!qs('#skip-link')){
    var skip = document.createElement('a');
    skip.id = 'skip-link';
    skip.href = '#presentation';
    skip.className = 'sr-only';
    skip.textContent = 'Aller au contenu principal';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  // Defensive: ensure downloadable CV link exists — create placeholder file link when missing
  qsa('a[download]').forEach(function(a){
    var href = a.getAttribute('href') || '';
    if(!href || href.trim() === ''){
      a.setAttribute('href', 'cv.pdf');
    }
  });

  // Minor performance: lazy load larger images when in viewport (IntersectionObserver fallback)
  if('IntersectionObserver' in window){
    var lazyImgs = qsa('img[loading="lazy"]');
    var io = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var img = en.target;
          // if data-src pattern used, swap here (we're just demonstrating)
          obs.unobserve(img);
        }
      });
    },{rootMargin:'200px'});
    lazyImgs.forEach(function(img){ io.observe(img) });
  }

  // Small enhancement: show a toast when CV is downloaded (friendly)
  qsa('a[download]').forEach(function(a){
    a.addEventListener('click', function(){
      showToast('Téléchargement du CV démarré');
    });
  });

  // Simple toast implementation
  function showToast(text){
    var t = document.createElement('div');
    t.className = 'site-toast';
    t.textContent = text;
    Object.assign(t.style,{position:'fixed',right:'20px',bottom:'20px',background:'rgba(11,61,145,0.95)',color:'white',padding:'12px 18px',borderRadius:'8px',boxShadow:'0 8px 30px rgba(0,0,0,0.2)',zIndex:9999});
    document.body.appendChild(t);
    setTimeout(function(){ t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; },2000);
    setTimeout(function(){ document.body.removeChild(t) },3000);
  }

  // End of script
})();

/* End of script.js */