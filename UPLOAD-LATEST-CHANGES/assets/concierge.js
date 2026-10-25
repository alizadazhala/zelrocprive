/* A guided introduction, not an AI conversation. No message is sent by this widget. */
(() => {
 if (window.__zelrocConciergeInstalled || document.documentElement.classList.contains('enquiry-embedded')) return;
 const dialog=document.querySelector('[data-concierge]'), guide=window.ZelrocConciergeGuide;
 if(!dialog||!guide||typeof dialog.showModal!=='function')return;
 window.__zelrocConciergeInstalled=true;
 const body=dialog.querySelector('[data-concierge-body]'), invitation=document.querySelector('[data-concierge-invitation]');
 const back=dialog.querySelector('[data-concierge-back]'),restart=dialog.querySelector('[data-concierge-restart]');
 const initial=()=>({step:'welcome',theme:'',month:'',party:'',mood:'',idea:'',editedSummary:null});
 let state=initial(),history=[],opener,oldOverflow='',active=false;
 const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const button=(label,action,value='')=>`<button class="concierge__choice" type="button" data-concierge-action="${action}" data-value="${e(value)}">${e(label)}</button>`;
 const heading=text=>`<h2 id="concierge-title" tabindex="-1">${e(text)}</h2>`;
 const note=text=>`<p>${e(text)}</p>`;
 const list=items=>`<div class="concierge__choices">${items.join('')}</div>`;
 function summary(){
  if(state.editedSummary!==null)return state.editedSummary;
  const theme=guide.themes.find(([key])=>key===state.theme)?.[1];
  const cards=state.theme?guide.recommend(state).cards:[];
  return ['Hello ZELRÔC PRIVÉ,','',theme?'What appeals to me: '+theme:'I would like to speak to your team.',state.mood?'Atmosphere: '+state.mood:'',state.month?'Preferred month: '+guide.months[Number(state.month)-1]:'Timing: open to suggestions',state.party?'Travelling: '+state.party:'',cards.length?'Starting points: '+cards.map(c=>c.title).join(', '):'',state.idea?'My idea: '+state.idea:'','', 'Please help me explore suitable options.'].filter((line,i,all)=>line!==''||i===1||i===all.length-2).join('\n');
 }
 function go(step,changes={}){history.push(JSON.parse(JSON.stringify(state)));state={...state,...changes,step,editedSummary:null};render();}
 function render(){
  back.disabled=history.length===0;restart.disabled=state.step==='welcome'&&!state.idea;
  let html='';
  if(state.step==='welcome')html=heading('Welcome to ZELRÔC PRIVÉ. Where shall we begin?')+list([
   button('What can you arrange for me?','step','services'),button('Help me find my next escape','step','inspiration'),button('I have something in mind','step','idea'),button('Speak to our team','team')]);
  if(state.step==='services')html=heading('What can we arrange for you?')+note('From finding your next stay to shaping the details around it: journeys, private villas, business travel, dining, celebrations, and experiences.')+list(guide.services.map(([label,href])=>`<a class="concierge__choice" href="${e(href)}">${e(label)} <span aria-hidden="true">↗</span></a>`));
  if(state.step==='inspiration')html=heading('What are you drawn to?')+list(guide.themes.map(([key,label])=>button(label,'theme',key)));
  if(state.step==='mood')html=heading('What would you like more of?')+list(['Stillness','Culture & evenings out','Time together','A little adventure','Not sure yet','Skip'].map(label=>button(label,'mood',label)));
  if(state.step==='month')html=heading('When would you like to go?')+`<label class="concierge__label" for="concierge-month">Preferred month</label><select id="concierge-month" data-concierge-month><option value="">Choose a month</option>${guide.months.map((m,i)=>`<option value="${i+1}"${state.month===String(i+1)?' selected':''}>${m}</option>`).join('')}</select><button class="concierge__primary" type="button" data-concierge-action="month">Continue</button><p class="concierge__status" data-concierge-step-status role="status"></p>`+list([button('Not sure yet','month','unsure'),button('Skip','month','skip')]);
  if(state.step==='party')html=heading('Who will be travelling?')+list(['Just me','Two of us','Family','Friends','A group','Not sure yet','Skip'].map(label=>button(label,'party',label)));
  if(state.step==='results'){
   const result=guide.recommend(state);
   html=heading('A few possibilities, just for a beginning.')+note(result.note)+`<div class="concierge__recommendations">${result.cards.map(card=>`<article><h3>${e(card.title)}</h3><p>${e(card.why)}</p><a href="${e(card.href)}">Explore ${e(card.title)} <span aria-hidden="true">↗</span></a></article>`).join('')}</div>`+button('Add an idea or preference','step','idea');
  }
  if(state.step==='idea')html=heading('Tell us what you have in mind. An idea is enough.')+note('Your words become a request you can review before contacting our team.')+`<label class="concierge__label" for="concierge-idea">Your idea <span>(optional)</span></label><textarea id="concierge-idea" data-concierge-idea rows="4" maxlength="2000" placeholder="A few days in the sun, a villa for friends, or a special evening…">${e(state.idea)}</textarea><button class="concierge__primary" type="button" data-concierge-action="review">Review my request</button>`;
  if(state.step==='review')html=heading('Your request, in your words.')+note('Edit anything you wish. Opening chat does not send a message.')+`<label class="concierge__label" for="concierge-summary">Your request</label><textarea id="concierge-summary" data-concierge-summary rows="7" maxlength="3500">${e(summary())}</textarea><button type="button" class="concierge__choice" data-concierge-copy>Copy my request</button><p class="concierge__status" data-concierge-copy-status role="status" aria-live="polite"></p><a class="concierge__primary" data-crisp-open data-crisp-draft href="https://go.crisp.chat/chat/embed/?website_id=61ecae3f-f1da-4bb8-b57f-42809a607fed">Open chat with our team <span aria-hidden="true">↗</span></a><p class="concierge__small">With on-page chat, we try to place your request in a draft for you to review. If the separate chat page opens, copy your request first and paste it there.</p><p class="concierge__status" data-concierge-handoff-status role="status" aria-live="polite"></p>`;
  body.innerHTML=html;body.scrollTop=0;body.querySelector('h2')?.focus({preventScroll:true});
 }
 function dismissInvitation(){if(invitation)invitation.hidden=true;try{sessionStorage.setItem('zelroc-concierge-invitation','dismissed');}catch{}}
 function open(control){
  if(active)return;
  document.dispatchEvent(new Event('zelroc:close-menu'));
  dismissInvitation();opener=control||document.querySelector('[data-concierge-open]');oldOverflow=document.body.style.overflow;
  dialog.showModal();active=true;document.documentElement.classList.add('concierge-active');document.body.style.overflow='hidden';render();
 }
 function cleanup(restoreFocus=true){
  if(!active)return;active=false;document.documentElement.classList.remove('concierge-active');document.body.style.overflow=oldOverflow;
  if(restoreFocus)opener?.focus({preventScroll:true});
 }
 function close(restoreFocus=true){cleanup(restoreFocus);if(dialog.open)dialog.close();}
 // Native dialog Escape and explicit close share the same cleanup path.
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 dialog.addEventListener('close',()=>{if(!dialog.open)cleanup();});
 document.addEventListener('zelroc:concierge-close',()=>close(false));
 dialog.querySelector('[data-concierge-close]').addEventListener('click',()=>close());
 invitation?.querySelector('[data-concierge-dismiss]').addEventListener('click',dismissInvitation);
 back.addEventListener('click',()=>{if(history.length){state=history.pop();render();}});
 restart.addEventListener('click',()=>{state=initial();history=[];render();});
 function review(){if(state.step==='review'){body.querySelector('textarea')?.focus();return;}go('review');}
 dialog.querySelector('[data-concierge-team]').addEventListener('click',review);
 body.addEventListener('input',event=>{if(event.target.matches('[data-concierge-idea]'))state.idea=event.target.value;if(event.target.matches('[data-concierge-summary]'))state.editedSummary=event.target.value;});
 body.addEventListener('click',async event=>{
  const control=event.target.closest('button[data-concierge-action]');
  if(control){
   const {conciergeAction:action,value}=control.dataset;
   if(action==='step')go(value);
   if(action==='team'||action==='review')review();
   if(action==='theme')go(value==='surprise'?'mood':'month',{theme:value,mood:'',month:'',party:''});
   if(action==='mood')go('month',{mood:['Skip','Not sure yet'].includes(value)?'':value});
   if(action==='month'){
    const month=['unsure','skip'].includes(value)?'':body.querySelector('[data-concierge-month]').value;
    if(!month&&!value){body.querySelector('[data-concierge-step-status]').textContent='Choose a month, or select Not sure yet or Skip.';return;}
    go('party',{month});
   }
   if(action==='party')go('results',{party:['Skip','Not sure yet'].includes(value)?'':value});
  }
  if(event.target.closest('[data-concierge-copy]')){
   const field=body.querySelector('[data-concierge-summary]'),status=body.querySelector('[data-concierge-copy-status]');
   try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(field.value);status.textContent='Copied. You can paste your request into chat.';}
   catch{field.focus();field.select();status.textContent='Your request is selected. Use Copy on your device, then paste it into chat.';}
  }
 });
 // Capture launcher clicks before the shared Crisp handler. Without JS, its href still opens chat.
 document.addEventListener('click',event=>{
  const launcher=event.target.closest?.('[data-concierge-open]');
  if(launcher&&!event.defaultPrevented&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();open(launcher);return;}
  if(active&&event.target.closest?.('[data-concierge] a[href]'))close(false);
 },true);
 // A small invitation, once per tab session; never an automatic window or timed interruption.
 try{if(invitation&&!sessionStorage.getItem('zelroc-concierge-invitation')){invitation.hidden=false;sessionStorage.setItem('zelroc-concierge-invitation','seen');}}catch{if(invitation)invitation.hidden=false;}
 const dock=document.querySelector('.contact-dock');
 const measureDock=()=>{if(dock)document.documentElement.style.setProperty('--contact-dock-height',`${dock.getBoundingClientRect().height}px`);};
 if(dock&&typeof ResizeObserver==='function')new ResizeObserver(measureDock).observe(dock);measureDock();
})();
