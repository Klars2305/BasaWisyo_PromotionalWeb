// ==========================================================================
// BasaWisyo Promotional Concept Application Script
// Verified vanilla JavaScript with Hakbang-calibrated motion engineering
// ==========================================================================

// Official team inquiry email for educator and stakeholder contact
const TEAM_EMAIL = 'rayonjustin187@gmail.com';

// --------------------------------------------------------------------------
// Accessibility & Reduced Motion Configuration
// --------------------------------------------------------------------------
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (reducedMotion.matches) {
  document.documentElement.classList.add('reduced-motion');
}
reducedMotion.addEventListener('change', (e) => {
  document.documentElement.classList.toggle('reduced-motion', e.matches);
});

// --------------------------------------------------------------------------
// Navigation & Mobile Menu Management
// --------------------------------------------------------------------------
const menuButton = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-links');
const nav = document.querySelector('.nav');
const headerEl = document.querySelector('.site-header');

function setMenu(open) {
  if (!menu || !menuButton) return;
  menu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('click', (event) => {
    if (nav && !nav.contains(event.target)) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  window.matchMedia('(min-width: 769px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}

// --------------------------------------------------------------------------
// Smart Sticky Navigation (Hakbang 3-State Motion Architecture)
// --------------------------------------------------------------------------
let lastScrollY = window.scrollY;

function updateNavbarMotion() {
  const currentScrollY = window.scrollY;
  const scrollDelta = currentScrollY - lastScrollY;

  // 1. Depth state (.nav-scrolled: compact padding, deeper elevation shadow)
  if (currentScrollY > 60) {
    nav?.classList.add('nav-scrolled');
  } else {
    nav?.classList.remove('nav-scrolled');
  }

  // 2. Directional auto-hide (.nav-hidden: slide up on scroll down, slide down on scroll up)
  if (currentScrollY > 120 && scrollDelta > 6 && !menu?.classList.contains('open')) {
    headerEl?.classList.add('nav-hidden');
  } else if (scrollDelta < -6 || currentScrollY <= 80) {
    headerEl?.classList.remove('nav-hidden');
  }

  lastScrollY = currentScrollY;
}

// Reveal navbar when cursor hovers near top viewport boundary
window.addEventListener('mousemove', (e) => {
  if (e.clientY <= 60 && headerEl?.classList.contains('nav-hidden')) {
    headerEl.classList.remove('nav-hidden');
  }
}, { passive: true });

// --------------------------------------------------------------------------
// Active Section Scroll Tracking (Scroll-Spy)
// --------------------------------------------------------------------------
const navLinks = menu ? [...menu.querySelectorAll('a[href^="#"]')] : [];
const observedSectionIds = ['hero', 'about', 'why', 'features', 'basamesh', 'product', 'audience', 'contact'];
const observedSections = observedSectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navSectionMap = {
  why: 'about',
  basamesh: 'features',
  audience: 'product'
};

function updateActiveNav() {
  if (!observedSections.length || !navLinks.length) return;
  const threshold = window.innerHeight * 0.35;
  let currentId = 'hero';

  for (const section of observedSections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= threshold && rect.bottom > 0) {
      currentId = section.id;
    }
  }

  const activeTarget = navSectionMap[currentId] || currentId;

  navLinks.forEach((link) => {
    if (link.classList.contains('nav-cta')) return;
    const href = link.getAttribute('href');
    if (href === `#${activeTarget}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Unified 60fps Scroll Throttle via requestAnimationFrame
let scrollScheduled = false;
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(() => {
    updateNavbarMotion();
    updateActiveNav();
    scrollScheduled = false;
  });
}, { passive: true });

window.addEventListener('resize', () => {
  updateNavbarMotion();
  updateActiveNav();
});

updateNavbarMotion();
updateActiveNav();

// --------------------------------------------------------------------------
// Smooth Anchor Scrolling with Floating Header Offset
// --------------------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });

      setMenu(false);

      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

// --------------------------------------------------------------------------
// Progressive Scroll Reveal System (Single Unified IntersectionObserver)
// --------------------------------------------------------------------------
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('revealed');
  });
}

// --------------------------------------------------------------------------
// Four-Screen Product Prototype Showcase (Smooth Eased Transitions)
// --------------------------------------------------------------------------
const screens = [
  {
    title: 'Placement Assessment',
    image: 'assets/c65299b50564.svg',
    alt: 'Phil-IRI-inspired baseline placement test prototype screen',
    description: 'A Phil-IRI-inspired baseline assessment helps identify a learner’s starting level without anxiety.'
  },
  {
    title: 'Reading Practice',
    image: 'assets/86d2775c81b2.svg',
    alt: 'Leveled English and Filipino reading practice prototype screen',
    description: 'Bilingual passages with guided comprehension checks foster steady reading growth.'
  },
  {
    title: 'Bayanihan Quest',
    image: 'assets/5a67a505d171.svg',
    alt: 'Bayanihan cooperative class quest prototype screen',
    description: 'Cooperative reading missions encourage peers to work toward shared classroom literacy goals.'
  },
  {
    title: 'Teacher Dashboard',
    image: 'assets/cb47434a097e.svg',
    alt: 'Teacher diagnostic and skill monitoring prototype screen',
    description: 'A proposed overview of reading levels and skill needs empowers educators to plan targeted guidance.'
  }
];

const screenButtons = [...document.querySelectorAll('.screen-option')];
const productImage = document.getElementById('product-image');
const screenLabel = document.getElementById('screen-label');
const screenCount = document.getElementById('screen-count');
const screenDescription = document.getElementById('screen-description');
const prototypeStatus = document.getElementById('prototype-status');
const previousButton = document.getElementById('prototype-prev');
const nextButton = document.getElementById('prototype-next');
let selectedScreenIndex = 0;
let isTransitioning = false;

function selectScreen(index) {
  if (isTransitioning) return;
  selectedScreenIndex = Math.max(0, Math.min(screens.length - 1, index));
  const screen = screens[selectedScreenIndex];
  const numberStr = String(selectedScreenIndex + 1).padStart(2, '0');

  screenButtons.forEach((button, idx) => {
    button.setAttribute('aria-pressed', String(idx === selectedScreenIndex));
  });

  if (previousButton) previousButton.disabled = selectedScreenIndex === 0;
  if (nextButton) nextButton.disabled = selectedScreenIndex === screens.length - 1;

  if (productImage) {
    if (reducedMotion.matches) {
      productImage.src = screen.image;
      productImage.alt = screen.alt;
      if (screenLabel) screenLabel.textContent = `${numberStr} / ${screen.title}`;
      if (screenCount) screenCount.textContent = `${numberStr} / 04`;
      if (screenDescription) screenDescription.textContent = screen.description;
      if (prototypeStatus) prototypeStatus.textContent = `Screen ${selectedScreenIndex + 1} of 4: ${screen.title}`;
    } else {
      isTransitioning = true;
      productImage.style.opacity = '0';
      productImage.style.transform = 'translateY(8px) scale(0.98)';
      productImage.style.transition = 'opacity 0.16s ease, transform 0.16s ease';

      setTimeout(() => {
        productImage.src = screen.image;
        productImage.alt = screen.alt;
        if (screenLabel) screenLabel.textContent = `${numberStr} / ${screen.title}`;
        if (screenCount) screenCount.textContent = `${numberStr} / 04`;
        if (screenDescription) screenDescription.textContent = screen.description;
        if (prototypeStatus) prototypeStatus.textContent = `Screen ${selectedScreenIndex + 1} of 4: ${screen.title}`;

        productImage.style.opacity = '1';
        productImage.style.transform = 'translateY(0) scale(1)';
        productImage.style.transition = 'opacity 0.26s cubic-bezier(0.16, 1, 0.3, 1), transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)';

        setTimeout(() => {
          isTransitioning = false;
        }, 260);
      }, 160);
    }
  }
}

screenButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectScreen(index));
});

if (previousButton) {
  previousButton.addEventListener('click', () => selectScreen(selectedScreenIndex - 1));
}

if (nextButton) {
  nextButton.addEventListener('click', () => selectScreen(selectedScreenIndex + 1));
}

// --------------------------------------------------------------------------
// Accessible Prototype Preview Dialog Modal
// --------------------------------------------------------------------------
const previewDialog = document.getElementById('preview-dialog');
const dialogImage = document.getElementById('dialog-image');
const dialogTitle = document.getElementById('dialog-title');
const openImageLink = document.getElementById('open-image');
const openPreviewBtn = document.getElementById('open-preview');
const closePreviewBtn = document.getElementById('close-preview');
let dialogOpenerElement = null;

if (openPreviewBtn && previewDialog) {
  openPreviewBtn.addEventListener('click', () => {
    const screen = screens[selectedScreenIndex];
    dialogOpenerElement = document.activeElement;

    if (dialogImage) {
      dialogImage.src = screen.image;
      dialogImage.alt = screen.alt;
    }
    if (dialogTitle) dialogTitle.textContent = screen.title;
    if (openImageLink) openImageLink.href = screen.image;

    if (typeof previewDialog.showModal === 'function') {
      previewDialog.showModal();
    } else {
      previewDialog.setAttribute('open', '');
    }

    if (closePreviewBtn) closePreviewBtn.focus();
  });
}

function closePreviewModal() {
  if (!previewDialog) return;
  if (typeof previewDialog.close === 'function') {
    previewDialog.close();
  } else {
    previewDialog.removeAttribute('open');
  }
}

if (closePreviewBtn) {
  closePreviewBtn.addEventListener('click', closePreviewModal);
}

if (previewDialog) {
  previewDialog.addEventListener('click', (event) => {
    const rect = previewDialog.getBoundingClientRect();
    const isInside = (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
    if (!isInside) closePreviewModal();
  });

  previewDialog.addEventListener('close', () => {
    if (dialogOpenerElement && typeof dialogOpenerElement.focus === 'function') {
      dialogOpenerElement.focus();
    }
  });

  previewDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && typeof previewDialog.close !== 'function') {
      closePreviewModal();
    }
  });
}

// --------------------------------------------------------------------------
// Contact Form & Honest State Verification
// --------------------------------------------------------------------------
const inquiryForm = document.getElementById('inquiry-form');
const formFeedback = document.getElementById('form-feedback');
const formNote = document.getElementById('form-note');
const contactChannel = document.getElementById('contact-channel');

if (TEAM_EMAIL && formNote) {
  const noteSpan = formNote.querySelector('span');
  if (noteSpan) {
    noteSpan.textContent = `Submitting opens a pre-filled draft to ${TEAM_EMAIL}. Press Send in your email client to deliver it.`;
  } else {
    formNote.innerHTML = `
      <svg class="disclaimer-icon"><use href="#icon-info"/></svg>
      <span>Submitting opens a pre-filled draft to ${TEAM_EMAIL}. Press Send in your email client to deliver it.</span>
    `;
  }
}

if (inquiryForm && formFeedback) {
  function showFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback is-visible ${type}`;
  }

  function clearFeedback() {
    formFeedback.textContent = '';
    formFeedback.className = 'form-feedback';
  }

  inquiryForm.addEventListener('input', clearFeedback);

  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameField = inquiryForm.elements['name'];
    const emailField = inquiryForm.elements['email'];
    const roleField = inquiryForm.elements['role'];
    const messageField = inquiryForm.elements['message'];

    if (!nameField.value.trim() || !emailField.value.trim() || !roleField.value || !messageField.value.trim()) {
      showFeedback('Please fill out all required fields before submitting.', 'error');
      const firstInvalid = [nameField, emailField, roleField, messageField].find((el) => !el.value.trim());
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailField.value.trim())) {
      showFeedback('Please enter a valid email address (e.g. name@school.edu.ph).', 'error');
      emailField.focus();
      return;
    }

    const data = new FormData(inquiryForm);

    if (!TEAM_EMAIL) {
      showFeedback('Preview only — Your inquiry was not sent. An official team email address has not been configured yet.', 'info');
      return;
    }

    const subject = encodeURIComponent(`BasaWisyo Inquiry from ${data.get('name')}`);
    const bodyContent = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Role: ${data.get('role')}`,
      `School/Organization: ${data.get('organization') || 'Not provided'}`,
      '',
      `Message:`,
      `${data.get('message')}`
    ].join('\n');

    const body = encodeURIComponent(bodyContent);
    showFeedback(`An email draft to ${TEAM_EMAIL} is opening. Your inquiry will be sent once you click Send in your email client.`, 'info');
    window.location.href = `mailto:${TEAM_EMAIL}?subject=${subject}&body=${body}`;
  });
}
