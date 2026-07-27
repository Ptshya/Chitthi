/* 
   CHITTHI - Nepal's First Future Letter Platform
   Common JS - Handles Theme Toggling, Mobile Menu, and Shared Authentication Modal
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Switcher Logic ---
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeSwitcherUI(currentTheme);

  // Bind to any theme toggle click
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.theme-switcher')) {
      const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeSwitcherUI(theme);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const trailContainer = document.getElementById('cursor-trail');
  const trailLogos = [];
  const numLogos = 12; // How many logos make up the tail (12 is a good crescent length)

  // 1. Generate the images for the tail
  for (let i = 0; i < numLogos; i++) {
    const img = document.createElement('img');
    img.src = 'images/logobright.png'; // <-- YOUR LOGO FILE HERE
    img.className = 'trail-logo';
    
    // Fade out and shrink the logos further back in the tail
    img.style.opacity = 1 - (i / numLogos); 
    img.style.width = (24 - i * 1.5) + 'px'; // Starts at 24px, shrinks down
    
    trailContainer.appendChild(img);
    trailLogos.push({ x: 0, y: 0, el: img });
  }

  let mouseX = 0;
  let mouseY = 0;

  // 2. Track the actual mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // 3. Animate the tail smoothly
  function animateTrail() {
    let targetX = mouseX;
    let targetY = mouseY;

    trailLogos.forEach((logo, index) => {
      // The math that creates the smooth, elastic follow effect
      logo.x += (targetX - logo.x) * 0.35; // Change 0.35 to adjust the "stiffness" (lower = longer, lazier tail)
      logo.y += (targetY - logo.y) * 0.35;

      logo.el.style.left = logo.x + 'px';
      logo.el.style.top = logo.y + 'px';

      // The next logo's target becomes the CURRENT logo's position
      targetX = logo.x;
      targetY = logo.y;
    });

    requestAnimationFrame(animateTrail);
  }

  animateTrail();
});

  function updateThemeSwitcherUI(theme) {
    const switchers = document.querySelectorAll('.theme-switcher');
    switchers.forEach(btn => {
      if (theme === 'light') {
        btn.innerHTML = '✦ Light Theme';
      } else {
        btn.innerHTML = '✦ Dark Theme';
      }
    });
  }

  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });
  }

  // --- Reusable Auth Modal Injection ---
  injectAuthModal();
  updateAuthNavbar();

  // Listen to login/logout buttons
  document.body.addEventListener('click', (e) => {
    const loginTrigger = e.target.closest('.auth-trigger');
    if (loginTrigger) {
      e.preventDefault();
      if (localStorage.getItem('userLoggedIn') === 'true') {
        // Log out
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        updateAuthNavbar();
        window.dispatchEvent(new Event('authChanged'));
        alert('You have logged out successfully.');
      } else {
        // Open Login Modal
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('active');
      }
    }
  });

  // Modal Close trigger
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close')) {
        authModal.classList.remove('active');
      }
    });
  }

  // Handle Auth Form Submission
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isSignUp = authForm.dataset.mode === 'signup';
      const email = document.getElementById('auth-email').value;
      const name = isSignUp ? document.getElementById('auth-name').value : email.split('@')[0];
      
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userName', name);
      
      authModal.classList.remove('active');
      updateAuthNavbar();
      
      // Dispatch global event for other scripts to listen
      window.dispatchEvent(new Event('authChanged'));
      
      alert(`Welcome, ${name}! You are now logged in.`);
    });
  }

  // Tab switching in Auth Modal
  const authTabs = document.querySelectorAll('.auth-tab');
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const mode = tab.dataset.tab;
      const form = document.getElementById('auth-form');
      const nameGroup = document.getElementById('auth-name-group');
      const submitBtn = document.getElementById('auth-submit-btn');
      
      if (mode === 'signup') {
        form.dataset.mode = 'signup';
        nameGroup.style.display = 'block';
        document.getElementById('auth-name').required = true;
        submitBtn.textContent = 'Create Account';
      } else {
        form.dataset.mode = 'login';
        nameGroup.style.display = 'none';
        document.getElementById('auth-name').required = false;
        submitBtn.textContent = 'Sign In';
      }
    });
  });
});

// Update the Navbar based on Auth State
function updateAuthNavbar() {
  const loginBtns = document.querySelectorAll('.auth-trigger');
  const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
  const userName = localStorage.getItem('userName') || 'User';

  loginBtns.forEach(btn => {
    if (loggedIn) {
      btn.textContent = `Logout (${userName})`;
      btn.classList.add('logged-in');
    } else {
      btn.textContent = 'Login';
      btn.classList.remove('logged-in');
    }
  });
}

// Injects the markup for the login / signup modal into the page
function injectAuthModal() {
  if (document.getElementById('auth-modal')) return;

  const modalHtml = `
    <div id="auth-modal" class="modal-overlay">
      <div class="modal-box">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div style="display: flex; border-bottom: 1px solid var(--border-color); margin-bottom: 24px;">
          <button class="btn auth-tab active" data-tab="login" style="flex: 1; border: none; background: none; font-family: var(--font-sc); letter-spacing: 0.1em; color: var(--color-accent); font-weight: bold; padding: 12px 0;">Sign In</button>
          <button class="btn auth-tab" data-tab="signup" style="flex: 1; border: none; background: none; font-family: var(--font-sc); letter-spacing: 0.1em; color: var(--color-text-muted); padding: 12px 0;">Sign Up</button>
        </div>
        <form id="auth-form" data-mode="login">
          <div class="control-group" id="auth-name-group" style="display: none;">
            <label class="control-label" for="auth-name">Your Full Name</label>
            <input type="text" id="auth-name" class="form-input" placeholder="e.g. Aarav Sharma">
          </div>
          <div class="control-group">
            <label class="control-label" for="auth-email">Email Address</label>
            <input type="email" id="auth-email" class="form-input" required placeholder="e.g. aarav@example.com">
          </div>
          <div class="control-group">
            <label class="control-label" for="auth-password">Password</label>
            <input type="password" id="auth-password" class="form-input" required placeholder="••••••••">
          </div>
          <button type="submit" id="auth-submit-btn" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Sign In</button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Add styles specific to the tabs
  const style = document.createElement('style');
  style.innerHTML = `
    .auth-tab { cursor: pointer; border-bottom: 2px solid transparent !important; }
    .auth-tab.active { border-bottom: 2px solid var(--color-accent) !important; color: var(--color-accent) !important; }
  `;
  document.head.appendChild(style);
}

/* ==========================================================================
   CHITTHI — Unified Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Theme Switcher Logic ── */
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeSwitcherUI(currentTheme);

  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.theme-switcher')) {
      const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeSwitcherUI(theme);
    }
  });

  function updateThemeSwitcherUI(theme) {
    const switchers = document.querySelectorAll('.theme-switcher');
    switchers.forEach(btn => {
      btn.innerHTML = theme === 'light' ? '✦ Light Theme' : '✦ Dark Theme';
    });
  }

  /* ── 2. Navbar & Mobile Menu ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.getElementById('mobile-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when link clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── 3. Scroll Reveal Animations ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── 4. Hero Particles (Burgundy & Gold) ── */
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const colors = ['#6B1A2A', '#C9A84C', '#FAF4EC', '#0D1523'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 12 + 8;
      
      p.style.cssText = `
        position: absolute; bottom: -10px; display: block; border-radius: 50%;
        pointer-events: none; z-index: 1; width: ${size}px; height: ${size}px;
        left: ${left}%; background: ${colors[Math.floor(Math.random() * colors.length)]};
        opacity: 0.25; animation: rise ${duration}s infinite linear; animation-delay: -${delay}s;
      `;
      particleContainer.appendChild(p);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes rise {
        0% { transform: translateY(0) scale(1); opacity: 0; }
        10% { opacity: 0.35; }
        90% { opacity: 0.35; }
        100% { transform: translateY(-80vh) scale(0.6); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── 5. Authentication Modal ── */
  injectAuthModal();
  updateAuthNavbar();

  document.body.addEventListener('click', (e) => {
    const loginTrigger = e.target.closest('.auth-trigger');
    if (loginTrigger) {
      e.preventDefault();
      if (localStorage.getItem('userLoggedIn') === 'true') {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        updateAuthNavbar();
        alert('You have logged out successfully.');
      } else {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('active');
      }
    }
  });

  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close')) {
        authModal.classList.remove('active');
      }
    });

    const authForm = document.getElementById('auth-form');
    authForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const name = email.split('@')[0];
      
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userName', name);
      authModal.classList.remove('active');
      updateAuthNavbar();
      alert(`Welcome, ${name}! You are now logged in.`);
    });
  }

  function updateAuthNavbar() {
    const loginBtns = document.querySelectorAll('.auth-trigger');
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || 'User';

    loginBtns.forEach(btn => {
      btn.textContent = loggedIn ? `Logout (${userName})` : 'Login';
    });
  }

  function injectAuthModal() {
    if (document.getElementById('auth-modal')) return;
    const modalHtml = `
      <div id="auth-modal" class="modal-overlay">
        <div class="modal-box">
          <button class="modal-close" aria-label="Close">&times;</button>
          <h3 style="color: var(--color-accent); margin-bottom: 20px; font-family: var(--font-sc);">Login to Chitthi</h3>
          <form id="auth-form" data-mode="login">
            <label class="control-label" style="color: var(--color-text);">Email Address</label>
            <input type="email" id="auth-email" class="form-input" required placeholder="e.g. hello@chitthi.np">
            <label class="control-label" style="color: var(--color-text);">Password</label>
            <input type="password" id="auth-password" class="form-input" required placeholder="••••••••">
            <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  /* ── 6. The Cursor Trail Effect ── */
  /* ── 6. The Floating Moon / Particle Cursor Spread ── */
  const trailContainer = document.getElementById('cursor-trail');
  if (trailContainer) {
    let activeMoons = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastSpawnTime = 0;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const now = Date.now();
      if (now - lastSpawnTime > 40) { // Spawns every 40ms for a smooth, airy feel
        spawnMoon(mouseX, mouseY);
        lastSpawnTime = now;
      }
    });

    function spawnMoon(x, y) {
      const el = document.createElement('img');
      el.src = 'images/logobright.png'; // Make sure this matches your image name!
      el.className = 'trail-logo';
      
      // Fallback if the image doesn't load: turns it into a glowing gold particle
      el.onerror = function() {
        this.remove(); // Remove broken image tag and make a glowing dot instead
        const dot = document.createElement('div');
        dot.className = 'trail-logo';
        dot.style.width = '8px';
        dot.style.height = '8px';
        dot.style.backgroundColor = '#C5A059';
        dot.style.borderRadius = '50%';
        dot.style.boxShadow = '0 0 8px #C5A059';
        trailContainer.appendChild(dot);
        setupParticle(dot, x, y);
      };

      const size = Math.random() * 16 + 18; // Size between 18px and 34px
      el.style.width = size + 'px';
      el.style.height = 'auto';
      trailContainer.appendChild(el);

      setupParticle(el, x, y);
    }

    function setupParticle(element, x, y) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.8 + 0.4; // Gentle drifting speed
      
      activeMoons.push({
        el: element,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: (Math.sin(angle) * speed) - 0.6, // Slight upward float
        life: 1.0, 
        decay: Math.random() * 0.012 + 0.008 // How fast they fade out
      });
    }

    function animateMoons() {
      for (let i = activeMoons.length - 1; i >= 0; i--) {
        let moon = activeMoons[i];
        
        moon.x += moon.vx;
        moon.y += moon.vy;
        
        // Soft friction to slow them down
        moon.vx *= 0.95; 
        moon.vy *= 0.95; 
        
        moon.life -= moon.decay;

        if (moon.life <= 0) {
          moon.el.remove();
          activeMoons.splice(i, 1);
        } else {
          moon.el.style.left = moon.x + 'px';
          moon.el.style.top = moon.y + 'px';
          moon.el.style.opacity = moon.life;
          moon.el.style.transform = `translate(-50%, -50%) scale(${0.3 + moon.life * 0.7}) rotate(${moon.life * 20}deg)`;
        }
      }

      requestAnimationFrame(animateMoons);
    }
    
    animateMoons();
  }});
