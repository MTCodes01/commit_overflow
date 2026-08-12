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
      <div class="pagination-wrapper" style="display: flex; align-items: center; justify-content: flex-end; gap: 1rem; color: #a1a1aa; font-size: 0.9rem; margin-top: 1.5rem;">
        <span>Items per page:</span>
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
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) html += makeBtn(i, i === page);
        html += makeEllipsis();
        html += makeBtn(total_pages, false);
      } else if (page >= total_pages - 3) {
        html += makeBtn(1, false);
        html += makeEllipsis();
        for (let i = total_pages - 4; i <= total_pages; i++) html += makeBtn(i, i === page);
      } else {
        html += makeBtn(1, false);
        html += makeEllipsis();
        html += makeBtn(page - 1, false);
        html += makeBtn(page, true);
        html += makeBtn(page + 1, false);
        html += makeEllipsis();
        html += makeBtn(total_pages, false);
      }
    }

    // Next Button
    html += `<button class="pagination-btn" id="pagination-next" ${page >= total_pages ? 'disabled' : ''}><i class="ph ph-caret-right"></i></button>`;
    html += `</div></div>`;

    container.innerHTML = html;

    // Attach events
    document.getElementById('pagination-limit-select').addEventListener('change', (e) => {
      if (onLimitChange) onLimitChange(parseInt(e.target.value));
    });

    if (page > 1) {
      document.getElementById('pagination-prev').addEventListener('click', () => {
        if (onPageChange) onPageChange(page - 1);
      });
    }

    if (page < total_pages) {
      document.getElementById('pagination-next').addEventListener('click', () => {
        if (onPageChange) onPageChange(page + 1);
      });
    }

    container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const p = parseInt(e.currentTarget.getAttribute('data-page'));
        if (p !== page && onPageChange) onPageChange(p);
      });
    });
  }

};
