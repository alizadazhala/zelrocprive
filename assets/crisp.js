/* One shared installation; chat opens only after a visitor's explicit click. */
(() => {
  if (new URLSearchParams(location.search).get('embed') === '1' && window.parent !== window) return;
  if (window.__zelrocCrispInstalled) return;
  window.__zelrocCrispInstalled = true;
  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = '61ecae3f-f1da-4bb8-b57f-42809a607fed';
  const direct = 'https://go.crisp.chat/chat/embed/?website_id=61ecae3f-f1da-4bb8-b57f-42809a607fed';
  let failed = false, returnFocus, waitTimer;
  const queue = command => window.$crisp.push(command);
  const markOpen = () => {
    clearTimeout(waitTimer);
    document.dispatchEvent(new Event('zelroc:concierge-close'));
    document.documentElement.classList.add('crisp-chat-open');
  };
  queue(['do', 'chat:hide']);
  queue(['config', 'sound:mute', [true]]);
  // Accept messages on every device, regardless of the account's current presence.
  // Actual online status is configured in Crisp Account > Availability.
  queue(['config', 'hide:on:away', [false]]);
  queue(['config', 'hide:on:mobile', [false]]);
  queue(['config', 'hide:vacation', [false]]);
  queue(['config', 'availability:tooltip', [false]]);
  queue(['config', 'color:theme', ['blue_grey']]);
  queue(['config', 'container:index', [70]]);
  queue(['on', 'chat:opened', markOpen]);
  queue(['on', 'chat:closed', () => {
    clearTimeout(waitTimer);
    document.documentElement.classList.remove('crisp-chat-open');
    queue(['do', 'chat:hide']);
    const focusTarget = returnFocus?.checkVisibility?.() === false ? document.querySelector('[data-concierge-open]') : returnFocus;
    focusTarget?.focus();
  }]);
  // Delegation also covers dynamically inserted controls, without duplicate handlers.
  document.addEventListener('click', event => {
    const control = event.target.closest?.('[data-crisp-open]');
    if (!control || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    document.dispatchEvent(new Event('zelroc:close-menu'));
    // Preserve the ordinary link when blocked, still loading, or JavaScript is unavailable.
    if (failed || typeof window.$crisp.is !== 'function') return;
    try {
      returnFocus = control;
      if (control.hasAttribute?.('data-crisp-draft')) {
        const draft = control.__zelrocEnquiryDraft || document.querySelector('[data-concierge-summary]')?.value.trim();
        const feedback = document.querySelector('[data-concierge-handoff-status]');
        let confirmed = false;
        try {
          if (draft && typeof window.$crisp.get === 'function') {
            const existing = window.$crisp.get('message:text') || '';
            const desired = existing.includes(draft) ? existing : existing ? existing + '\n\n' + draft : draft;
            queue(['set', 'message:text', [desired]]);
            confirmed = window.$crisp.get('message:text') === desired;
          }
        } catch (_) { /* Copy my request remains available; never claim an unverified transfer. */ }
        if (feedback) feedback.textContent = confirmed ? 'Your request is in the chat draft. Review it and press Send when you are ready.' : 'Use Copy my request if your words are not in the chat draft.';
      }
      queue(['do', 'chat:show']);
      queue(['do', 'chat:open']);
      if (window.$crisp.is('chat:opened')) markOpen();
      event.preventDefault();
      clearTimeout(waitTimer);
      if (!document.documentElement.classList.contains('crisp-chat-open')) {
        waitTimer = setTimeout(() => {
          // A partially loaded SDK must not leave a visitor waiting indefinitely.
          window.location.assign(direct);
        }, 4000);
      }
    } catch (_) {
      failed = true; // Let this same click follow its working href.
    }
  });
  if (!document.querySelector('script[src="https://client.crisp.chat/l.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    script.id = 'zelroc-crisp-client';
    script.onerror = () => { failed = true; };
    document.head.appendChild(script);
  }
})();
