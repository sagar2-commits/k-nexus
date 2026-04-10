const subjects = [
        { name: 'Physics', dept: 'Science', papers: 45, year: 2024, semester: 2 },
            { name: 'Political Science', dept: 'Arts', papers: 32, year: 2023, semester: 4 },
                { name: 'Accountancy', dept: 'Commerce', papers: 28, year: 2024, semester: 1 }, { 
                                name: 'Physics', 
                                        dept: 'Science', 
                                                papers: 45, 
                                                        year: 2024, 
                                                                semester: 2,
                                                                        link: '/papers/physics-2024-sem2.pdf' // Add the link here
                                                                            },     { 
                                                                                        name: 'Political Science', 
                                                                                                dept: 'Arts', 
                                                                                                        papers: 1, 
                                                                                                                year: 2024, 
                                                                                                                        semester: 1, 
                                                                                                                                link: 'papers/political-science-mj-2024.pdf' 
                                                                                                                                    },
                                                                            
                                                                        // ... other subjects
                
                    // Add more here as you get uploads...
                    ];

                        document.addEventListener('DOMContentLoaded', () => {
                            const grid = document.getElementById('gridContainer');
                                const search = document.getElementById('searchInput');
                                    const btn = document.getElementById('darkToggle');

                                        function render(filter = "") {
                                                if (!grid) return;
                                                        grid.innerHTML = "";
                                                                if (filtered.length === 0) {
                                                                        grid.innerHTML = `
                                                                                <div class="col-span-full text-center py-10">
                                                                                            <p class="text-slate-500 text-lg">No papers found for "${filter}"</p>
                                                                                                        <p class="text-sm text-indigo-500 mt-2">Try searching by Semester or Year instead.</p>
                                                                                                                </div>
                                                                                                                    `;
                                                                                                                        return;
                                                                                                                        }

                                                                }
                                                                        
                                                                
                                                                                            const filtered = subjects.filter(s => {
                                                                                                    const term = filter.toLowerCase();
                                                                                                        return (
                                                                                                                s.name.toLowerCase().includes(term) ||
                                                                                                                        s.dept.toLowerCase().includes(term) ||
                                                                                                                                (s.year && s.year.toString().includes(term)) ||
                                                                                                                                        (s.semester && s.semester.toString().includes(term))
                                                                                                                                            );
                                                                                                                                            });

                                                                                            })
                                                                                                    console.log(filtered);filteredforEach(s => {
                                                                                                            const card = document.createElement('div');
                                                                                                                card.className = "p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-700";
                                                                                                                    
                                                                                                                        // Use backticks (`) for the innerHTML
                                                                                                                            card.innerHTML = `
                                                                                                                                    <span class="text-xs font-bold text-emerald-500 uppercase">${s.dept}</span>
                                                                                                                                            <h4 class="text-xl font-bold mt-1">${s.name}</h4>
                                                                                                                                            <a href="${s.link}" target="_blank" class="mt-4 block text-center w-full py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition">
                                                                                                                                                View Paper →
                                                                                                                                                </a>

                                                                                                                                                            <div class="flex gap-2 mt-2">
                                                                                                                                                                <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">Sem ${s.semester}</span>
                                                                                                                                                                            <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">${s.year}</span>
                                                                                                                                                                                    </div>
                                                                                                                                                                                            <p class="text-sm text-slate-400 mt-3">${s.papers} Papers Available</p>
                                                                                                                                                                                                    <button class="mt-4 w-full py-2 bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 transition">
                                                                                                                                                                                                                View Papers →
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                            `;
                                                                                                                                                                                                                                
                                                                                                                                                                                                                                    grid.appendChild(card);
                                                                                                                                                                                                                                    });

                                                                                                    

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
                                                                                                                                                                                                                                                                                                                                            ;

