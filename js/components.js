const Components = {
  renderSidebar(activePage) {
    const sidebarHtml = `
      <aside class="sidebar" id="app-sidebar">
        <div class="sidebar-header" style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div class="sidebar-logo">
              <i class="ph ph-terminal-window"></i>
              <span class="sidebar-text">Commit Overflow</span>
            </div>
            <button id="sidebar-collapse-btn" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; border: none; background: transparent;">
              <i class="ph ph-caret-left"></i>
            </button>
          </div>
        </div>
        <nav class="sidebar-nav">
          <a href="dashboard.html" class="nav-item ${activePage === "dashboard" ? "active" : ""}">
            <i class="ph ph-squares-four"></i> <span class="sidebar-text">Dashboard</span>
          </a>
          <a href="profile.html" class="nav-item ${activePage === "profile" ? "active" : ""}">
            <i class="ph ph-user"></i> <span class="sidebar-text">Profile</span>
          </a>
          <a href="leaderboard.html" class="nav-item ${activePage === "leaderboard" ? "active" : ""}">
            <i class="ph ph-trophy"></i> <span class="sidebar-text">Leaderboard</span>
          </a>
          <a href="repositories.html" class="nav-item ${activePage === "repositories" ? "active" : ""}">
            <i class="ph ph-git-fork"></i> <span class="sidebar-text">Repositories</span>
          </a>
          <a href="issues.html" class="nav-item ${activePage === "issues" ? "active" : ""}">
            <i class="ph ph-warning"></i> <span class="sidebar-text">Issues</span>
          </a>
          <a href="prs.html" class="nav-item ${activePage === "prs" ? "active" : ""}">
            <i class="ph ph-git-pull-request"></i> <span class="sidebar-text">Pull Requests</span>
          </a>
          <a href="queries.html" class="nav-item ${activePage === "queries" ? "active" : ""}">
            <i class="ph ph-question"></i> <span class="sidebar-text">Queries</span>
          </a>
          <a href="rules.html" class="nav-item ${activePage === "rules" ? "active" : ""}">
            <i class="ph ph-book-open-text"></i> <span class="sidebar-text">Rules & Scoring</span>
          </a>
          <a href="dashboard-about.html" class="nav-item ${activePage === "about" ? "active" : ""}">
            <i class="ph ph-info"></i> <span class="sidebar-text">About Us</span>
          </a>
          <a href="logs.html" class="nav-item ${activePage === "logs" ? "active" : ""}">
            <i class="ph ph-list-dashes"></i> <span class="sidebar-text">Activity Logs</span>
          </a>
          <a href="community.html" class="nav-item ${activePage === "community" ? "active" : ""}">
            <i class="ph ph-users-three"></i> <span class="sidebar-text">Community</span>
          </a>
        </nav>
        <div class="sidebar-footer" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <a href="index.html" id="sidebar-logout-btn" class="btn btn-secondary btn-block">
            <i class="ph ph-sign-out"></i> <span class="sidebar-text">Logout</span>
          </a>
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
                    <i class="ph ph-terminal-window"></i>
                    Commit Overflow
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
    const collapseBtn = document.getElementById("sidebar-collapse-btn");
    if (collapseBtn) {
      collapseBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        document.body.classList.toggle("sidebar-collapsed");
        const icon = collapseBtn.querySelector("i");
        if (sidebar.classList.contains("collapsed")) {
          icon.classList.replace("ph-caret-left", "ph-caret-right");
        } else {
          icon.classList.replace("ph-caret-right", "ph-caret-left");
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


};
