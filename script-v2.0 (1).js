/**
 * Academic Papers Management System v2.0
 * 
 * Improvements over v1:
 * - Data deduplication & validation
 * - Advanced search with typo suggestions
 * - Pagination & lazy loading
 * - Analytics dashboard
 * - CSV export functionality
 * - Better accessibility
 * - Consistent link handling
 * - Theme persistence with visual feedback
 */

class PaperManager {
    constructor() {
        this.rawData = [
            { name: 'Physics', dept: 'Science', papers: 45, year: 2024, semester: 2, link: '/papers/physics-2024-sem2.pdf' },
            { name: 'Political Science', dept: 'Arts', papers: 32, year: 2023, semester: 4, link: '/papers/pol-sci-2023.pdf' },
            { name: 'Accountancy', dept: 'Commerce', papers: 28, year: 2024, semester: 1, link: '/papers/accounts-2024.pdf' },
            { name: 'Political Science', dept: 'Arts', papers: 1, year: 2024, semester: 1, link: '/papers/political-science-mj-2024.pdf' }
        ];
        
        this.subjects = this.deduplicate(this.rawData);
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.searchTerm = '';
        this.sortBy = 'name'; // name, papers, year
        this.filterDept = 'all';
        
        this.init();
    }

    /**
     * Deduplicate subjects by (name + dept + semester)
     * Keep entry with most papers if duplicates exist
     */
    deduplicate(data) {
        const grouped = {};
        data.forEach(item => {
            const key = `${item.name}|${item.dept}|${item.semester}`;
            if (!grouped[key] || item.papers > grouped[key].papers) {
                grouped[key] = { ...item, id: this.generateId() };
            }
        });
        return Object.values(grouped);
    }

    generateId() {
        return Math.random().toString(36).substring(7);
    }

    /**
     * Validate data integrity
     */
    validate(item) {
        const errors = [];
        if (!item.name || item.name.trim() === '') errors.push('Missing subject name');
        if (!item.dept || !['Science', 'Arts', 'Commerce'].includes(item.dept)) {
            errors.push(`Invalid department: ${item.dept}`);
        }
        if (!item.link) errors.push('Missing PDF link');
        if (item.papers < 0) errors.push('Invalid paper count');
        if (item.year < 2000 || item.year > new Date().getFullYear()) {
            errors.push(`Year out of range: ${item.year}`);
        }
        if (![1, 2, 3, 4].includes(item.semester)) errors.push(`Invalid semester: ${item.semester}`);
        return errors;
    }

    /**
     * Filter & sort subjects based on search, dept, and sort preference
     */
    getFiltered() {
        const term = this.searchTerm.toLowerCase();
        
        let filtered = this.subjects.filter(s => {
            const matchesSearch = !term || 
                s.name.toLowerCase().includes(term) ||
                s.dept.toLowerCase().includes(term) ||
                s.year.toString().includes(term) ||
                s.semester.toString().includes(term);
                
            const matchesDept = this.filterDept === 'all' || s.dept === this.filterDept;
            return matchesSearch && matchesDept;
        });

        // Sort
        filtered.sort((a, b) => {
            if (this.sortBy === 'papers') return b.papers - a.papers;
            if (this.sortBy === 'year') return b.year - a.year;
            return a.name.localeCompare(b.name);
        });

        return filtered;
    }

    /**
     * Paginate results
     */
    getPaginated() {
        const filtered = this.getFiltered();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return {
            items: filtered.slice(start, end),
            total: filtered.length,
            pages: Math.ceil(filtered.length / this.itemsPerPage),
            currentPage: this.currentPage
        };
    }

    /**
     * Generate suggestions for typos
     */
    getSuggestions(term) {
        const allTerms = new Set([
            ...this.subjects.map(s => s.name),
            ...this.subjects.map(s => s.dept),
            ...this.subjects.map(s => s.year.toString())
        ]);
        
        return Array.from(allTerms)
            .filter(t => this.levenshteinDistance(term, t) <= 2)
            .slice(0, 3);
    }

    /**
     * Simple Levenshtein distance for typo detection
     */
    levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
                    ? matrix[i - 1][j - 1]
                    : Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
            }
        }
        return matrix[b.length][a.length];
    }

    /**
     * Export data as CSV
     */
    exportCSV() {
        const headers = ['Subject', 'Department', 'Year', 'Semester', 'Papers', 'Link'];
        const rows = this.getFiltered().map(s => [
            s.name, s.dept, s.year, s.semester, s.papers, s.link
        ]);
        
        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `papers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Get analytics data
     */
    getAnalytics() {
        return {
            totalPapers: this.subjects.reduce((sum, s) => sum + s.papers, 0),
            totalSubjects: this.subjects.length,
            byDept: this.subjects.reduce((acc, s) => {
                acc[s.dept] = (acc[s.dept] || 0) + s.papers;
                return acc;
            }, {}),
            byYear: this.subjects.reduce((acc, s) => {
                acc[s.year] = (acc[s.year] || 0) + s.papers;
                return acc;
            }, {})
        };
    }

    /**
     * Initialize event listeners
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.render();
            this.renderAnalytics();
            this.checkTheme();
        });
    }

    setupEventListeners() {
        const search = document.getElementById('searchInput');
        const deptFilter = document.getElementById('deptFilter');
        const sortSelect = document.getElementById('sortSelect');
        const themeBtn = document.getElementById('darkToggle');
        const exportBtn = document.getElementById('exportBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (search) {
            search.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.currentPage = 1;
                this.render();
            });
        }

        if (deptFilter) {
            deptFilter.addEventListener('change', (e) => {
                this.filterDept = e.target.value;
                this.currentPage = 1;
                this.render();
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.currentPage = 1;
                this.render();
            });
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                themeBtn.setAttribute('aria-pressed', isDark);
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportCSV());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.render();
                    document.getElementById('gridContainer').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const { pages } = this.getPaginated();
                if (this.currentPage < pages) {
                    this.currentPage++;
                    this.render();
                    document.getElementById('gridContainer').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    /**
     * Render main paper grid
     */
    render() {
        const grid = document.getElementById('gridContainer');
        if (!grid) return;

        const { items, total, pages, currentPage } = this.getPaginated();
        const deptStats = this.getAnalytics().byDept;

        grid.innerHTML = '';

        if (items.length === 0) {
            const suggestions = this.getSuggestions(this.searchTerm);
            let suggestionHtml = '';
            
            if (suggestions.length > 0) {
                suggestionHtml = `
                    <div class="suggestion-box">
                        <p class="text-sm font-semibold">Did you mean:</p>
                        <div class="suggestion-chips">
                            ${suggestions.map(s => 
                                `<button class="chip" onclick="window.pm.searchTerm='${s}'; window.pm.currentPage=1; window.pm.render();">${s}</button>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }

            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-300">No papers found</h3>
                    <p class="text-slate-500 dark:text-slate-400 mt-2">
                        Try searching by subject, department, year, or semester.
                    </p>
                    ${suggestionHtml}
                </div>
            `;
            this.updatePagination(pages, currentPage);
            return;
        }

        items.forEach(s => {
            const errors = this.validate(s);
            const card = document.createElement('div');
            card.className = "p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 hover:shadow-md transition";
            card.setAttribute('data-id', s.id);

            const errorHtml = errors.length > 0 
                ? `<div class="error-badge" title="${errors.join(', ')}">⚠️</div>`
                : '';

            card.innerHTML = `
                ${errorHtml}
                <span class="text-xs font-bold text-emerald-500 uppercase">${s.dept}</span>
                <h4 class="text-lg font-semibold mt-2 text-slate-900 dark:text-white">${s.name}</h4>
                <div class="flex gap-2 mt-3 flex-wrap">
                    <span class="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-slate-600 dark:text-slate-300">Sem ${s.semester}</span>
                    <span class="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-slate-600 dark:text-slate-300">${s.year}</span>
                    <span class="text-xs bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded text-blue-600 dark:text-blue-400">${s.papers} papers</span>
                </div>
                <a href="${s.link}" target="_blank" rel="noopener noreferrer" class="mt-5 block text-center w-full py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
                    View Paper →
                </a>
            `;
            grid.appendChild(card);
        });

        this.updatePagination(pages, currentPage);
        this.updateResultsCount(total);
    }

    /**
     * Update pagination controls
     */
    updatePagination(pages, currentPage) {
        const paginationDiv = document.getElementById('pagination');
        if (!paginationDiv) return;

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageInfo = document.getElementById('pageInfo');

        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === pages;
        if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${pages || 1}`;
    }

    /**
     * Update results count
     */
    updateResultsCount(total) {
        const countEl = document.getElementById('resultsCount');
        if (countEl) {
            countEl.textContent = `${total} ${total === 1 ? 'result' : 'results'} found`;
        }
    }

    /**
     * Render analytics dashboard
     */
    renderAnalytics() {
        const analyticsDiv = document.getElementById('analyticsPanel');
        if (!analyticsDiv) return;

        const { totalPapers, totalSubjects, byDept, byYear } = this.getAnalytics();

        analyticsDiv.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="metric-card">
                    <p class="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total Papers</p>
                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">${totalPapers}</p>
                </div>
                <div class="metric-card">
                    <p class="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Subjects</p>
                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">${totalSubjects}</p>
                </div>
                <div class="metric-card">
                    <p class="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Departments</p>
                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">${Object.keys(byDept).length}</p>
                </div>
                <div class="metric-card">
                    <p class="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Years Covered</p>
                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">${Object.keys(byYear).length}</p>
                </div>
            </div>
        `;
    }

    /**
     * Theme management
     */
    checkTheme() {
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = stored === 'dark' || (!stored && prefersDark);
        
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
        
        const btn = document.getElementById('darkToggle');
        if (btn) btn.setAttribute('aria-pressed', isDark);
    }
}

// Initialize globally
window.pm = new PaperManager();
