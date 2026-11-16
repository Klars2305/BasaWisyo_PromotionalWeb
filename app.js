// ==========================================================================
// BASAWISYO PROMOTIONAL APPLICATION SCRIPT (app.js)
// --------------------------------------------------------------------------
// Core client-side script powering interactive features, accessibility,
// scroll-spy navigation, animated prototype previews, and dialog modals.
// Written in modern vanilla JavaScript (ES6+) without external dependencies.
// ==========================================================================

// --------------------------------------------------------------------------
// SECTION 0: GLOBAL CONFIGURATION & CONSTANTS
// --------------------------------------------------------------------------
// Official team inquiry email address for educator and stakeholder contact.
// Can be referenced across different modules or contact fallbacks.
const TEAM_EMAIL = 'rayonjustin187@gmail.com';

// --------------------------------------------------------------------------
// SECTION 1: ACCESSIBILITY & REDUCED MOTION CONFIGURATION
// --------------------------------------------------------------------------
// Purpose: Honors the user's operating system preferences for reduced motion
// (e.g., users with vestibular disorders or motion sensitivities).
// When enabled in Windows/macOS/iOS/Android, animations and transitions are
// simplified or instant to prevent disorientation and nausea.

// Match the CSS media query for reduced motion preference
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// If user already has reduced motion enabled on page load, add class to <html>
if (reducedMotion.matches) {
  document.documentElement.classList.add('reduced-motion');
}

// Dynamically listen for live changes if the user toggles the setting in their OS
reducedMotion.addEventListener('change', (e) => {
  document.documentElement.classList.toggle('reduced-motion', e.matches);
});

// --------------------------------------------------------------------------
// SECTION 2: NAVIGATION & MOBILE DRAWER MENU MANAGEMENT
// --------------------------------------------------------------------------
// Purpose: Controls the responsive hamburger menu for mobile/tablet screens.
// Manages open/close states, ARIA accessibility attributes, and prevents
// background body scrolling when the mobile navigation menu is active.

// DOM element references for navigation controls
const menuButton = document.getElementById('menu-toggle'); // Hamburger button
const menu = document.getElementById('nav-links');          // Drawer container
const nav = document.querySelector('.nav');                 // Navigation bar
const headerEl = document.querySelector('.site-header');     // Floating header wrapper

/**
 * Toggles the mobile navigation drawer open or closed.
 * Updates DOM classes, ARIA states, and locks/unlocks page scrolling.
 * @param {boolean} open - True to open the drawer, False to close it.
 */
function setMenu(open) {
  if (!menu || !menuButton) return;
  
  // Toggle the CSS class that slides/fades the drawer into view
  menu.classList.toggle('open', open);
  
  // Update accessibility attributes for screen readers:
  // - aria-expanded: announces whether the menu is currently expanded
  // - aria-label: clarifies button action depending on current state
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  
  // Prevent background page from scrolling while mobile drawer is open (scroll-lock)
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Bind mobile menu event handlers if elements exist on the page
if (menuButton && menu) {
  // 1. Click on hamburger button: Toggle between open and closed
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  // 2. Click on any nav link: Automatically close menu and jump to section
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  // 3. Click outside navigation: Close menu if user clicks backdrop/outside
  document.addEventListener('click', (event) => {
    if (nav && !nav.contains(event.target)) setMenu(false);
  });

  // 4. Keyboard Accessibility (WCAG): Close menu when pressing Escape key
  // and return keyboard focus to the menu toggle button
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  // 5. Responsive viewport check: If user resizes browser window to desktop width (>768px),
  // automatically close mobile menu so it does not stay open unexpectedly
  window.matchMedia('(min-width: 769px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}

// --------------------------------------------------------------------------
// SECTION 3: SMART STICKY NAVIGATION (3-STATE MOTION ARCHITECTURE)
// --------------------------------------------------------------------------
// Purpose: Implements an intelligent header navigation bar that:
// 1. Adds elevation shadow & compact padding when scrolling past top (Depth state).
// 2. Auto-hides on downward scroll to maximize screen reading area.
// 3. Instantly reveals on upward scroll so user can easily navigate.
// 4. Reveals if mouse cursor moves near top boundary of the viewport.

// Keeps track of previous vertical scroll position to detect scroll direction
let lastScrollY = window.scrollY;

/**
 * Calculates scroll direction and scroll position to update header classes.
 */
function updateNavbarMotion() {
  const currentScrollY = window.scrollY;
  const scrollDelta = currentScrollY - lastScrollY; // Positive = scrolling down; Negative = scrolling up

  // STATE 1: Depth styling (.nav-scrolled)
  // If user scrolled down more than 60px from the very top, add compact style and shadow
  if (currentScrollY > 60) {
    nav?.classList.add('nav-scrolled');
  } else {
    nav?.classList.remove('nav-scrolled');
  }

  // STATE 2: Directional Auto-Hide (.nav-hidden)
  // - If scrolling down by >6px AND past 120px AND mobile menu is not open: hide header
  // - If scrolling up by >6px OR scrolled back near top (<=80px): reveal header
  if (currentScrollY > 120 && scrollDelta > 6 && !menu?.classList.contains('open')) {
    headerEl?.classList.add('nav-hidden');
  } else if (scrollDelta < -6 || currentScrollY <= 80) {
    headerEl?.classList.remove('nav-hidden');
  }

  // Update previous scroll position for next frame calculation
  lastScrollY = currentScrollY;
}

// Desktop UX Enhancement: Reveal hidden header if cursor hovers within 60px of screen top
window.addEventListener('mousemove', (e) => {
  if (e.clientY <= 60 && headerEl?.classList.contains('nav-hidden')) {
    headerEl.classList.remove('nav-hidden');
  }
}, { passive: true });

// --------------------------------------------------------------------------
// SECTION 4: ACTIVE SECTION SCROLL TRACKING (SCROLL-SPY)
// --------------------------------------------------------------------------
// Purpose: Automatically highlights the active link in the navigation bar
// as the user scrolls through different sections on the page.

// Collect all navigation anchor links that point to internal IDs (href="#...")
const navLinks = menu ? [...menu.querySelectorAll('a[href^="#"]')] : [];

// List of section IDs to track on the page in vertical order
const observedSectionIds = ['hero', 'about', 'why', 'features', 'basamesh', 'product', 'audience', 'contact'];

// Query each section element and filter out any IDs that might not exist in the DOM
const observedSections = observedSectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

// Section alias mapping: maps child/secondary sections back to their parent nav item
// Example: scrolling through 'why' highlights 'About Us' in the main menu
const navSectionMap = {
  why: 'about',
  basamesh: 'features',
  audience: 'product'
};

/**
 * Detects which section is currently in the primary reading zone of the viewport
 * and updates the aria-current="location" attribute on the corresponding nav link.
 */
function updateActiveNav() {
  if (!observedSections.length || !navLinks.length) return;
  
  // Set threshold at 35% from the top of the viewport (natural eye reading line)
  const threshold = window.innerHeight * 0.35;
  let currentId = 'hero';

  // Check section bounding rectangles relative to the threshold
  for (const section of observedSections) {
    const rect = section.getBoundingClientRect();
    // Section is active if its top has reached or passed the threshold and bottom is still visible
    if (rect.top <= threshold && rect.bottom > 0) {
      currentId = section.id;
    }
  }

  // Resolve mapped parent if current section is a sub-section
  const activeTarget = navSectionMap[currentId] || currentId;

  // Update nav links: set aria-current="location" on active link, remove from others
  navLinks.forEach((link) => {
    if (link.classList.contains('nav-cta')) return; // Skip call-to-action button
    const href = link.getAttribute('href');
    if (href === `#${activeTarget}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// --------------------------------------------------------------------------
// SECTION 5: UNIFIED 60FPS SCROLL THROTTLE (requestAnimationFrame)
// --------------------------------------------------------------------------
// Purpose: High-performance scroll listener. Prevents scroll lag and stuttering
// by syncing DOM calculations with the browser's hardware refresh cycle (~60-120fps).
let scrollScheduled = false;

window.addEventListener('scroll', () => {
  // If a render frame is already queued, ignore redundant scroll events
  if (scrollScheduled) return;
  scrollScheduled = true;
  
  // Schedule execution on the next browser animation frame
  requestAnimationFrame(() => {
    updateNavbarMotion(); // Update header visibility & depth
    updateActiveNav();     // Update active nav link highlight
    scrollScheduled = false; // Reset lock for next frame
  });
}, { passive: true }); // passive: true improves scrolling performance on mobile touch

// Also update calculations when window is resized
window.addEventListener('resize', () => {
  updateNavbarMotion();
  updateActiveNav();
});

// Run once immediately on initial script execution to set initial page states
updateNavbarMotion();
updateActiveNav();

// --------------------------------------------------------------------------
// SECTION 6: SMOOTH ANCHOR SCROLLING WITH FLOATING HEADER OFFSET
// --------------------------------------------------------------------------
// Purpose: Intercepts clicks on internal hash links (#...) to provide smooth
// scrolling that accounts for the fixed sticky header height (~90px),
// preventing section titles from being obscured underneath the navbar.

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault(); // Suppress default browser instant jump
      
      const headerOffset = 90; // Height of fixed floating header + breathing room
      const elementPosition = target.getBoundingClientRect().top;
      // Calculate target vertical position relative to entire document
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Scroll smoothly to calculated position (instant if reduced motion is preferred)
      window.scrollTo({
        top: offsetPosition,
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });

      // If mobile menu was open, close it
      setMenu(false);

      // Accessibility: Set focus to destination section for keyboard/screen reader users
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

// --------------------------------------------------------------------------
// SECTION 7: PROGRESSIVE SCROLL REVEAL SYSTEM (IntersectionObserver)
// --------------------------------------------------------------------------
// Purpose: Elements with class '.reveal' gracefully animate (fade and slide in)
// as they enter the visible viewport.
// Uses the modern browser IntersectionObserver API for zero scroll overhead.

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // When at least 10% of the element enters the viewport with a -50px bottom margin
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed'); // Triggers CSS transition
        observer.unobserve(entry.target);        // Stop observing once animated (performance optimization)
      }
    });
  }, {
    root: null,                          // Uses browser viewport as bounding box
    rootMargin: '0px 0px -50px 0px',     // Trigger 50px before bottom edge for smoother reveal
    threshold: 0.1                       // 10% visibility required to trigger
  });

  // Attach observer to all elements marked with '.reveal'
  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });
} else {
  // Fallback: If reduced motion is requested or browser lacks IntersectionObserver,
  // reveal all elements immediately without scroll animation
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('revealed');
  });
}

// --------------------------------------------------------------------------
// SECTION 8: FOUR-SCREEN PRODUCT PROTOTYPE SHOWCASE
// --------------------------------------------------------------------------
// Purpose: Interactive UI component in the "Product" section. Allows users
// to cycle through 4 prototype screens (Placement Assessment, Reading Practice,
// Bayanihan Quest, Teacher Dashboard) with smooth crossfade and scale transitions.

// Data dictionary defining each prototype screen's content and metadata
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

// Prototype showcase DOM elements
const screenButtons = [...document.querySelectorAll('.screen-option')]; // 01, 02, 03, 04 tabs
const productImage = document.getElementById('product-image');           // Preview <img> element
const screenLabel = document.getElementById('screen-label');             // Title badge
const screenCount = document.getElementById('screen-count');             // Counter (e.g. 01 / 04)
const screenDescription = document.getElementById('screen-description'); // Explanatory paragraph
const prototypeStatus = document.getElementById('prototype-status');     // Screen-reader status live region
const previousButton = document.getElementById('prototype-prev');         // Left arrow button
const nextButton = document.getElementById('prototype-next');             // Right arrow button

let selectedScreenIndex = 0; // Currently active screen index (0 to 3)
let isTransitioning = false;  // Debounce flag to prevent animation collisions if clicked rapidly

/**
 * Transitions the prototype preview card to display the specified screen index.
 * Handles boundary clamping, ARIA pressed states, and animation timing.
 * @param {number} index - Desired screen index (0 to 3)
 */
function selectScreen(index) {
  // If an animation is already in progress, ignore incoming clicks to prevent visual glitches
  if (isTransitioning) return;
  
  // Clamp index within valid range [0, screens.length - 1]
  selectedScreenIndex = Math.max(0, Math.min(screens.length - 1, index));
  const screen = screens[selectedScreenIndex];
  const numberStr = String(selectedScreenIndex + 1).padStart(2, '0'); // Formats '1' to '01'

  // Update ARIA pressed state on selector buttons
  screenButtons.forEach((button, idx) => {
    button.setAttribute('aria-pressed', String(idx === selectedScreenIndex));
  });

  // Enable/disable navigation buttons at boundaries (disable Prev at 0, Next at 3)
  if (previousButton) previousButton.disabled = selectedScreenIndex === 0;
  if (nextButton) nextButton.disabled = selectedScreenIndex === screens.length - 1;

  if (productImage) {
    if (reducedMotion.matches) {
      // Instant switch without animation if reduced motion is enabled
      productImage.src = screen.image;
      productImage.alt = screen.alt;
      if (screenLabel) screenLabel.textContent = `${numberStr} / ${screen.title}`;
      if (screenCount) screenCount.textContent = `${numberStr} / 04`;
      if (screenDescription) screenDescription.textContent = screen.description;
      if (prototypeStatus) prototypeStatus.textContent = `Screen ${selectedScreenIndex + 1} of 4: ${screen.title}`;
    } else {
      isTransitioning = true; // Lock transitions
      
      // Phase 1: Fade out image with slight downward shift
      productImage.style.opacity = '0';
      productImage.style.transform = 'translateY(8px) scale(0.98)';
      productImage.style.transition = 'opacity 0.16s ease, transform 0.16s ease';

      // Phase 2: After fade-out (160ms), swap data and fade back in
      setTimeout(() => {
        productImage.src = screen.image;
        productImage.alt = screen.alt;
        if (screenLabel) screenLabel.textContent = `${numberStr} / ${screen.title}`;
        if (screenCount) screenCount.textContent = `${numberStr} / 04`;
        if (screenDescription) screenDescription.textContent = screen.description;
        if (prototypeStatus) prototypeStatus.textContent = `Screen ${selectedScreenIndex + 1} of 4: ${screen.title}`;

        // Ease in with custom cubic-bezier spring curve
        productImage.style.opacity = '1';
        productImage.style.transform = 'translateY(0) scale(1)';
        productImage.style.transition = 'opacity 0.26s cubic-bezier(0.16, 1, 0.3, 1), transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)';

        // Phase 3: Unlock transitions once animation completes
        setTimeout(() => {
          isTransitioning = false;
        }, 260);
      }, 160);
    }
  }
}

// Attach click listeners to number selector tabs
screenButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectScreen(index));
});

// Attach click listeners to Previous and Next navigation buttons
if (previousButton) {
  previousButton.addEventListener('click', () => selectScreen(selectedScreenIndex - 1));
}

if (nextButton) {
  nextButton.addEventListener('click', () => selectScreen(selectedScreenIndex + 1));
}

// --------------------------------------------------------------------------
// SECTION 9: ACCESSIBLE PROTOTYPE PREVIEW DIALOG MODAL
// --------------------------------------------------------------------------
// Purpose: Powers the fullscreen image preview modal using the native HTML5
// <dialog> element. Includes full keyboard trap management, backdrop clicking,
// focus restoration, and cross-browser fallbacks.

// Dialog modal DOM elements
const previewDialog = document.getElementById('preview-dialog');   // <dialog> container
const dialogImage = document.getElementById('dialog-image');       // Fullscreen <img> preview
const dialogTitle = document.getElementById('dialog-title');       // Modal header title
const openImageLink = document.getElementById('open-image');       // "Open original in new tab" link
const openPreviewBtn = document.getElementById('open-preview');     // Button to trigger modal
const closePreviewBtn = document.getElementById('close-preview');   // Modal close button [x]
let dialogOpenerElement = null;                                    // Stores element that had focus before opening

// Open Dialog Handler
if (openPreviewBtn && previewDialog) {
  openPreviewBtn.addEventListener('click', () => {
    const screen = screens[selectedScreenIndex];
    // Record current active element to restore focus when modal closes (WCAG compliance)
    dialogOpenerElement = document.activeElement;

    // Populate modal with currently selected prototype screen data
    if (dialogImage) {
      dialogImage.src = screen.image;
      dialogImage.alt = screen.alt;
    }
    if (dialogTitle) dialogTitle.textContent = screen.title;
    if (openImageLink) openImageLink.href = screen.image;

    // Use native showModal() for top-layer backdrop and built-in focus trap
    if (typeof previewDialog.showModal === 'function') {
      previewDialog.showModal();
    } else {
      // Fallback for older browsers
      previewDialog.setAttribute('open', '');
    }

    // Direct keyboard focus to the close button for instant keyboard accessibility
    if (closePreviewBtn) closePreviewBtn.focus();
  });
}

/**
 * Closes the preview modal and handles native vs attribute fallback.
 */
function closePreviewModal() {
  if (!previewDialog) return;
  if (typeof previewDialog.close === 'function') {
    previewDialog.close();
  } else {
    previewDialog.removeAttribute('open');
  }
}

// Bind close button click
if (closePreviewBtn) {
  closePreviewBtn.addEventListener('click', closePreviewModal);
}

// Dialog Interaction Listeners
if (previewDialog) {
  // 1. Close when clicking backdrop outside dialog content
  // Compares mouse click coordinates against the dialog element's bounding box
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

  // 2. Focus restoration on modal close:
  // When modal closes, return focus to the button that originally opened it
  previewDialog.addEventListener('close', () => {
    if (dialogOpenerElement && typeof dialogOpenerElement.focus === 'function') {
      dialogOpenerElement.focus();
    }
  });

  // 3. Escape key fallback for browsers that do not natively handle <dialog> Escape
  previewDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && typeof previewDialog.close !== 'function') {
      closePreviewModal();
    }
  });
}

// --------------------------------------------------------------------------
// SECTION 10: CONTACT FORM SUBMISSION CONTROL
// --------------------------------------------------------------------------
// Purpose: Handles the contact inquiry form. Prevents native browser GET
// form submission and page reloads, ensuring the page state stays smooth.

const inquiryForm = document.getElementById('inquiry-form');

if (inquiryForm) {
  // Intercept submit event to prevent default browser page reload (?name=... query strings)
  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Suppresses default HTTP form submission
  });
}
