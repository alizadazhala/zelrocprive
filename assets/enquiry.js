/* Structured email only: no personal information is saved or submitted by this site. */
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
      `Accommodation preferences: ${value('stay') || 'Open to suggestions'}`,
      `Practical requirements: ${value('requirements') || 'Not specified'}`,
      `Occupation: ${value('occupation') || 'Not provided'}`,
      `Company: ${value('company') || 'Not applicable / not specified'}`, '',
      'Please share suitable options and the arrangements you can coordinate.', '',
      'Kind regards,', value('name'), `Reply email: ${value('email')}`,
    ].join('\n');
    return {subject, body, href: `mailto:info@zelrocprive.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`};
  }
  root.ZelrocEnquiry = {buildEnquiryEmail};
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
  const draft = form.querySelector('[data-email-draft]');
  const fallback = form.querySelector('[data-email-fallback]');
  const preview = form.querySelector('[data-email-preview]');
  const copyStatus = form.querySelector('[data-copy-status]');
  const params = new URLSearchParams(location.search);
  const context = (params.get('context') || '').slice(0, 500);
  const requestedKind = params.get('kind');
  const kind = requestedKind === 'The Social Calendar' ? 'Events & Experiences' : requestedKind;
  const nature = form.elements.namedItem('nature');
  if (kind && [...nature.options].some(option => option.value === kind)) nature.value = kind;
  if (context) {
    const note = form.querySelector('[data-enquiry-context]');
    note.hidden = false; note.textContent = `Your starting point: ${context}`;
  }
  function invalidate() {
    draft.hidden = true; draft.href = 'mailto:info@zelrocprive.com';
    status.textContent = ''; fallback.hidden = true; preview.value = ''; copyStatus.textContent = '';
    form.querySelectorAll('[required]').forEach(field => field.setCustomValidity(''));
  }
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const field of form.querySelectorAll('[required]')) field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
    if (!form.reportValidity()) return;
    const email = buildEnquiryEmail(new FormData(form), context);
    draft.href = email.href; draft.hidden = false; fallback.hidden = false;
    preview.value = `To: info@zelrocprive.com\nSubject: ${email.subject}\n\n${email.body}`;
    status.textContent = 'Your enquiry has not been sent yet. Your email app will open with the details filled in. Review your message and press Send there. If it does not open, use the link or copy the email below.';
    // Open the real mailto link in the same user gesture; no second preparation step.
    draft.click();
  });
  form.querySelector('[data-copy-enquiry]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preview.value);
      copyStatus.textContent = 'Email text copied. Paste it into your email service and send it to info@zelrocprive.com.';
    } catch {
      preview.focus(); preview.select();
      copyStatus.textContent = 'The email text is selected. Copy it, then paste it into your email service.';
    }
  });
})(typeof window === 'undefined' ? globalThis : window);
