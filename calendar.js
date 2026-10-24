// London calendar dates prevent a visitor's timezone from archiving an evening early.
export function calendarToday(now = new Date()) {
 const parts = new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get = type => parts.find(p => p.type === type).value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
export function isPast(event,today) {
 return event.end < today;
}
export function matchesEvent(event, filters, today) {
 if (filters.destination && event.destination !== filters.destination) return false;
 if (filters.interest && event.interest !== filters.interest) return false;
 if (filters.month) {
   const dates=event.dates || [];
   if (dates.length) return dates.some(date=> date >= today && date.startsWith(filters.month));
   const start=event.start.slice(0,7), end=event.end.slice(0,7);
   if(filters.month < start || filters.month > end) return false;
 }
 return true;
}
if (typeof document !== 'undefined') {
 const form=document.querySelector('[data-calendar-filters]');
 if(form) {
 const cards=[...document.querySelectorAll('[data-event]')];
 const upcoming=document.querySelector('[data-upcoming-events]');
 const archive=document.querySelector('[data-archived-events]');
 const data=card=>({...card.dataset,dates:JSON.parse(card.dataset.dates)});
 function update() {
  const today=calendarToday();
  const filters=Object.fromEntries(new FormData(form));
  let count=0,past=0;
  for(const card of cards) {
   const event=data(card);
   if(isPast(event,today)) {
    archive.append(card);card.hidden=false;past++;
    card.querySelector('.event-links .button')?.remove();
    continue;
   }
   upcoming.append(card);
   card.hidden=!matchesEvent(event,filters,today);
   if(!card.hidden) count++;
  }
  document.querySelector('[data-event-archive]').hidden=!past;
  document.querySelector('[data-calendar-empty]').hidden=!!count;
  document.querySelector('[data-calendar-status]').textContent=`${count} upcoming ${count===1?'occasion':'occasions'}${past?` · ${past} archived`:''}. Availability is confirmed personally.`;
 }
 form.addEventListener('submit',event=>event.preventDefault());
 form.addEventListener('change',update);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden) update();});
 update();
 setInterval(update, 60000);
 }
}

// A destination's upcoming list must expire even between static rebuilds.
if (typeof document !== 'undefined') {
 const destinationEvents=[...document.querySelectorAll('[data-destination-event]')];
 if(destinationEvents.length) {
  const expireDestinationEvents=()=>{
   const today=calendarToday();
   destinationEvents.forEach(row=>{row.hidden=isPast(row.dataset,today);});
   const note=document.querySelector('[data-destination-events-status]');
   if(note)note.hidden=destinationEvents.some(row=>!row.hidden);
  };
  expireDestinationEvents();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)expireDestinationEvents();});
  setInterval(expireDestinationEvents,60000);
 }
}
