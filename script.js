/* ============================================
   SID'S HVAC — Website Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- NAVBAR SCROLL + MOBILE CTA ----------
  const navbar = document.getElementById('navbar');
  const mobileCta = document.getElementById('mobileCta');
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Mobile CTA bar — show after scrolling past hero, hide when scrolling up near top
    if (mobileCta) {
      if (scrollY > window.innerHeight * 0.5) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- MOBILE MENU ----------
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- HERO PARTICLES ----------
  const particleContainer = document.getElementById('particles');
  const isMobile = window.innerWidth < 768;

  function createParticles() {
    // Fewer particles on mobile for performance
    const count = isMobile ? 12 : 40;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = (Math.random() * 3 + 1) + 'px';
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particleContainer.appendChild(particle);
    }
  }

  // Only create particles if not a low-power preference
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    createParticles();
  }

  // ---------- COUNTER ANIMATION ----------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function animateCounters() {
    statNumbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      function update() {
        current += increment;
        if (current < target) {
          num.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(update);
        } else {
          num.textContent = target.toLocaleString();
        }
      }

      update();
    });
  }

  // ---------- SCROLL ANIMATIONS ----------
  const animatedElements = document.querySelectorAll(
    '.service-card, .process-step, .testimonial-card, .about-feature'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));

  // Counter observer
  const statsSection = document.querySelector('.hero-stats');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ---------- CONTACT FORM (Web3Forms) ----------
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="spinner">
        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
      </svg>
      Sending...
    `;
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const jsonData = {};
      formData.forEach((value, key) => { jsonData[key] = value; });

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(jsonData)
      });

      const data = await response.json();

      if (data.success) {
        form.style.display = 'none';
        formSuccess.classList.add('active');
        form.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      alert('Something went wrong. Please call us at (555) 123-4567 or try again.');
      console.error('Form error:', error);
    }
  });

  // ---------- ADD SPINNER ANIMATION ----------
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spinner {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(style);

  // ---------- ACTIVE NAV LINK ON SCROLL ----------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.nav-links a').forEach(a => a.style.opacity = '0.7');
          link.style.opacity = '1';
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

});
