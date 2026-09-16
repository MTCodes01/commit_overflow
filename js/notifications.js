/**
 * js/notifications.js
 * 
 * Complete Notification System for Commit Overflow.
 * 
 * Architecture:
 *   NotificationService — singleton that manages state, polling, and API calls.
 *   The `connect()` method is the single swap point for SSE/WebSocket in the future:
 *   simply replace `setInterval(this._poll, 30_000)` with an EventSource/WebSocket listener.
 * 
 * Usage (called automatically from components.js when sidebar loads):
 *   NotificationService.init();
 */

const NotificationService = (() => {
  // ─── State ────────────────────────────────────────────────────────────────

  let _pollInterval = null;
  let _unreadCount = 0;
  let _notifications = [];
  let _dropdownOpen = false;
  let _dropdownLoaded = false;
  let _criticalBanners = new Set(); // track shown critical broadcast IDs

  const POLL_MS = 30_000; // 30 seconds — replace this block for SSE/WS

  // ─── Notification Type Config ─────────────────────────────────────────────
  // Add new types here to extend the system.

  const TYPE_CONFIG = {
    system:      { color: '#58a6ff', bg: 'rgba(88,166,255,0.12)', icon: 'ph-info',             label: 'System'       },
    broadcast:   { color: '#58a6ff', bg: 'rgba(88,166,255,0.12)', icon: 'ph-megaphone',         label: 'Broadcast'    },
    event:       { color: '#3fb950', bg: 'rgba(63,185,80,0.12)',  icon: 'ph-calendar-check',    label: 'Event'        },
    repository:  { color: '#a371f7', bg: 'rgba(163,113,247,0.12)',icon: 'ph-git-repository',    label: 'Repository'   },
    achievement: { color: '#f0883e', bg: 'rgba(240,136,62,0.12)', icon: 'ph-trophy',            label: 'Achievement'  },
    warning:     { color: '#d29922', bg: 'rgba(210,153,34,0.12)', icon: 'ph-warning',           label: 'Warning'      },
    success:     { color: '#3fb950', bg: 'rgba(63,185,80,0.12)',  icon: 'ph-check-circle',      label: 'Success'      },
    error:       { color: '#f85149', bg: 'rgba(248,81,73,0.12)',  icon: 'ph-x-circle',          label: 'Error'        },
  };

  const PRIORITY_COLORS = {
    low:      '#8b949e',
    normal:   '#58a6ff',
    high:     '#f0883e',
    critical: '#f85149',
  };

  // ─── Public API ───────────────────────────────────────────────────────────

  function init() {
    if (!API.isAuthenticated()) return;
    
    // Do not render the bell overlay if we are already on the notifications page
    if (window.location.pathname.startsWith('/notifications')) return;
    
    _renderBell();
    connect();
    _setupGlobalClickHandler();
  }

  // connect() — start polling. Swap this method for SSE/WebSocket later.
  function connect() {
    _poll(); // immediate first poll
    _pollInterval = setInterval(_poll, POLL_MS);
  }

  // disconnect() — stop polling (called on logout or page unload)
  function disconnect() {
    if (_pollInterval) {
      clearInterval(_pollInterval);
      _pollInterval = null;
    }
  }

  // ─── Bell Rendering ───────────────────────────────────────────────────────

  function _renderBell() {
    if (document.getElementById('notif-bell')) return; // already rendered

    const bell = document.createElement('div');
    bell.id = 'notif-bell';
    bell.className = 'notif-bell';
    bell.setAttribute('aria-label', 'Notifications');
    bell.setAttribute('role', 'button');
    bell.tabIndex = 0;
    bell.innerHTML = `
      <i class="ph ph-bell notif-bell-icon"></i>
      <span class="notif-badge" id="notif-badge" style="display:none">0</span>
    `;
    bell.addEventListener('click', _toggleDropdown);
    bell.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') _toggleDropdown(); });

    document.body.appendChild(bell);
    _renderDropdownContainer();
  }

  function _renderDropdownContainer() {
    if (document.getElementById('notif-dropdown')) return;
    const el = document.createElement('div');
    el.id = 'notif-dropdown';
    el.className = 'notif-dropdown';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="notif-dropdown-header">
        <span class="notif-dropdown-title"><i class="ph ph-bell"></i> Notifications</span>
        <div class="notif-dropdown-actions">
          <button class="notif-action-btn" id="notif-mark-all-btn" title="Mark all as read">
            <i class="ph ph-checks"></i> Mark all read
          </button>
          <a href="/notifications/" class="notif-action-btn notif-view-all" title="View all notifications">
            View all <i class="ph ph-arrow-right"></i>
          </a>
        </div>
      </div>
      <div class="notif-dropdown-body" id="notif-dropdown-body">
        <div class="notif-loading"><i class="ph ph-spinner ph-spin"></i> Loading…</div>
      </div>
    `;
    document.body.appendChild(el);

    document.getElementById('notif-mark-all-btn').addEventListener('click', _handleMarkAllRead);
  }

  // ─── Dropdown Toggle ──────────────────────────────────────────────────────

  function _toggleDropdown(e) {
    if (e) e.stopPropagation();
    _dropdownOpen = !_dropdownOpen;
    const dropdown = document.getElementById('notif-dropdown');
    const bell = document.getElementById('notif-bell');
    if (_dropdownOpen) {
      dropdown.classList.add('open');
      bell.classList.add('active');
      dropdown.setAttribute('aria-hidden', 'false');
      if (!_dropdownLoaded) {
        _loadDropdownNotifications();
      }
    } else {
      dropdown.classList.remove('open');
      bell.classList.remove('active');
      dropdown.setAttribute('aria-hidden', 'true');
    }
  }

  function _closeDropdown() {
    _dropdownOpen = false;
    const dropdown = document.getElementById('notif-dropdown');
    const bell = document.getElementById('notif-bell');
    if (dropdown) { dropdown.classList.remove('open'); dropdown.setAttribute('aria-hidden', 'true'); }
    if (bell) bell.classList.remove('active');
  }

  function _setupGlobalClickHandler() {
    document.addEventListener('click', (e) => {
      const bell = document.getElementById('notif-bell');
      const dropdown = document.getElementById('notif-dropdown');
      if (_dropdownOpen && bell && dropdown &&
          !bell.contains(e.target) && !dropdown.contains(e.target)) {
        _closeDropdown();
      }
    });
  }

  // ─── Polling ──────────────────────────────────────────────────────────────

  async function _poll() {
    try {
      const data = await API.fetchUnreadCount();
      const newCount = data.count || 0;
      if (newCount !== _unreadCount) {
        _unreadCount = newCount;
        _updateBadge(newCount);
        // If dropdown is open, refresh its content
        if (_dropdownOpen) {
          _dropdownLoaded = false;
          _loadDropdownNotifications();
        }
      }
    } catch (err) {
      // Silently fail — notification count is non-critical
    }
  }

  function _updateBadge(count) {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    if (count > 0) {
      badge.style.display = 'flex';
      badge.textContent = count > 99 ? '99+' : count;
      badge.classList.add('pulse');
      setTimeout(() => badge.classList.remove('pulse'), 600);
    } else {
      badge.style.display = 'none';
    }
  }

  // ─── Dropdown Notifications ───────────────────────────────────────────────

  async function _loadDropdownNotifications() {
    const body = document.getElementById('notif-dropdown-body');
    if (!body) return;
    body.innerHTML = '<div class="notif-loading"><i class="ph ph-spinner ph-spin"></i> Loading…</div>';
    try {
      const data = await API.fetchNotifications(1, 10);
      _notifications = data.data || [];
      _dropdownLoaded = true;

      // Show critical banners for unread critical notifications
      _notifications.filter(n => n.priority === 'critical' && !n.is_read)
                    .forEach(_showCriticalBanner);

      _renderDropdownList(body, _notifications);
    } catch (err) {
      body.innerHTML = '<div class="notif-empty"><i class="ph ph-warning"></i> Failed to load notifications.</div>';
    }
  }

  function _renderDropdownList(container, notifications) {
    if (!notifications || notifications.length === 0) {
      container.innerHTML = `
        <div class="notif-empty">
          <i class="ph ph-bell-slash" style="font-size:2rem;opacity:.4;"></i>
          <p>You're all caught up!</p>
        </div>`;
      return;
    }

    container.innerHTML = notifications.map(n => _buildNotifItemHTML(n)).join('');

    // Attach event listeners
    container.querySelectorAll('[data-notif-read]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-notif-read');
        await _handleMarkRead(id);
      });
    });
    container.querySelectorAll('[data-notif-dismiss]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-notif-dismiss');
        await _handleDismiss(id);
      });
    });
  }

  function _buildNotifItemHTML(n) {
    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
    const priorityColor = PRIORITY_COLORS[n.priority] || PRIORITY_COLORS.normal;
    const timeAgo = _relativeTime(n.created_at);
    const unreadClass = n.is_read ? '' : 'unread';
    const priorityDot = n.priority !== 'normal' && n.priority !== 'low'
      ? `<span class="notif-priority-dot" style="background:${priorityColor}" title="${n.priority} priority"></span>`
      : '';

    // Parse metadata for action button
    let meta = {};
    try { meta = JSON.parse(n.metadata || '{}'); } catch (_) {}
    const hasButton = meta.button_text && meta.button_url;
    const actionHref = n.action_url || meta.button_url || '#';
    const actionLabel = meta.button_text || 'View';

    return `
      <div class="notif-item ${unreadClass}" id="notif-item-${n.id}" style="--notif-type-color:${cfg.color};--notif-type-bg:${cfg.bg}">
        <div class="notif-item-icon">
          <i class="ph ${n.icon || cfg.icon}"></i>
        </div>
        <div class="notif-item-body">
          <div class="notif-item-header">
            <span class="notif-item-title">${_escapeHtml(n.title)}</span>
            <div class="notif-item-meta">
              ${priorityDot}
              <span class="notif-item-time">${timeAgo}</span>
            </div>
          </div>
          <p class="notif-item-message">${_escapeHtml(n.message)}</p>
          <div class="notif-item-actions">
            ${actionHref !== '#' ? `<a href="${actionHref}" class="notif-action-link">${_escapeHtml(actionLabel)}</a>` : ''}
            ${!n.is_read ? `<button class="notif-action-link notif-mark-read-btn" data-notif-read="${n.id}"><i class="ph ph-check"></i> Mark read</button>` : ''}
            <button class="notif-action-link notif-dismiss-btn" data-notif-dismiss="${n.id}"><i class="ph ph-x"></i> Dismiss</button>
          </div>
        </div>
      </div>`;
  }

  // ─── Event Handlers ───────────────────────────────────────────────────────

  async function _handleMarkRead(id) {
    // Optimistic UI update
    const item = document.getElementById(`notif-item-${id}`);
    if (item) item.classList.remove('unread');
    _unreadCount = Math.max(0, _unreadCount - 1);
    _updateBadge(_unreadCount);

    try {
      await API.markNotificationRead(id);
    } catch (err) {
      // Revert on failure
      if (item) item.classList.add('unread');
      _unreadCount++;
      _updateBadge(_unreadCount);
    }
  }

  async function _handleDismiss(id) {
    const item = document.getElementById(`notif-item-${id}`);
    // Animate out
    if (item) {
      item.style.transition = 'opacity 0.2s, max-height 0.3s';
      item.style.opacity = '0';
      item.style.maxHeight = '0';
      item.style.overflow = 'hidden';
      setTimeout(() => item.remove(), 300);
    }
    // Update count if it was unread
    if (item && item.classList.contains('unread')) {
      _unreadCount = Math.max(0, _unreadCount - 1);
      _updateBadge(_unreadCount);
    }
    try {
      await API.dismissNotification(id);
    } catch (err) {
      // Re-add on failure — simplest approach is to force reload
      _dropdownLoaded = false;
    }
  }

  async function _handleMarkAllRead() {
    // Optimistic update
    document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
    _unreadCount = 0;
    _updateBadge(0);
    try {
      await API.markAllNotificationsRead();
    } catch (err) {
      _dropdownLoaded = false;
    }
  }

  // ─── Critical Banner ──────────────────────────────────────────────────────

  function _showCriticalBanner(notif) {
    const bannerKey = `critical-banner-dismissed-${notif.id}`;
    if (_criticalBanners.has(notif.id)) return;
    if (sessionStorage.getItem(bannerKey)) return;

    _criticalBanners.add(notif.id);

    const banner = document.createElement('div');
    banner.className = 'notif-critical-banner';
    banner.id = `critical-banner-${notif.id}`;
    banner.innerHTML = `
      <div class="notif-critical-inner">
        <i class="ph ph-warning-octagon notif-critical-icon"></i>
        <div class="notif-critical-content">
          <strong>${_escapeHtml(notif.title)}</strong>
          <span>${_escapeHtml(notif.message)}</span>
        </div>
        <button class="notif-critical-close" id="critical-close-${notif.id}" title="Dismiss">
          <i class="ph ph-x"></i>
        </button>
      </div>
    `;
    document.body.prepend(banner);

    document.getElementById(`critical-close-${notif.id}`).addEventListener('click', () => {
      banner.style.animation = 'criticalSlideUp 0.3s ease forwards';
      setTimeout(() => banner.remove(), 300);
      sessionStorage.setItem(bannerKey, '1');
      _handleMarkRead(notif.id);
    });
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  function _relativeTime(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  function _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ─── Public surface ───────────────────────────────────────────────────────
  return { init, connect, disconnect };
})();
