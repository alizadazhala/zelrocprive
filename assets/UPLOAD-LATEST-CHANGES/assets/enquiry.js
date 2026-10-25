/* Enquiries are submitted directly through FormSubmit; no credentials live in the browser. */
(function (root) {
  function buildEnquiryEmail(data, context = '') {
    const value = name => String(data.get(name) || '').trim();
    const type = value('nature') || 'Travel enquiry — help me explore';
    const adults = value('adults'), children = value('children');
    const total = adults ? Number(adults) + Number(children || 0) : null;
    const services = data.getAll('services').map(String).filter(Boolean);
    const subject = `${type} — ${value('name')}`;
    const body = [
      'Hello ZELRÔC PRIVÉ,', '', 'I would like your help with the following enquiry.', '',
      `Enquiry type: ${type}`,
      `Starting point / property of interest: ${context || 'Open to suggestions'}`,
      `Destination(s) / locations: ${value('destination') || 'Please help me choose'}`,
      `Dates / approximate timing: ${value('dates') || 'Not decided yet'}`,
      `Date flexibility: ${value('flexibility') || 'Not decided yet'}`, '',
      'OUR GROUP',
      `Adults: ${adults || 'To confirm'}`,
      `Children: ${children || (adults ? 'None indicated — to confirm' : 'To confirm')}`,
      `Children’s ages at travel: ${value('ages') || 'Not specified'}`,
      `Total travellers: ${total === null ? 'To confirm' : total + (children ? '' : ' adults; children to confirm')}`, '',
      'WHAT WE WOULD LIKE ARRANGED',
      ...(services.length ? services.map(service => `• ${service}`) : ['Please suggest a suitable plan.']), '',
      'WHAT WE WOULD LIKE YOU TO FIND OR PLAN',
      value('message') || 'We would welcome your recommendations.', '',
      `Cuisine / dining atmosphere: ${value('cuisines') || 'Open to suggestions'}`,
      `Accommodation preferences: ${value('stay') || 'Open to suggestions'}`,
      `Practical requirements: ${value('requirements') || 'Not specified'}`,
      `Occupation: ${value('occupation') || 'Not provided'}`,
      `Company: ${value('company') || 'Not applicable / not specified'}`, '',
      'Please share suitable options and the arrangements you can coordinate.', '',
      'Kind regards,', value('name'), `Reply email: ${value('email')}`,
    ].join('\n');
    return {subject, body, href: `mailto:info@zelrocprive.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`};
  }
  async function sendEnquiry(email, guest, fetcher = root.fetch.bind(root), signal) {
    const response = await fetcher('https://formsubmit.co/ajax/info@zelrocprive.com', {
      method: 'POST', headers: {'Content-Type':'application/json', 'Accept':'application/json'},
      body: JSON.stringify({name:guest.name, email:guest.email, _replyto:guest.email,
        _subject:'ZELRÔC PRIVÉ — '+email.subject, message:email.body, _template:'table'}), signal
    });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true') || /activat|confirm your email/i.test(result.message || '')) {
      throw new Error('Delivery was not confirmed.');
    }
    return result;
  }
  root.ZelrocEnquiry = {buildEnquiryEmail, sendEnquiry};
  if (typeof document === 'undefined') return;
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  if (location.hash === '#private-enquiry') {
    form.setAttribute('tabindex', '-1');
    requestAnimationFrame(() => {
      form.scrollIntoView({behavior: 'instant', block: 'start'});
      form.focus({preventScroll: true});
    });
  }
  const status = form.querySelector('[data-form-status]');
  const button = form.querySelector('[type="submit"]');
  let sending = false;
  const params = new URLSearchParams(location.search);
  const context = (params.get('context') || '').slice(0, 500);
  const requestedKind = params.get('kind');
  const kind = requestedKind === 'The Social Calendar' ? 'Events & Experiences' : requestedKind;
  const nature = form.elements.namedItem('nature');
  if (kind && [...nature.options].some(option => option.value === kind)) nature.value = kind;
  if (kind === 'Dining & Nightlife') { const dining = form.querySelector('input[name="services"][value="Dining reservations"]'); if (dining) dining.checked = true; }
  if (context) {
    const note = form.querySelector('[data-enquiry-context]');
    note.hidden = false; note.textContent = `Your starting point: ${context}`;
  }
  function invalidate() {
    if (sending) return;
    status.textContent = ''; button.disabled = false; button.textContent = 'Send Enquiry';
    form.querySelectorAll('[required]').forEach(field => field.setCustomValidity(''));
  }
  // Optional fields can still be invalid; reveal their section before native validation focuses them.
  form.addEventListener('invalid', event => {
    let section = event.target.closest('details');
    while (section) { section.open = true; section = section.parentElement.closest('details'); }
  }, true);
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || button.disabled) return;
    for (const field of form.querySelectorAll('[required]')) field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    // Honeypot is deliberately excluded from the message and service payload.
    if (data.get('_honey')) return;
    const email = buildEnquiryEmail(data, context);
    sending = true; button.disabled = true; button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    const fields = [...form.querySelectorAll('input,select,textarea,fieldset')].filter(field => !field.disabled);
    fields.forEach(field => field.disabled = true);
    status.textContent = 'Sending your enquiry…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      await sendEnquiry(email, {name:String(data.get('name')).trim(),email:String(data.get('email')).trim()}, root.fetch.bind(root), controller.signal);
      status.textContent = 'Thank you. Your enquiry has been submitted. We will reply personally to your email address.';
      button.textContent = 'Enquiry Submitted';
    } catch {
      status.textContent = 'We could not confirm delivery. Your details are still here. Please try again, or email info@zelrocprive.com directly.';
      button.disabled = false; button.textContent = 'Try Again';
    } finally {
      clearTimeout(timeout); sending = false; form.removeAttribute('aria-busy');
      fields.forEach(field => field.disabled = false);
    }
  });
})(typeof window === 'undefined' ? globalThis : window);
