// Sending remains unavailable until the owner supplies an activated public endpoint.
// Never publish the recipient address in the site source.
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', event => event.preventDefault());
})();
