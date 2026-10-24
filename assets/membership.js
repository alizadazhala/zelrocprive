/* A private email draft. No form details are sent or stored by this page. */
(function(root){
 function buildMembershipEmail(data){
  const v=n=>String(data.get(n)||'').trim();
  const level={circle:'ÉLITE Circle',prive:'ÉLITE Privé'}[v('level')]||'Please advise me';
  const subject='ZELRÔC ÉLITE — Private Membership Enquiry';
  const body=['Hello ZELRÔC PRIVÉ,','','I would like to begin a private membership conversation.','',`Name: ${v('name')}`,`Reply email: ${v('email')}`,`Membership interest: ${level}`,`Company: ${v('company')||'Not provided'}`,`Occupation: ${v('occupation')||'Not provided'}`,`LinkedIn: ${v('linkedin')||'Not provided'}`,`Instagram: ${v('instagram')||'Not provided'}`,'',v('introduction')||'Please help me explore the membership that would suit me.','','Kind regards,',v('name')].join('\n');
  return {subject,body,href:'mailto:info@zelrocprive.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)};
 }
 root.ZelrocMembership={buildMembershipEmail};if(typeof document==='undefined')return;
 const form=document.querySelector('[data-membership-form]');if(!form)return;
 const selected=new URLSearchParams(location.search).get('level');if(['circle','prive'].includes(selected))form.elements.level.value=selected;
 const status=form.querySelector('[data-membership-status]'),draft=form.querySelector('[data-membership-draft]'),fallback=form.querySelector('[data-membership-fallback]'),preview=form.querySelector('[data-membership-preview]'),copyStatus=form.querySelector('[data-membership-copy-status]');
 const clear=()=>{draft.hidden=true;draft.href='mailto:info@zelrocprive.com';fallback.hidden=true;preview.value='';status.textContent='';copyStatus.textContent='';form.querySelectorAll('input').forEach(x=>x.setCustomValidity(''));};
 form.addEventListener('input',clear);form.addEventListener('change',clear);
 form.addEventListener('submit',event=>{event.preventDefault();for(const field of form.querySelectorAll('[required]'))field.setCustomValidity(field.value.trim()?'':'Please complete this field.');for(const id of ['linkedin','instagram']){const field=form.elements[id];if(field.value.trim()){try{const url=new URL(field.value);field.setCustomValidity(url.protocol==='https:'?'':'Please use an https:// profile link.');}catch{field.setCustomValidity('Please use a full https:// profile link.');}}}if(!form.reportValidity())return;const email=buildMembershipEmail(new FormData(form));draft.href=email.href;draft.hidden=false;fallback.hidden=false;preview.value=`To: info@zelrocprive.com\nSubject: ${email.subject}\n\n${email.body}`;status.textContent='Your enquiry has not been sent yet. Review the draft in your email app and press Send there. You can also copy the email below.';draft.click();});
 form.querySelector('[data-membership-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(preview.value);copyStatus.textContent='Email text copied.';}catch{preview.focus();preview.select();copyStatus.textContent='Copy the selected text into your email service.';}});
 if(location.hash==='#membership-enquiry')requestAnimationFrame(()=>{form.scrollIntoView({behavior:'instant',block:'start'});form.focus({preventScroll:true});});
})(typeof window==='undefined'?globalThis:window);
