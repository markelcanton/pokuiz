// Load 0.2s fade:
window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Debug url path: - Not necessary for GitHub
/*(function () {
  if (window.location.pathname.endsWith('.html')) {
    const cleanPath = window.location.pathname.replace(/\.html$/, '');
    window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
  }

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      
      if (anchor && anchor.getAttribute('href')) {
        const href = anchor.getAttribute('href').trim();
        
        const isExternal = href.startsWith('http') || href.startsWith('//');
        const isAnchor = href.startsWith('#');
        const isHome = href === './' || href === '/' || href === 'index.html' || href === '';

        if (!isExternal && !isAnchor && !isHome && !href.endsWith('.html')) {
          e.preventDefault();
          
          const cleanHref = href.endsWith('/') ? href.slice(0, -1) : href;
          window.location.href = cleanHref + '.html';
        }
      }
    });
  }
})();*/