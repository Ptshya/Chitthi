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
