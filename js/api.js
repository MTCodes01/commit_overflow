/**
 * js/api.js
 * API Integration Layer for Commit Overflow
 */

const API = {
  baseUrlPromise: null,

  async requestWithCache(path, ttl = 300000, options = {}) {
    const cacheKey = 'cache_' + path;
    const cachedStr = sessionStorage.getItem(cacheKey);
    if (cachedStr) {
      try {
        const parsed = JSON.parse(cachedStr);
        if (Date.now() - parsed.timestamp < ttl) {
          return parsed.data;
        }
      } catch (e) {}
    }
    const data = await this.request(path, options);
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data: data,
      timestamp: Date.now()
    }));
    return data;
  },

  async getBaseUrl() {
    if (!this.baseUrlPromise) {
      const cachedUrl = sessionStorage.getItem('api_base_url');
      if (cachedUrl) {
        this.baseUrlPromise = Promise.resolve(cachedUrl);
      } else {
        this.baseUrlPromise = fetch('/config.json?t=' + Date.now())
          .then(res => res.json())
          .then(config => {
            sessionStorage.setItem('api_base_url', config.API_BASE_URL);
            return config.API_BASE_URL;
          })
          .catch(err => {
            console.warn("Failed to load config.json", err);
            return 0;
          });
      }
    }
    return this.baseUrlPromise;
  },

  async request(path, options = {}) {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${path}`;

    // Set headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const isAuthEndpoint = path === '/auth/login' || path === '/auth/register';
    if (!isAuthEndpoint && (res.status === 401 || (res.status === 404 && (path.startsWith('/users/') || path === '/users/me')))) {
      // Clear auth on token expiration or user not found
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      sessionStorage.clear(); // Clear cached data
      // If we are not on public pages, redirect to login
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && !currentPath.includes('login.html') && currentPath !== '/') {
        window.location.href = '/login/';
      }
      throw new Error("Session expired or user not found. Please log in again.");
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${res.status}`);
    }

    if (res.status === 204) {
      return null;
    }

    return res.json();
  },

  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: username, password })
    });
    if (data && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      sessionStorage.clear(); // Clear any stale cache from previous sessions
    }
    return data;
  },

  async register(name, githubUsername, gitlabUsername, password, college) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, github_username: githubUsername, gitlab_username: gitlabUsername, password, college })
    });
    if (data && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      sessionStorage.clear(); // Clear any stale cache from previous sessions
    }
    return data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    sessionStorage.clear(); // Clear cached data
    window.location.href = '/';
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  async fetchUserMe() {
    const user = await this.requestWithCache('/users/me', 60000);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  async updateProfile(name, college, technologies, githubUsername, gitlabUsername) {
    const user = await this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ name, college, technologies, github_username: githubUsername, gitlab_username: gitlabUsername })
    });
    localStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.removeItem('cache_/users/me');
    return user;
  },

  async fetchLeaderboard(period = 'all') {
    return this.requestWithCache(`/leaderboard?period=${period}`, 60000);
  },

  async fetchDashboardData(userId = 'me') {
    return this.requestWithCache(`/users/${userId}/dashboard`, 60000);
  },

  async fetchProjectedScore(userId = 'me') {
    return this.requestWithCache(`/users/${userId}/projected`, 300000);
  },

  async resetData() {
    return this.request('/admin/reset-data', {
      method: 'POST'
    });
  },

  async triggerBackup() {
    return this.request('/admin/backup', {
      method: 'POST'
    });
  },

  async fetchLogs() {
    return this.request('/logs');
  },

  async fetchQueries(page = 1, limit = 10) {
    return this.request(`/queries?page=${page}&limit=${limit}`);
  },

  async createQuery(title, body, category) {
    return this.request('/queries', {
      method: 'POST',
      body: JSON.stringify({ title, body, category })
    });
  },

  async getDiscordAuthUrl() {
    return this.request('/auth/discord/url');
  },

  async verifyDiscordOAuth(code, state) {
    const res = await this.request('/auth/discord/verify', {
      method: 'POST',
      body: JSON.stringify({ code, state })
    });
    sessionStorage.removeItem('cache_/users/me');
    return res;
  },

  async fetchUserIssues(page = 1, limit = 10, tab = 'open') {
    return this.request(`/users/me/issues?page=${page}&limit=${limit}&tab=${tab}`);
  },

  async fetchUserPRs(page = 1, limit = 10) {
    return this.request(`/users/me/prs?page=${page}&limit=${limit}`);
  },

  async replyQuery(queryId, message) {
    return this.request(`/queries/${queryId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  },

  async fetchTechnologies() {
    return this.request('/technologies');
  },

  async getConfig() {
    return fetch('/config.json?t=' + Date.now()).then(res => res.json()).catch(() => ({}));
  },

  async fetchRepos(page = 1, limit = 10) {
    return this.request(`/repos?page=${page}&limit=${limit}`);
  },

  async fetchRepoDetail(id) {
    return this.request(`/repos/${id}`);
  },

  async fetchRules() {
    return this.request('/rules');
  },

  async reorderRules(items) {
    return this.request('/admin/rules/reorder', {
      method: 'POST',
      body: JSON.stringify(items)
    });
  },

  async deactivateRepo(id) {
    return this.request(`/admin/repos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: false })
    });
  },

  async activateRepo(id) {
    return this.request(`/admin/repos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: true })
    });
  },

  async fetchTagStats(userId = 'me') {
    return this.requestWithCache(`/users/${userId}/tag-stats`, 300000);
  },

  formatDateTime(dateInput) {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      }).formatToParts(date);

      const day = parts.find(p => p.type === 'day').value;
      const month = parts.find(p => p.type === 'month').value;
      const year = parts.find(p => p.type === 'year').value;
      const hour = parts.find(p => p.type === 'hour').value;
      const minute = parts.find(p => p.type === 'minute').value;
      const dayPeriod = parts.find(p => p.type === 'dayPeriod').value;
      const timeZoneName = parts.find(p => p.type === 'timeZoneName').value;

      return `${day} ${month} ${year}, ${hour}:${minute} ${dayPeriod} ${timeZoneName}`;
    } catch (e) {
      return date.toLocaleString();
    }
  }
};
