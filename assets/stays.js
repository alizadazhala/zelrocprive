(() => {
 const form=document.querySelector('[data-stay-filters]');if(!form)return;
 const cards=[...document.querySelectorAll('[data-stay]')];
 function update(){const f=new FormData(form);let count=0;const need=f.get('need');for(const card of cards){const tags=card.dataset.tags.split(',');const winter=['courchevel','val-disere','st-moritz','gstaad','iceland','lapland','verbier','zermatt'].includes(card.dataset.destination);card.hidden=!!((need==='winter'&&!winter)||(need==='villas'&&!tags.includes('private villa')&&!tags.includes('groups'))||(need==='family'&&!tags.includes('family'))||(f.get('destination')&&card.dataset.destination!==f.get('destination'))||(f.get('style')&&!card.dataset.tags.split(',').includes(f.get('style'))));if(!card.hidden)count++;}document.querySelector('[data-stay-status]').textContent=`${count} ${count===1?'stay':'stays'} in this selection. Availability is confirmed for your dates.`;document.querySelector('[data-stay-empty]').hidden=!!count;}
 const initial=new URLSearchParams(location.search);for(const key of ['style','destination','need']){const value=initial.get(key);const select=form.elements.namedItem(key);if(value&&select&&[...select.options].some(o=>o.value===value))select.value=value;}
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('change',update);update();
})();
