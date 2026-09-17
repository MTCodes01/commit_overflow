const Components = {
  renderSidebar(activePage) {
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
    const sidebarClass = isCollapsed ? "sidebar collapsed" : "sidebar";
    
    if (isCollapsed) {
      document.body.classList.add("sidebar-collapsed");
    }

    const sidebarHtml = `
      <aside class="${sidebarClass}" id="app-sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo" id="sidebar-logo-btn" title="Toggle Sidebar">
            <img src="/logo/logo-light-clr.svg" alt="Logo" style="height: 32px; width: auto;">
            <span class="sidebar-text">Commit Overflow</span>
          </div>
        </div>
        <nav class="sidebar-nav">
          <a href="/profile/" title="Profile" class="nav-item ${activePage === "profile" ? "active" : ""}">
            <i class="ph ph-user"></i> <span class="sidebar-text">Profile</span>
          </a>
          <a href="/leaderboard/" title="Leaderboard" class="nav-item ${activePage === "leaderboard" ? "active" : ""}">
            <i class="ph ph-trophy"></i> <span class="sidebar-text">Leaderboard</span>
          </a>
          <a href="/repositories/" title="Repositories" class="nav-item ${activePage === "repositories" ? "active" : ""}">
            <i class="ph ph-git-fork"></i> <span class="sidebar-text">Repositories</span>
          </a>
          <a href="/issues/" title="Issues" class="nav-item ${activePage === "issues" ? "active" : ""}">
            <i class="ph ph-warning"></i> <span class="sidebar-text">Issues</span>
          </a>
          <a href="/prs/" title="Pull Requests" class="nav-item ${activePage === "prs" ? "active" : ""}">
            <i class="ph ph-git-pull-request"></i> <span class="sidebar-text">Pull Requests</span>
          </a>
          <a href="/queries/" title="Queries" class="nav-item ${activePage === "queries" ? "active" : ""}">
            <i class="ph ph-question"></i> <span class="sidebar-text">Queries</span>
          </a>
          <a href="/rules/" title="Rules & Scoring" class="nav-item ${activePage === "rules" ? "active" : ""}">
            <i class="ph ph-book-open-text"></i> <span class="sidebar-text">Rules & Scoring</span>
          </a>
          <a href="/dashboard-about/" title="About Us" class="nav-item ${activePage === "about" ? "active" : ""}">
            <i class="ph ph-info"></i> <span class="sidebar-text">About Us</span>
          </a>
          <a href="/logs/" title="Activity Logs" class="nav-item ${activePage === "logs" ? "active" : ""}">
            <i class="ph ph-list-dashes"></i> <span class="sidebar-text">Activity Logs</span>
          </a>
          <a href="/community/" title="Community" class="nav-item ${activePage === "community" ? "active" : ""}">
            <i class="ph ph-users-three"></i> <span class="sidebar-text">Community</span>
          </a>
          <a href="/notifications/" title="Notifications" class="nav-item ${activePage === "notifications" ? "active" : ""}">
            <i class="ph ph-bell"></i> <span class="sidebar-text">Notifications</span>
          </a>
          ${(() => {
            try {
              const u = JSON.parse(localStorage.getItem('currentUser') || '{}');
              if (u && u.is_admin) {
                return `<a href="/admin/broadcasts/" title="Broadcasts" class="nav-item ${activePage === "broadcasts" ? "active" : ""}">
                  <i class="ph ph-megaphone"></i> <span class="sidebar-text">Broadcasts</span>
                </a>`;
              }
            } catch(_) {}
            return '';
          })()}
        </nav>
        <div class="sidebar-footer">
          ${localStorage.getItem("authToken") 
            ? `<a href="/" title="Logout" id="sidebar-logout-btn" class="nav-item" style="color: var(--danger-color);">
                 <i class="ph ph-sign-out"></i> <span class="sidebar-text">Logout</span>
               </a>`
            : `<a href="/login/" title="Login" class="nav-item" style="color: var(--accent-primary);">
                 <i class="ph ph-sign-in"></i> <span class="sidebar-text">Login</span>
               </a>`
          }
        </div>
      </aside>
    `;

    document.body.insertAdjacentHTML("afterbegin", sidebarHtml);

    // Inject trial mode banner at the absolute top of the body
    const trialBannerHtml = `
      <div id="trial-mode-banner" style="position: absolute; top: 0; left: 0; width: 100%; overflow: hidden; background: rgba(255, 166, 0, 0.15); border-bottom: 1px solid rgba(255, 166, 0, 0.3); color: #ffb84d; padding: 0.75rem 0; font-weight: 500; font-size: 0.95rem; z-index: 10;">
        <div class="marquee-text">
            🚧 <strong>Trial Mode Active:</strong> The platform is currently in trial mode. The official event and leaderboard scoring begins on <strong>October 4th</strong>.
        </div>
      </div>
    `;
    
    if (!document.getElementById("trial-mode-banner")) {
        document.body.insertAdjacentHTML("afterbegin", trialBannerHtml);
        
        // Add top padding to the app-wrapper so it isn't covered by the absolute banner
        const wrapper = document.querySelector(".app-wrapper") || document.body;
        const banner = document.getElementById("trial-mode-banner");
        if (wrapper && banner) {
            wrapper.style.paddingTop = banner.offsetHeight + 'px';
            // Force enough height so even short pages can scroll past the banner
            wrapper.style.minHeight = `calc(100vh + ${banner.offsetHeight}px)`;
        }
        
        // Auto-scroll past the banner so it's hidden by default
        setTimeout(() => {
            if (window.scrollY === 0) {
                const banner = document.getElementById("trial-mode-banner");
                window.scrollTo({ top: banner.offsetHeight, behavior: 'instant' });
            }
        }, 10);
    }

    // Add mobile header if not exists
    if (!document.getElementById("mobile-header")) {
      document.body.insertAdjacentHTML(
        "afterbegin",
        `
            <div id="mobile-header" class="mobile-header">
                <button id="mobile-menu-toggle" class="mobile-menu-btn">
                    <i class="ph ph-list"></i>
                </button>
                <div class="mobile-logo">
                    <img src="/logo/logo-light-clr.svg" alt="Logo" width="36" height="36" style="height: 36px; width: auto;">
                </div>
            </div>
        `,
      );

      document
        .getElementById("mobile-menu-toggle")
        .addEventListener("click", (e) => {
          e.stopPropagation();
          document.getElementById("app-sidebar").classList.toggle("open");
        });

      // Close menu when tapping outside
      document.addEventListener("click", (e) => {
        const sidebar = document.getElementById("app-sidebar");
        if (sidebar && sidebar.classList.contains("open")) {
          if (!sidebar.contains(e.target)) {
            sidebar.classList.remove("open");
          }
        }
      });
    }

    // Sidebar Collapse Logic
    const sidebar = document.getElementById("app-sidebar");
    const collapseBtn = document.getElementById("sidebar-logo-btn");
    if (collapseBtn) {
      collapseBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        document.body.classList.toggle("sidebar-collapsed");
        if (sidebar.classList.contains("collapsed")) {
          localStorage.setItem("sidebar-collapsed", "true");
        } else {
          localStorage.setItem("sidebar-collapsed", "false");
        }
      });
    }

    // Logout Logic
    const logoutBtn = document.getElementById("sidebar-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
      });
    }

    // Fetch Event Status and update UI
    (async () => {
      try {
        const data = await API.request('/event/status');
        const status = data.status || 'PASSIVE';
        sessionStorage.setItem("event_status", status);

        // Dispatch custom event to notify other scripts that status has loaded
        window.dispatchEvent(new CustomEvent('eventStatusLoaded', { detail: status }));
      } catch (err) {
        console.error("Failed to load event status:", err);
      }
    })();

    // Initialize notification bell (only for authenticated users)
    if (typeof NotificationService !== 'undefined') {
      NotificationService.init();
    }
  },

  // Toast Notification System
  showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon =
      type === "success"
        ? '<i class="ph ph-check-circle" style="color: var(--accent-primary); font-size: 1.25rem;"></i>'
        : '<i class="ph ph-warning-circle" style="color: var(--danger-color); font-size: 1.25rem;"></i>';

    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-in forwards";
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    }, 3000);
  },

  // Modal handler helper
  setupModal(modalId, triggerId, closeClass) {
    const modal = document.getElementById(modalId);
    const trigger = document.getElementById(triggerId);
    if (!modal) return;

    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("active");
      });
    }

    const closeBtns = modal.querySelectorAll(`.${closeClass}`);
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("active");
      });
    });

    // Close on overlay click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  },

  // Accordion setup
  setupAccordions() {
    document.querySelectorAll(".accordion-header").forEach((header) => {
      header.addEventListener("click", () => {
        const accordion = header.parentElement;
        const isOpen = accordion.classList.contains("open");

        // Close all
        document
          .querySelectorAll(".accordion")
          .forEach((a) => a.classList.remove("open"));

        // Toggle current
        if (!isOpen) {
          accordion.classList.add("open");
        }
      });
    });
  },

  // Pagination Renderer
  renderPagination(containerId, meta, onPageChange, onLimitChange) {
    const container = document.getElementById(containerId);
    if (!container || !meta) return;

    const { page, limit, total_pages } = meta;

    // Build Items per page dropdown
    let html = `
      <div class="pagination-wrapper floating-pagination-wrapper">
        <span class="pagination-label">Items per page:</span>
        <select class="form-control pagination-select" style="width: auto; padding: 0.25rem 0.5rem; height: 32px;" id="pagination-limit-select">
          <option value="10" ${limit === 10 ? 'selected' : ''}>10</option>
          <option value="20" ${limit === 20 ? 'selected' : ''}>20</option>
          <option value="50" ${limit === 50 ? 'selected' : ''}>50</option>
        </select>
        <span style="border-left: 1px solid var(--border-color); height: 1.5rem; margin: 0 0.5rem;"></span>
        
        <div style="display: flex; gap: 0.25rem;">
    `;

    // Prev Button
    html += `<button class="pagination-btn" id="pagination-prev" ${page <= 1 ? 'disabled' : ''}><i class="ph ph-caret-left"></i></button>`;

    // Page Buttons Logic
    const makeBtn = (p, isActive = false) => `<button class="pagination-btn ${isActive ? 'active' : ''}" data-page="${p}">${p}</button>`;
    const makeEllipsis = () => `<span style="padding: 0 0.5rem; display: flex; align-items: center;">...</span>`;

    if (total_pages <= 7) {
      for (let i = 1; i <= total_pages; i++) {
        html += makeBtn(i, i === page);
      }
    } else {
      // Always show first page
      html += makeBtn(1, page === 1);

      if (page > 3) html += makeEllipsis();
      
      const start = Math.max(2, page - 1);
      const end = Math.min(total_pages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        html += makeBtn(i, page === i);
      }
      
      if (page < total_pages - 2) html += makeEllipsis();
      
      html += makeBtn(total_pages, page === total_pages);
    }

    // Next Button
    html += `<button class="pagination-btn" id="pagination-next" ${page >= total_pages ? 'disabled' : ''}><i class="ph ph-caret-right"></i></button>`;

    html += `</div></div>`;
    
    container.innerHTML = html;

    // Attach listeners
    container.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => onPageChange(parseInt(btn.getAttribute('data-page'))));
    });

    const prevBtn = container.querySelector('#pagination-prev');
    if (prevBtn) prevBtn.addEventListener('click', () => onPageChange(page - 1));

    const nextBtn = container.querySelector('#pagination-next');
    if (nextBtn) nextBtn.addEventListener('click', () => onPageChange(page + 1));

    const limitSelect = container.querySelector('#pagination-limit-select');
    if (limitSelect) limitSelect.addEventListener('change', (e) => onLimitChange(parseInt(e.target.value)));
  },

  getTagStyles(labelInput, fallbackColor = null) {
    const label = typeof labelInput === 'string' ? labelInput : (labelInput.name || '');
    const serverColor = fallbackColor || (typeof labelInput === 'object' ? labelInput.color : null);

    const known = {
      'commitoverflow': { border: '#5AA468', bg: '#5AA4681a', text: '#5AA468' },
      'documentation': { border: '#0075ca', bg: '#0075ca1a', text: '#0075ca' },
      'docs':          { border: '#0075ca', bg: '#0075ca1a', text: '#0075ca' },
      'easy':          { border: '#0e8a16', bg: '#0e8a161a', text: '#0e8a16' },
      'good first issue': { border: '#7057ff', bg: '#7057ff1a', text: '#7057ff' },
      'hard':          { border: '#ff0000', bg: '#ff00001a', text: '#ff0000' },
      'medium':        { border: '#ff7300', bg: '#ff73001a', text: '#ff7300' },
      'duplicate':     { border: '#cfd3d7', bg: '#cfd3d71a', text: '#cfd3d7' },
      'invalid':       { border: '#bbff00', bg: '#bbff001a', text: '#bbff00' },
      'rework':        { border: '#ff6e6b', bg: '#ff6e6b1a', text: '#ff6e6b' },
      'bug':           { border: '#85000d', bg: '#85000d1a', text: '#85000d' }
    };
    
    if (label && known[label.toLowerCase()]) {
      return known[label.toLowerCase()];
    }

    if (serverColor) {
      let hex = serverColor.startsWith('#') ? serverColor : '#' + serverColor;
      return { border: hex, bg: hex + '1a', text: hex };
    }

    let hash = 0;
    for (let i = 0; i < label.length; i++) { hash = label.charCodeAt(i) + ((hash << 5) - hash); }
    const h = Math.abs(hash) % 360;
    return { border: `hsl(${h}, 55%, 55%)`, bg: `hsla(${h}, 55%, 55%, 0.1)`, text: `hsl(${h}, 55%, 65%)` };
  }
};
