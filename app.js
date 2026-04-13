
app.js
/**
 * K-Nexus v2.0 - Advanced Previous Year Questions Platform
 * 
 * Key Improvements:
 * - Advanced filtering (semester, year, exam type, difficulty)
 * - User dashboard with upload history
 * - Community rating system
 * - Study session tracking
 * - Smart recommendations
 * - Analytics & insights
 * - Progressive Web App features
 * - Offline support with caching
 */
class KNexusApp {
    constructor() {
        // Data structure
        this.papers = [
            { 
                id: 1,
                name: 'Physics', 
                dept: 'Science',
                papers: 45, 
                year: 2024, 
                semester: 2, 
                examType: 'MJ',
                difficulty: 'medium',
                link: '/papers/physics-2024-sem2.pdf',
                uploadedBy: 'Admin',
                uploadDate: '2024-01-15',
                downloads: 324,
                rating: 4.5,
                reviews: 12,
                lastStudied: '2024-03-10'
            },
            { 
                id: 2,
                name: 'Political Science', 
                dept: 'Arts', 
                papers: 32, 
                year: 2023, 
                semester: 4, 
                examType: 'MN',
                difficulty: 'hard',
                link: '/papers/pol-sci-2023.pdf',
                uploadedBy: 'Admin',
                uploadDate: '2023-11-20',
                downloads: 156,
                rating: 4.2,
                reviews: 8,
                lastStudied: '2024-02-22'
            },
            { 
                id: 3,
                name: 'Accountancy', 
                dept: 'Commerce', 
                papers: 28, 
                year: 2024, 
                semester: 1, 
                examType: 'MDC',
                difficulty: 'easy',
                link: '/papers/accounts-2024.pdf',
                uploadedBy: 'Admin',
                uploadDate: '2024-02-05',
                downloads: 289,
                rating: 4.8,
                reviews: 15,
                lastStudied: '2024-03-15'
            },
            { 
                id: 4,
                name: 'Political Science', 
                dept: 'Arts', 
                papers: 40, 
                year: 2024, 
                semester: 1, 
                examType: 'MJ',
                difficulty: 'medium',
                link: '/papers/political-science-2024-sem1.pdf',
                uploadedBy: 'Admin',
                uploadDate: '2024-01-20',
                downloads: 210,
                rating: 4.3,
                reviews: 9,
                lastStudied: '2024-03-12'
            }

        ];
        this.userSession = {
            userId: this.generateUserId(),
            uploads: [],
            downloads: [],
            favorites: [],
            studySessions: [],
            preferences: {
                difficulty: 'all',
                examType: 'all',
                semester: 'all',
                year: 'all',
                sortBy: 'recent'
            }
        };
        this.stats = {
            totalViews: 0,
            totalDownloads: 0,
            activeUsers: 0,
            newPapers: 0
        };
        this.init();
    }
    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.renderPapers();
        this.renderDashboard();
        this.setupServiceWorker();
        this.renderAnalytics();
        this.startOfflineDetection();
    }
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Search
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.handleSearch(e.target.value);
                });
            }
            // Dark mode
            const darkToggle = document.getElementById('darkToggle');
            if (darkToggle) {
                darkToggle.addEventListener('click', () => this.toggleDarkMode());
            }
            // Filters
            const difficultyFilter = document.getElementById('difficultyFilter');
            if (difficultyFilter) {
                difficultyFilter.addEventListener('change', (e) => {
                    this.userSession.preferences.difficulty = e.target.value;
                    this.renderPapers();
                });
            }
            const examTypeFilter = document.getElementById('examTypeFilter');
            if (examTypeFilter) {
                examTypeFilter.addEventListener('change', (e) => {
                    this.userSession.preferences.examType = e.target.value;
                    this.renderPapers();
                });
            }
            const yearFilter = document.getElementById('yearFilter');
            if (yearFilter) {
                yearFilter.addEventListener('change', (e) => {
                    this.userSession.preferences.year = e.target.value;
                    this.renderPapers();
                });
            }
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    this.userSession.preferences.sortBy = e.target.value;
                    this.renderPapers();
                });
            }
            // Tab navigation
            document.querySelectorAll('[data-tab]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tab = e.target.dataset.tab;
                    this.switchTab(tab);
                });
            });
        });
    }
    /**
     * Handle search functionality with advanced filtering
     */
    handleSearch(term) {
        const filtered = this.papers.filter(p => {
            const matchesSearch = !term || 
                p.name.toLowerCase().includes(term.toLowerCase()) ||
                p.dept.toLowerCase().includes(term.toLowerCase()) ||
                p.examType.toLowerCase().includes(term.toLowerCase()) ||
                p.year.toString().includes(term);
            const matchesDifficulty = this.userSession.preferences.difficulty === 'all' || 
                p.difficulty === this.userSession.preferences.difficulty;
            const matchesExamType = this.userSession.preferences.examType === 'all' || 
                p.examType === this.userSession.preferences.examType;
            const matchesYear = this.userSession.preferences.year === 'all' || 
                p.year.toString() === this.userSession.preferences.year;
            return matchesSearch && matchesDifficulty && matchesExamType && matchesYear;
        });
        this.renderPapersFiltered(filtered);
    }
    /**
     * Render papers with filters applied
     */
    renderPapers() {
        const preferences = this.userSession.preferences;
        let filtered = this.papers;
        if (preferences.difficulty !== 'all') {
            filtered = filtered.filter(p => p.difficulty === preferences.difficulty);
        }
        if (preferences.examType !== 'all') {
            filtered = filtered.filter(p => p.examType === preferences.examType);
        }
        if (preferences.year !== 'all') {
            filtered = filtered.filter(p => p.year.toString() === preferences.year);
        }
        // Sort
        if (preferences.sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        } else if (preferences.sortBy === 'popular') {
            filtered.sort((a, b) => b.downloads - a.downloads);
        } else if (preferences.sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (preferences.sortBy === 'difficulty') {
            const diffOrder = { easy: 1, medium: 2, hard: 3 };
            filtered.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
        }
        this.renderPapersFiltered(filtered);
    }
    /**
     * Render filtered papers to grid
     */
    renderPapersFiltered(filtered) {
        const grid = document.getElementById('gridContainer');
        if (!grid) return;
        grid.innerHTML = '';
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <p class="text-xl text-slate-500 dark:text-slate-400">No papers found. Try adjusting your filters.</p>
                </div>
            `;
            return;
        }
        filtered.forEach(paper => {
            const card = this.createPaperCard(paper);
            grid.appendChild(card);
        });
        this.updateStats();
    }
    /**
     * Create individual paper card
     */
    createPaperCard(paper) {
        const card = document.createElement('div');
        card.className = 'glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700';
        card.dataset.paperId = paper.id;
        const difficultyColor = {
            easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
            medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
            hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
        };
        const examTypeColor = {
            MJ: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
            MN: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
            MDC: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
            SEC: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
        };
        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div>
                    <span class="inline-block ${examTypeColor[paper.examType]} px-3 py-1 rounded-full text-xs font-semibold mr-2">${paper.examType}</span>
                    <span class="inline-block ${difficultyColor[paper.difficulty]} px-3 py-1 rounded-full text-xs font-semibold">${paper.difficulty}</span>
                </div>
                <button class="opacity-0 group-hover:opacity-100 transition-opacity favorite-btn" data-id="${paper.id}" title="Add to favorites">❤️</button>
            </div>
            <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">${paper.name}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">${paper.dept}</p>
            <div class="flex gap-2 mb-4 flex-wrap">
                <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded"> ${paper.year}</span>
                <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded"> Sem ${paper.semester}</span>
                <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded"> ${paper.papers}</span>
            </div>
            <div class="flex items-center justify-between mb-4 text-sm">
                <div class="flex items-center gap-1">
                    <span class="text-yellow-400">⭐</span>
                    <span class="font-semibold">${paper.rating}</span>
                    <span class="text-slate-500 dark:text-slate-400">(${paper.reviews})</span>
                </div>
                <span class="text-slate-600 dark:text-slate-400"> ${paper.downloads}</span>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">By ${paper.uploadedBy} • ${this.formatDate(paper.uploadDate)}</p>
                <div class="flex gap-2">
                    <a href="${paper.link}" target="_blank" class="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-center text-sm font-semibold transition-colors">
                        Download
                    </a>
                    <button class="py-2 px-4 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors preview-btn" data-id="${paper.id}">
                        Preview
                    </button>
                </div>
            </div>
        `;
        // Event listeners
        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(paper.id);
        });
        card.querySelector('.preview-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.showPreview(paper);
        });
        return card;
    }
    /**
     * Render user dashboard
     */
    renderDashboard() {
        const dashboard = document.getElementById('userDashboard');
        if (!dashboard) return;
        const recentDownloads = this.userSession.downloads.slice(0, 5);
        const favoriteCount = this.userSession.favorites.length;
        const totalStudyTime = this.calculateStudyTime();
        dashboard.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">Downloads</p>
                    <p class="text-3xl font-bold text-indigo-600">${this.userSession.downloads.length}</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">Favorites</p>
                    <p class="text-3xl font-bold text-pink-600">${favoriteCount}</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">Study Time</p>
                    <p class="text-3xl font-bold text-green-600">${totalStudyTime}h</p>
                </div>
            </div>
            <div class="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 class="text-xl font-bold mb-4">Recent Downloads</h3>
                ${recentDownloads.length > 0 ? `
                    <div class="space-y-2">
                        ${recentDownloads.map(d => `
                            <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span>${d.name}</span>
                                <span class="text-sm text-slate-500">${this.formatDate(d.date)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-slate-500">No downloads yet. Start exploring papers!</p>'}
            </div>
        `;
    }
    /**
     * Render analytics section
     */
    renderAnalytics() {
        const analyticsDiv = document.getElementById('analyticsPanel');
        if (!analyticsDiv) return;
        const stats = this.getAnalytics();
        analyticsDiv.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Papers</p>
                    <p class="text-3xl font-bold text-indigo-600">${stats.totalPapers}</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">Departments</p>
                    <p class="text-3xl font-bold text-emerald-600">${stats.departments}</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Downloads</p>
                    <p class="text-3xl font-bold text-pink-600">${stats.totalDownloads}</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">Avg Rating</p>
                    <p class="text-3xl font-bold text-yellow-600">${stats.avgRating.toFixed(1)}</p>
                </div>
            </div>
        `;
    }
    /**
     * Get analytics data
     */
    getAnalytics() {
        const totalDownloads = this.papers.reduce((sum, p) => sum + p.downloads, 0);
        const avgRating = this.papers.reduce((sum, p) => sum + p.rating, 0) / this.papers.length;
        const departments = new Set(this.papers.map(p => p.dept)).size;
        const totalPapers = this.papers.reduce((sum, p) => sum + p.papers, 0);
        return {
            totalPapers,
            totalDownloads,
            avgRating,
            departments
        };
    }
    /**
     * Toggle favorite
     */
    toggleFavorite(paperId) {
        const index = this.userSession.favorites.indexOf(paperId);
        if (index > -1) {
            this.userSession.favorites.splice(index, 1);
        } else {
            this.userSession.favorites.push(paperId);
        }
        this.saveToLocalStorage();
    }
    /**
     * Show paper preview
     */
    showPreview(paper) {
        const modal = document.getElementById('previewModal');
        if (!modal) {
            this.createPreviewModal(paper);
        } else {
            modal.innerHTML = `
                <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-80vh overflow-y-auto">
                        <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 class="text-2xl font-bold">${paper.name}</h2>
                            <button class="text-2xl hover:opacity-70" onclick="this.closest('div').parentElement.remove()">✕</button>
                        </div>
                        <div class="p-6">
                            <iframe src="${paper.link}" class="w-full h-96 rounded-lg"></iframe>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }
    /**
     * Switch tabs
     */
    switchTab(tab) {
        document.querySelectorAll('[data-tab-content]').forEach(el => {
            el.classList.add('hidden');
        });
        document.getElementById(`${tab}-content`)?.classList.remove('hidden');
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.classList.remove('bg-indigo-600', 'text-white');
            btn.classList.add('bg-slate-100', 'text-slate-900', 'dark:bg-slate-700', 'dark:text-white');
        });
        event.target.classList.remove('bg-slate-100', 'text-slate-900', 'dark:bg-slate-700');
        event.target.classList.add('bg-indigo-600', 'text-white');
    }
    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        const html = document.documentElement;
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    }
    /**
     * Calculate total study time
     */
    calculateStudyTime() {
        return this.userSession.studySessions.reduce((sum, session) => sum + session.duration, 0);
    }
    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    }
    /**
     * Save to localStorage
     */
    saveToLocalStorage() {
        localStorage.setItem('knexus-user-session', JSON.stringify(this.userSession));
    }
        /**
         *      * Load user session from localStorage
              */
                  loadFromLocalStorage() {
                          const saved = localStorage.getItem('knexus-user-session');
                                  if (saved) {
                                              this.userSession = JSON.parse(saved);
                                                      }
                                                          }

                                                              /**
                                                                   * Generate a unique user ID
                                                                        */
                                                                            generateUserId() {
                                                                                    return 'user-' + Math.random().toString(36).substr(2, 9);
                                                                                        }

                                                                                            /**
                                                                                                 * Placeholder methods to prevent initialization errors
                                                                                                      */
                                                                                                          setupServiceWorker() {
                                                                                                                  console.log("Service Worker initialization logic goes here.");
                                                                                                                      }

                                                                                                                          startOfflineDetection() {
                                                                                                                                  window.addEventListener('online', () => console.log('Back online!'));
                                                                                                                                          window.addEventListener('offline', () => console.log('Connection lost.'));
                                                                                                                                              }

                                                                                                                                                  updateStats() {
                                                                                                                                                          // Optional logic to update UI counters
                                                                                                                                                              }
                                                                                                                                                              } // <--- This final curly brace closes the entire class

window.addEventListener('DOMContentLoaded', () => {
    if (typeof KNexusApp !== 'undefined') {
        new KNexusApp();
    }
});
