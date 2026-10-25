/* Curated site content, not AI. This pure selection layer can be replaced independently later. */
((root) => {
 const options = {
  courchevel:['Courchevel','atlas-courchevel.html','Slope-side mornings, chalet time and an unhurried mountain lunch.'],
  lapland:['Finnish Lapland','atlas-lapland.html','Forest lodges, a sauna and time together beyond the usual ski holiday. Snow activities follow the season.'],
  iceland:['Iceland','atlas-iceland.html','Geothermal bathing, dramatic landscapes and a different pace. Routes follow daylight and local conditions.'],
  gstaad:['Gstaad','atlas-gstaad.html','An Alpine hotel or chalet, mountain scenery and room for quieter days.'],
  dubai:['Dubai','atlas-dubai.html','Beach time with city dining; October to April is the gentler season for days outdoors.'],
  maldives:['The Maldives','atlas-maldives.html','Beach or overwater villas and time by the sea. January to March is the main dry season; December and April are transition months.'],
  cape:['Cape Town','atlas-cape-town.html','Harbour walks, dining and mountain scenery during the southern summer. Wind and sea temperatures shape beach plans.'],
  riviera:['The French Riviera','atlas-french-riviera.html','A coastal base, long lunches and days by driver or on the water, with villas for time together.'],
  turkiye:['Türkiye','atlas-turkiye.html','Compare Belek, Kemer and Bodrum for a resort or villa stay, with Istanbul as a separate city chapter.'],
  mykonos:['Mykonos','atlas-mykonos.html','A villa for friends, shared meals and time on the water during the island’s summer season.'],
  london:['London','atlas-london.html','Park-side mornings, galleries and a West End evening, with a stay chosen around your neighbourhood.'],
  paris:['Paris','atlas-paris.html','A museum morning, an unhurried lunch and the pleasure of exploring one neighbourhood at a time.'],
  tokyo:['Tokyo','atlas-tokyo.html','Food, craft and city views, with a base that makes your preferred neighbourhoods feel close.'],
  villas:['Private villas & group stays','private-villas.html','Room for everyone, a chef if you wish, and the details of a shared stay personally coordinated.'],
  calendar:['The Social Calendar','social-calendar.html','Explore the current selection of cultural, sporting and dining occasions, then shape a journey around one.'],
  como:['Lake Como','atlas-lake-como.html','Arrive for a remarkable dinner or a cultural evening, then leave a few days for the lake itself. Hotel opening calendars shape the stay.'],
  moritz:['St. Moritz','atlas-st-moritz.html','Mountain days and a winter occasion can become one journey; explore the calendar for the current sporting programme.'],
 };
 const services = [
  ['Holidays & hotel stays','hotels.html'],
  ['Private villas & personal chefs','private-villas.html'],
  ['Business travel','business-travel.html'],
  ['Dining, events & special occasions','dining.html'],
  ['Gifts & thoughtful surprises','dining.html#thoughtful-gestures'],
  ['Drivers & transport','services.html#journey-coordination'],
  ['Something else','contact.html#private-enquiry'],
 ];
 const themes = [
  ['winter','A winter escape — slopes, chalets & fireside evenings'],
  ['sun','Summer in the middle of winter — sunshine & time by the sea'],
  ['city','A city worth discovering — culture, dining & a change of scene'],
  ['together','Everyone together — villas for family & friends'],
  ['occasion','A reason to travel — an event or special occasion'],
  ['surprise','Surprise me — help me narrow it down'],
 ];
 const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
 function recommend({theme='surprise',month='',party='',mood=''}={}) {
  const m=Number(month), known=m>=1&&m<=12;
  const northernSummer=m>=5&&m<=9;
  let keys, note='A few starting points. Our team can share a wider selection around your preferences.';
  if(theme==='sun') {
   if(known&&northernSummer){keys=['riviera','turkiye','mykonos'];note='For this month, begin with the European summer coast. These are seasonal stays, rather than year-round winter-sun promises.';}
   else if(m===11||m===10){keys=['dubai','cape'];note='Dubai moves into its outdoor season; Cape Town is in spring, approaching summer. We would discuss the precise beach plans around your dates.';}
   else {keys=['dubai','maldives','cape'];if(m===4)keys=['dubai','maldives'];if(!known)note='For winter sunshine, these are starting points for October–April, depending on the destination. Tell us your month when you are ready.';}
  } else if(theme==='winter') {
   if(known&&m>=5&&m<=10){keys=['iceland','gstaad'];note='For this month, think geothermal bathing or an Alpine stay beyond the slopes. If skiing is the priority, our team can help choose winter dates.';}
   else if(m===11){keys=['iceland','lapland'];note='For early winter, begin with a landscape-led stay. Snow activities and ski opening dates need a closer look around your chosen week.';}
   else {keys=party==='Family'?['lapland','courchevel','iceland']:['courchevel','gstaad','lapland'];if(m===4)note='For April, late-season mountain plans follow the resort and activity calendars.';}
  } else if(theme==='city')keys=['london','paris','tokyo'];
  else if(theme==='together')keys=known&&(m>=10||m<=4)?['villas','dubai','maldives']:['villas','riviera','turkiye'];
  else if(theme==='occasion')keys=(m===1||m===2)?['calendar','moritz','london']:(m===11||m===12)?['calendar','como','london']:['calendar','london','paris'];
  else if(mood==='Culture & evenings out')keys=['paris','tokyo','london'];
  else if(mood==='Time together')keys=['villas','riviera','turkiye'];
  else if(mood==='A little adventure')keys=known&&m>=5&&m<=10?['iceland','gstaad']:['iceland','lapland','gstaad'];
  else keys=['iceland','paris','villas'];
  // A generic winter-sun group shortlist needs the same seasonal care as the sun branch.
  if(theme==='together'&&(m===10||m===11))keys=['villas','dubai','cape'];
  return {note,cards:keys.map(key=>({key,title:options[key][0],href:options[key][1],why:key==='cape'&&(m===10||m===11)?'Springtime harbour walks, dining and mountain scenery, with summer approaching. Choose this for exploration as well as time by the coast.':key==='cape'&&m===3?'Harbour walks, dining and mountain scenery as the summer crowds ease. Leave beach and mountain plans flexible for the weather.':options[key][2]}))};
 }
 root.ZelrocConciergeGuide={services,themes,months,recommend};
})(typeof window==='undefined'?globalThis:window);
