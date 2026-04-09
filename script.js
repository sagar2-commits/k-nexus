const subjects = [
        { name: 'Physics', dept: 'Science', papers: 45 },
            { name: 'Political Science', dept: 'Arts', papers: 32 },
                { name: 'Accountancy', dept: 'Commerce', papers: 28 },
                    { name: 'Mathematics', dept: 'Science', papers: 50 },
                        { name: 'History', dept: 'Arts', papers: 12 }
                        ];

                        document.addEventListener('DOMContentLoaded', () => {
                            const grid = document.getElementById('gridContainer');
                                const search = document.getElementById('searchInput');
                                    const btn = document.getElementById('darkToggle');

                                        function render(filter = "") {
                                                if (!grid) return;
                                                        grid.innerHTML = "";
                                                                
                                                                        const filtered = subjects.filter(s => 
                                                                                    s.name.toLowerCase().includes(filter.toLowerCase())
                                                                                            );

                                                                                                    filtered.forEach(s => {
                                                                                                                const card = document.createElement('div');
                                                                                                                            card.className = "p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition cursor-pointer";
                                                                                                                                        card.innerHTML = `
                                                                                                                                                        <span class="text-xs font-bold uppercase tracking-wider text-emerald-500">${s.dept}</span>
                                                                                                                                                                        <h4 class="text-xl font-bold mt-1">${s.name}</h4>
                                                                                                                                                                                        <p class="text-sm text-slate-400 mt-4">${s.papers} Downloads Available</p>
                                                                                                                                                                                                        <button class="mt-4 text-[#4F46E5] font-semibold text-sm">View Papers →</button>
                                                                                                                                                                                                                    `;
                                                                                                                                                                                                                                grid.appendChild(card);
                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                if (search) {
                                                                                                                                                                                                                                                        search.addEventListener('input', (e) => render(e.target.value));
                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                if (btn) {
                                                                                                                                                                                                                                                                        btn.addEventListener('click', () => {
                                                                                                                                                                                                                                                                                    document.documentElement.classList.toggle('dark');
                                                                                                                                                                                                                                                                                                const isDark = document.documentElement.classList.contains('dark');
                                                                                                                                                                                                                                                                                                            localStorage.setItem('theme', isDark ? 'dark' : 'light');
                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                            render();
                                                                                                                                                                                                                                                                                                                                if (localStorage.getItem('theme') === 'dark') {
                                                                                                                                                                                                                                                                                                                                        document.documentElement.classList.add('dark');
                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                            
]