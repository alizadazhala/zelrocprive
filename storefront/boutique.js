// A pre-order request is prepared locally and sent by the guest's email app.
// No payment is taken and no order is confirmed by this static website.
for (const product of document.querySelectorAll('[data-product]')) {
 const link=product.querySelector('[data-preorder-link]');
 const summary=product.querySelector('[data-selection-summary]');
 const quantity=product.querySelector('[data-preorder-quantity]');
 function update(){
  const value=product.querySelector('[data-option="Gift value"] input:checked');
  if(value)product.querySelectorAll('[data-product-price]').forEach(n=>n.textContent=value.value);
  const selection=[...product.querySelectorAll('fieldset[data-option]')].map(group=>`${group.dataset.option}: ${group.querySelector('input:checked')?.value||'please choose'}`);
  const title=product.querySelector('h1').textContent;
  const price=product.querySelector('[data-product-price]').textContent;
  summary.textContent=selection.join(' · ')+` · Quantity: ${quantity.value}`;
  const body=[`Hello ZELRÔC PRIVÉ,`,``,`I would like to request a pre-order.`,`Design: ${title}`,`Price per item: ${price}`,...selection,`Quantity: ${quantity.value}`,``,`My name: `,`Delivery country: `,`Any notes: `,``,`Please confirm availability, production timing, delivery charges and payment arrangements before placing my order.`].join('\n');
  link.href='mailto:info@zelrocprive.com?subject='+encodeURIComponent('Pre-order — '+title)+'&body='+encodeURIComponent(body);
 }
 product.querySelectorAll('input').forEach(input=>input.addEventListener('input',update));
 link.addEventListener('click',event=>{
  const size=product.querySelector('[data-option="Size"]');
  if(size&&!size.querySelector('input:checked')){event.preventDefault();summary.textContent='Please choose your size before requesting a pre-order.';size.querySelector('input').focus();return;}
  if(!quantity.reportValidity()){event.preventDefault();return;}
  update();
 });
 update();
}
