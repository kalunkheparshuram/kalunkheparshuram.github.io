/* ===================== main.js ===================== */
(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile nav
  const toggle = document.getElementById('nav-toggle');
  const list = document.getElementById('nav-list');
  toggle.addEventListener('click', () => list.classList.toggle('open'));
  list.querySelectorAll('a').forEach(a => a.addEventListener('click', () => list.classList.remove('open')));

  // hero typing
  const roles = [
    "Cyber Security Researcher.",
    "Bug Bounty Hunter.",
    "Security Freelancer."
  ];
  const typedEl = document.getElementById('typed');
  let ri = 0;
  function typeRole() {
    const role = roles[ri];
    let c = 0;
    const t = setInterval(() => {
      typedEl.textContent = role.slice(0, c);
      c++;
      if (c > role.length) {
        clearInterval(t);
        setTimeout(() => { ri = (ri + 1) % roles.length; typeRole(); }, 1300);
      }
    }, 42);
  }
  typeRole();

  // scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

 // contact form — validated, silent AJAX submit to FormSubmit (no redirect, no reload)
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/parshuramkalunkhe@proton.me";
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('c-submit');
  const nameField = document.getElementById('c-name');
  const emailField = document.getElementById('c-email');
  const msgField = document.getElementById('c-msg');
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const htmlRegex = /<[^>]*>/;
  const jsRegex = /javascript:/i;

  function setError(id, msg){
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.toggle('show', !!msg);
  }
  function clearErrors(){
    document.querySelectorAll('.form-min .err').forEach(e=>{ e.textContent=''; e.classList.remove('show'); });
  }
  let toastTimer;
  function showToast(msg, type){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'show ' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> t.classList.remove('show'), 4000);
  }

  clearErrors();

  form.addEventListener('submit', async function(e){
    e.preventDefault(); // always — we submit via fetch, never a real page navigation

    clearErrors();

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = msgField.value.trim();
    let valid = true;

    if(name.length < 2){ setError('e-name', 'Enter your name.'); valid = false; }
    else if(name.length > 60){ setError('e-name', 'Name is too long.'); valid = false; }
    else if(htmlRegex.test(name)){ setError('e-name', 'HTML is not allowed.'); valid = false; }

    if(!emailRegex.test(email) || jsRegex.test(email)){ setError('e-email', 'Enter a valid email.'); valid = false; }

    if(message.length < 10){ setError('e-msg', 'Message is too short (min 10 characters).'); valid = false; }
    else if(message.length > 2000){ setError('e-msg', 'Message is too long.'); valid = false; }
    else if(htmlRegex.test(message) || jsRegex.test(message)){ setError('e-msg', 'That content isn\'t allowed.'); valid = false; }

    if(!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try{
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form) // stays on this page — FormSubmit's /ajax/ endpoint returns JSON instead of redirecting
      });
      if(!res.ok) throw new Error('Request failed: ' + res.status);
      await res.json();

      showToast("✓ Message sent — thanks, I'll get back to you soon.", 'success');
      form.reset(); // clears fields immediately so nothing lingers, and a later page refresh can't resubmit them
    } catch(err){
      showToast('Something went wrong sending that. Try again, or email me directly.', 'fail');
    } finally{
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message →';
    }
  });
})();