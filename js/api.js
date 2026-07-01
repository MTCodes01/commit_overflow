/**
 * js/api.js
 * API Integration Layer for Commit Overflow
 */

const API = {
  baseUrlPromise: null,

  async getBaseUrl() {
    if (!this.baseUrlPromise) {
      this.baseUrlPromise = fetch('config.json')
        .then(res => res.json())
        .then(config => config.API_BASE_URL)
        .catch(err => {
          console.warn("Failed to load config.json", err);
          return 0;
        });
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

    if (res.status === 401 || (res.status === 404 && (path.startsWith('/users/') || path === '/users/me'))) {
      // Clear auth on token expiration or user not found
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      // If we are not on public pages, redirect to login
      const currentPath = window.location.pathname;
      if (!currentPath.endsWith('index.html') && !currentPath.endsWith('login.html') && !currentPath.endsWith('register.html') && currentPath !== '/') {
        window.location.href = 'login.html';
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

  async login(githubUsername, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ github_username: githubUsername, password })
    });
    if (data && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    return data;
  },

  async register(name, githubUsername, password, college) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, github_username: githubUsername, password, college })
    });
    if (data && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  async fetchUserMe() {
    const user = await this.request('/users/me');
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  async updateProfile(name, college, technologies) {
    const user = await this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ name, college, technologies })
    });
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  async fetchLeaderboard(period = 'all') {
    return this.request(`/leaderboard?period=${period}`);
  },

  async fetchDashboardData(userId) {
    return this.request(`/users/${userId}/dashboard`);
  },

  async fetchProjectedScore(userId) {
    return this.request(`/users/${userId}/projected`);
  },

  async fetchLogs() {
    return this.request('/logs');
  },

  async fetchQueries() {
    return this.request('/queries');
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
    return this.request('/auth/discord/verify', {
      method: 'POST',
      body: JSON.stringify({ code, state })
    });
  },

  async fetchUserIssues() {
    return this.request('/users/me/issues');
  },

  async fetchUserPRs() {
    return this.request('/users/me/prs');
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
    return fetch('config.json').then(res => res.json()).catch(() => ({}));
  },

  async fetchRepos() {
    return this.request('/repos');
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

  async fetchTagStats(userId) {
    return this.request(`/users/${userId}/tag-stats`);
  }
};
