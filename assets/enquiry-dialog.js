/* One enquiry journey, opened only when a visitor chooses an enquiry link. */
(()=>{
 const dialog=document.querySelector('[data-enquiry-dialog]'),frame=dialog?.querySelector('[data-enquiry-frame]'),close=dialog?.querySelector('[data-enquiry-close]');
 if(!dialog||!frame||!close||typeof dialog.showModal!=='function'||document.documentElement.classList.contains('enquiry-embedded'))return;
 let opener,oldOverflow='';
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.documentElement.classList.remove('enquiry-active');document.body.style.overflow=oldOverflow;frame.removeAttribute('src');opener?.focus({preventScroll:true});});
 frame.addEventListener('load',()=>{try{frame.contentDocument.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();dialog.close();}});frame.contentDocument.querySelector('form')?.focus({preventScroll:true});}catch{/* The fallback link remains usable. */}});
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||!url.pathname.endsWith('/contact.html'))return;
  if(location.pathname.endsWith('/contact.html'))return;
  event.preventDefault();opener=link.closest("[data-mobile-panel]")?document.querySelector("[data-menu-toggle]"):link.closest("[data-concierge]")?document.querySelector("[data-concierge-open]"):link;url.searchParams.set('embed','1');url.hash='private-enquiry';
  window.$crisp?.push(['do','chat:hide']);document.documentElement.classList.remove('crisp-chat-open');
  document.dispatchEvent(new Event('zelroc:concierge-close'));
  oldOverflow=document.body.style.overflow;frame.src=url.href;dialog.showModal();document.documentElement.classList.add('enquiry-active');document.body.style.overflow='hidden';close.focus();
 });
})();
