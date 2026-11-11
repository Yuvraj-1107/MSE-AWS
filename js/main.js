
document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      menuButton.textContent = '☰';
    };
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      menuButton.textContent = isOpen ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 680) closeMenu();
    });
  }

  // Home page hero slider
  const slides = [...document.querySelectorAll('.hero-slide')];
  let slideIndex = 0;
  function showSlide(next) {
    if (!slides.length) return;
    slideIndex = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle('active', index === slideIndex));
    const counter = document.querySelector('.image-caption > span:first-child');
    if (counter) counter.textContent = `0${slideIndex + 1} / 0${slides.length}`;
  }
  document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => {
    showSlide(slideIndex + (button.dataset.slide === 'next' ? 1 : -1));
  }));

  // Destination search/filter
  const search = document.getElementById('destination-search');
  if (search) {
    const cards = [...document.querySelectorAll('.place-card')];
    const count = document.getElementById('destination-count');
    const empty = document.getElementById('empty-destinations');
    search.addEventListener('input', () => {
      const term = search.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const match = (card.dataset.search + ' ' + card.textContent).toLowerCase().includes(term);
        card.hidden = !match;
        if (match) visible++;
      });
      count.textContent = `${visible} ${visible === 1 ? 'place' : 'places'} to explore`;
      empty.hidden = visible !== 0;
    });
  }

  // Package cost calculator
  const packageSelect = document.getElementById('calc-package');
  const peopleInput = document.getElementById('calc-people');
  const nightsInput = document.getElementById('calc-nights');
  const totalOutput = document.getElementById('estimate-total');
  function updateEstimate() {
    if (!packageSelect || !peopleInput || !nightsInput || !totalOutput) return;
    const rate = Number(packageSelect.value);
    const people = Math.min(20, Math.max(1, Number(peopleInput.value) || 1));
    const nights = Math.min(30, Math.max(1, Number(nightsInput.value) || 1));
    totalOutput.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rate * people * nights);
  }
  [packageSelect, peopleInput, nightsInput].forEach(el => el && el.addEventListener('input', updateEstimate));

  // Testimonials carousel
  const testimonials = [
    { quote: '“Everything felt considered, but never over-planned. We had the best kind of freedom.”', name: 'Ananya Mehta', trip: 'Himachal Pradesh · October 2026' },
    { quote: '“The local recommendations made the trip. It felt like discovering a place with a friend.”', name: 'Rohan Kapoor', trip: 'Kerala · September 2026' },
    { quote: '“A lovely balance of planning and spontaneity. We came home already thinking about the next trip.”', name: 'Mira & Arjun', trip: 'Goa · August 2026' }
  ];
  let quoteIndex = 0;
  document.querySelectorAll('[data-quote]').forEach(button => button.addEventListener('click', () => {
    quoteIndex = (quoteIndex + (button.dataset.quote === 'next' ? 1 : -1) + testimonials.length) % testimonials.length;
    const q = testimonials[quoteIndex];
    document.getElementById('quote-text').textContent = q.quote;
    document.getElementById('quote-name').textContent = q.name;
    document.getElementById('quote-trip').textContent = q.trip;
  }));

  // Booking form validation (front-end demo only)
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    const dateField = document.getElementById('travel-date');
    if (dateField) dateField.min = new Date().toISOString().split('T')[0];
    bookingForm.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.getElementById('full-name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const destination = document.getElementById('destination').value;
      const date = dateField.value;
      const travellers = Number(document.getElementById('travellers').value);
      const error = document.getElementById('booking-error');
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !email || !phone || !destination || !date) error.textContent = 'Please complete all required fields.';
      else if (!validEmail) error.textContent = 'Please enter a valid email address.';
      else if (!/^\d{10}$/.test(phone)) error.textContent = 'Enter a valid 10-digit phone number.';
      else if (new Date(date + 'T00:00:00') < new Date(new Date().toDateString())) error.textContent = 'Please choose a future date.';
      else if (!Number.isInteger(travellers) || travellers < 1 || travellers > 20) error.textContent = 'Travellers must be between 1 and 20.';
      else {
        error.textContent = '';
        document.getElementById('booking-success').hidden = false;
        bookingForm.reset();
        dateField.min = new Date().toISOString().split('T')[0];
      }
    });
  }

  // Contact form validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const error = document.getElementById('contact-error');
    if (!name || !email || !message) error.textContent = 'Please fill in all fields.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) error.textContent = 'Please enter a valid email address.';
    else {
      error.textContent = '';
      document.getElementById('contact-success').hidden = false;
      contactForm.reset();
    }
  });
});
