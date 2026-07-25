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
