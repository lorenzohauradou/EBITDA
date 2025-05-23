// Database dei progetti (simulato con localStorage)
let projects = JSON.parse(localStorage.getItem('ebitda_projects')) || [];
let taskIdCounter = parseInt(localStorage.getItem('task_counter')) || 1;
let modalTaskCounter = 1; // Contatore per i task nel modal
let isProgressExpanded = false; // Stato espansione progress bar

// Definizione delle milestone di fatturato
const milestones = [
    { target: 1000, name: "Primo Obiettivo", icon: "🎯", color: "from-blue-500 to-indigo-600" },
    { target: 3000, name: "Decollo", icon: "🚀", color: "from-green-500 to-emerald-600" },
    { target: 5000, name: "Qualità", icon: "💎", color: "from-purple-500 to-indigo-600" },
    { target: 10000, name: "Campione", icon: "🏆", color: "from-yellow-500 to-orange-600" },
    { target: 20000, name: "Maestro", icon: "👑", color: "from-red-500 to-pink-600" },
    { target: 50000, name: "Stella", icon: "🌟", color: "from-indigo-500 to-purple-600" },
    { target: 100000, name: "Leggenda", icon: "⭐", color: "from-gradient-to-r from-yellow-400 via-red-500 to-pink-500" }
];

// Dati di esempio iniziali
if (projects.length === 0) {
    taskIdCounter = 1;
    saveData();
}

// Salvataggio dati nel localStorage
function saveData() {
    localStorage.setItem('ebitda_projects', JSON.stringify(projects));
    localStorage.setItem('task_counter', taskIdCounter.toString());
}

// Funzione per verificare se un progetto è completato
function isProjectCompleted(project) {
    return project.tasks.length > 0 && project.tasks.every(task => task.completed);
}

// Toggle collapse della card progetto
function toggleProjectCollapse(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.isCollapsed = !project.isCollapsed;
        saveData();
        renderProjects();
    }
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    renderProjects();
    updateAnalytics();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const projectForm = document.getElementById('project-form');
    const projectModal = document.getElementById('project-modal');
    
    if (projectForm) {
        projectForm.addEventListener('submit', createProject);
    } else {
        console.error('❌ Form non trovato!');
    }
    
    // Chiudi modal cliccando fuori
    if (projectModal) {
        projectModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    } else {
        console.error('❌ Modal non trovato!');
    }
}

// Helper function per formattazione sicura
function safeFormat(value, defaultValue = 0) {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
}

function safeCurrency(value, defaultValue = 0) {
    const num = safeFormat(value, defaultValue);
    return `€${num.toLocaleString()}`;
}

// Rendering dei progetti
function renderProjects() {
    const container = document.getElementById('projects-container');
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="text-4xl mb-4 text-blue-500">
                    <i class="fas fa-rocket"></i>
                </div>
                <p class="text-lg font-semibold text-gray-700 mb-2">Inizia il tuo primo progetto!</p>
                <p class="text-gray-500">Crea un nuovo progetto per iniziare a tracciare i guadagni</p>
            </div>
        `;
        return;
    }
    
    // Separa progetti attivi e completati
    const activeProjects = projects.filter(project => !isProjectCompleted(project));
    const completedProjects = projects.filter(project => isProjectCompleted(project));
    
    // Ordina progetti attivi: i più recenti in alto
    activeProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Ordina progetti completati: i più vecchi completati in fondo
    completedProjects.sort((a, b) => {
        const aCompletedAt = a.completedAt || a.createdAt;
        const bCompletedAt = b.completedAt || b.createdAt;
        return new Date(aCompletedAt) - new Date(bCompletedAt);
    });
    
    // Combina: progetti attivi in alto, completati in fondo
    const sortedProjects = [...activeProjects, ...completedProjects];
    
    container.innerHTML = sortedProjects.map(project => {
        // Validazione sicura dei dati del progetto
        const safeProject = {
            ...project,
            payment: safeFormat(project.payment, 0),
            tasks: project.tasks || []
        };
        
        const completedTasks = safeProject.tasks.filter(task => task.completed).length;
        const totalTasks = safeProject.tasks.length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const earnedRevenue = safeProject.tasks.filter(task => task.completed).reduce((sum, task) => sum + safeFormat(task.value, 0), 0);
        const isCompleted = isProjectCompleted(safeProject);
        const isCollapsed = safeProject.isCollapsed || false;
        const remainingRevenue = safeProject.payment - earnedRevenue;
        
        return `
            <div class="project-card p-6 ${isCompleted ? 'border-slate-300 bg-slate-50' : ''}">
                <div class="flex justify-between items-start mb-6 mobile-project-header">
                    <div class="flex-1">
                        <div class="flex items-center mb-3">
                            <div class="w-3 h-3 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-blue-400'} mr-3"></div>
                            <div class="flex-1">
                                <h3 class="text-xl font-bold ${isCompleted ? 'text-slate-700' : 'text-gray-800'}">
                                    ${safeProject.title || 'Progetto senza titolo'}
                                </h3>
                                ${isCompleted ? '<span class="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">COMPLETATO</span>' : ''}
                            </div>
                        </div>
                        <p class="text-gray-600 mb-4">${safeProject.description || ''}</p>
                        
                        <div class="grid grid-cols-3 gap-4 text-xs mobile-stats-grid">
                            <div>
                                <span class="text-gray-500 block mb-1">BUDGET</span>
                                <div class="text-blue-600 font-bold">${safeCurrency(safeProject.payment)}</div>
                            </div>
                            <div>
                                <span class="text-gray-500 block mb-1">PROGRESS</span>
                                <div class="${isCompleted ? 'text-emerald-600' : 'text-gray-800'} font-bold">${completedTasks}/${totalTasks}</div>
                            </div>
                            <div>
                                <span class="text-gray-500 block mb-1">COMPLETION</span>
                                <div class="${isCompleted ? 'text-emerald-600' : 'text-purple-600'} font-bold">${progressPercentage.toFixed(0)}%</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2 ml-4 mobile-project-actions">
                        <button onclick="toggleProjectCollapse(${safeProject.id})" class="p-2 ${isCollapsed ? 'text-gray-400' : 'text-blue-500'} hover:bg-gray-100 rounded-full transition-colors" title="${isCollapsed ? 'Espandi' : 'Riduci'}">
                            <i class="fas ${isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}"></i>
                        </button>
                        ${!isCompleted && totalTasks > 0 ? `<button onclick="toggleAllTasks(${safeProject.id})" class="p-2 text-purple-500 hover:bg-purple-50 rounded-full transition-colors" title="Completa tutti i task">
                            <i class="fas fa-check-double"></i>
                        </button>` : ''}
                        ${!isCompleted ? `<button onclick="addTask(${safeProject.id})" class="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors" title="Aggiungi Task">
                            <i class="fas fa-plus"></i>
                        </button>` : ''}
                        <button onclick="deleteProject(${safeProject.id})" class="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors" title="Elimina">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Progress bar del progetto -->
                <div class="mb-4">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="progress-bar h-2 rounded-full transition-all duration-500" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
                
                <!-- Lista task (nascosta se collassata) -->
                ${!isCollapsed ? `
                <div class="space-y-3 mb-6">
                    ${safeProject.tasks.map(task => `
                        <div class="task-item p-4 mobile-task-item ${ 
                            task.completed 
                            ? 'bg-slate-50 border-slate-200' 
                            : ''
                        }">
                            <div class="flex items-center justify-between mobile-task-actions">
                                <div class="flex items-center space-x-3">
                                    <button onclick="toggleTask(${safeProject.id}, ${task.id})" class="flex-shrink-0">
                                        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${ 
                                            task.completed 
                                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                                            : 'border-gray-300 hover:border-blue-400'
                                        }">
                                            ${task.completed ? '<i class="fas fa-check text-xs"></i>' : ''}
                                        </div>
                                    </button>
                                    <span class="font-medium ${ 
                                        task.completed 
                                        ? 'text-slate-600 line-through' 
                                        : 'text-gray-800'
                                    }">
                                        ${task.title || 'Task senza titolo'}
                                    </span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${ 
                                        task.completed 
                                        ? 'bg-slate-100 text-slate-700' 
                                        : 'bg-blue-100 text-blue-700'
                                    }">
                                        ${safeCurrency(task.value)}
                                    </span>
                                    <button onclick="deleteTask(${safeProject.id}, ${task.id})" class="p-1 text-red-400 hover:text-red-600 transition-colors">
                                        <i class="fas fa-times text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>` : ''}
                
                <!-- Riepilogo guadagni -->
                <div class="pt-4 border-t border-gray-200">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div class="text-sm text-gray-600 mb-1">Guadagnato</div>
                            <div class="text-lg font-bold text-emerald-600">${safeCurrency(earnedRevenue)}</div>
                        </div>
                        <div class="text-center p-3 ${isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-gray-50 border-gray-200'} rounded-lg border">
                            <div class="text-sm text-gray-600 mb-1">${isCompleted ? 'Completato!' : 'Rimanente'}</div>
                            <div class="text-lg font-bold ${isCompleted ? 'text-slate-600' : 'text-gray-700'}">${safeCurrency(remainingRevenue)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle task completion
function toggleTask(projectId, taskId) {
    const project = projects.find(p => p.id === projectId);
    const task = project.tasks.find(t => t.id === taskId);
    
    task.completed = !task.completed;
    
    // Animazione del task
    const taskElement = event.target.closest('.flex.items-center.justify-between');
    if (taskElement) {
        taskElement.classList.add('task-completed');
        setTimeout(() => taskElement.classList.remove('task-completed'), 600);
    }
    
    // Controlla se il progetto è stato appena completato
    const wasCompleted = isProjectCompleted(project);
    
    // Se il progetto è appena stato completato, aggiungi la data di completamento
    if (task.completed && wasCompleted && !project.completedAt) {
        project.completedAt = new Date().toISOString();
    }
    
    // Se il progetto è stato de-completato, rimuovi la data di completamento
    if (!wasCompleted && project.completedAt) {
        delete project.completedAt;
    }
    
    // Aggiungi alla recent activity
    addToRecentActivity(
        task.completed ? 'completed' : 'uncompleted',
        task.title,
        project.title,
        task.value
    );
    
    saveData();
    renderProjects();
    updateAnalytics();
    
    // Se il progetto è stato appena completato, celebra e collassa dopo delay
    if (task.completed && wasCompleted) {
        setTimeout(() => {
            celebrateCompletion();
            // Automaticamente collassa il progetto completato dopo la celebrazione
            setTimeout(() => {
                project.isCollapsed = true;
                saveData();
                renderProjects();
            }, 2000);
        }, 500);
    }
    
    // Effetto sonoro simulato con vibrazione (se supportato)
    if (navigator.vibrate && task.completed) {
        navigator.vibrate(50);
    }
}

// Toggle all tasks completion
function toggleAllTasks(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Controlla se tutti i task sono già completati
    const allCompleted = project.tasks.every(task => task.completed);
    
    // Se tutti sono completati, li decompletia, altrimenti li completa tutti
    const newStatus = !allCompleted;
    
    project.tasks.forEach(task => {
        task.completed = newStatus;
        
        // Aggiungi alla recent activity solo per il primo e ultimo task per non spammare
        if (task === project.tasks[0] || task === project.tasks[project.tasks.length - 1]) {
            addToRecentActivity(
                newStatus ? 'completed' : 'uncompleted',
                task.title,
                project.title,
                task.value
            );
        }
    });
    
    // Gestisci la data di completamento
    if (newStatus && isProjectCompleted(project) && !project.completedAt) {
        project.completedAt = new Date().toISOString();
    } else if (!newStatus && project.completedAt) {
        delete project.completedAt;
    }
    
    // Se ha completato tutti i task, celebra
    if (newStatus && isProjectCompleted(project)) {
        setTimeout(() => {
            celebrateCompletion();
            // Automaticamente collassa il progetto completato dopo la celebrazione
            setTimeout(() => {
                project.isCollapsed = true;
                saveData();
                renderProjects();
            }, 2000);
        }, 500);
    }
    
    saveData();
    renderProjects();
    updateAnalytics();
    
    // Feedback visivo
    if (navigator.vibrate) {
        navigator.vibrate(newStatus ? [50, 50, 50] : 100);
    }
}

// Aggiorna analytics
function updateAnalytics() {
    console.log('📊 Aggiornamento analytics...');
    
    const totalRevenue = projects.reduce((sum, project) => {
        return sum + project.tasks.filter(task => task.completed).reduce((taskSum, task) => taskSum + task.value, 0);
    }, 0);
    
    const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);
    const completedTasks = projects.reduce((sum, project) => sum + project.tasks.filter(task => task.completed).length, 0);
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Distingui progetti attivi da quelli completati
    const completedProjects = projects.filter(project => isProjectCompleted(project)).length;
    const activeProjects = projects.length - completedProjects; // Solo progetti non completati
    const totalProjects = projects.length; // Tutti i progetti
    
    const avgRevenue = totalProjects > 0 ? totalRevenue / totalProjects : 0;
    
    const efficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    console.log('📈 Analytics data:', { totalRevenue, completedTasks, activeProjects, avgRevenue, efficiency });
    
    // Animazione aggiornamento revenue con controllo sicuro
    const revenueElement = document.getElementById('total-revenue');
    if (revenueElement) {
        revenueElement.classList.add('revenue-update');
        setTimeout(() => revenueElement.classList.remove('revenue-update'), 800);
    }
    
    // Aggiorna i valori con controlli sicuri
    const safeUpdate = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn(`⚠️ Elemento ${id} non trovato`);
        }
    };
    
    safeUpdate('total-revenue', `€${totalRevenue.toLocaleString()}`);
    safeUpdate('completed-tasks', completedTasks);
    safeUpdate('active-projects', activeProjects);
    safeUpdate('avg-revenue', `€${Math.round(avgRevenue).toLocaleString()}`);
    safeUpdate('total-completed', completedTasks);
    safeUpdate('completed-projects', completedProjects);
    safeUpdate('efficiency', `${efficiency}%`);
    safeUpdate('total-tasks', totalTasks);
    
    console.log('✅ Analytics aggiornati');
    
    // Aggiorna milestone progress
    updateMilestoneProgress(totalRevenue);
}

// Aggiorna il progresso delle milestone
function updateMilestoneProgress(totalRevenue) {
    console.log('🎯 Aggiornamento milestone progress...', totalRevenue);
    
    // Verifica che tutti gli elementi esistano prima di procedere
    const requiredElements = [
        'current-milestone-target',
        'current-milestone-name', 
        'milestone-progress-text',
        'milestone-progress-bar',
        'completed-milestones',
        'remaining-to-next'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('❌ Elementi milestone mancanti:', missingElements);
        return;
    }
    
    // Trova la milestone corrente (prossima da raggiungere)
    const currentMilestone = milestones.find(milestone => totalRevenue < milestone.target) || milestones[milestones.length - 1];
    const completedMilestones = milestones.filter(milestone => totalRevenue >= milestone.target).length;
    
    // Calcola il progresso verso la milestone corrente
    const previousMilestone = milestones[milestones.indexOf(currentMilestone) - 1];
    const baseAmount = previousMilestone ? previousMilestone.target : 0;
    const progressToCurrentMilestone = Math.min(totalRevenue - baseAmount, currentMilestone.target - baseAmount);
    const progressPercentage = Math.max(0, (progressToCurrentMilestone / (currentMilestone.target - baseAmount)) * 100);
    
    console.log('📊 Milestone data:', { currentMilestone, completedMilestones, progressPercentage });
    
    // Aggiorna vista compatta con controlli sicuri
    const targetElement = document.getElementById('current-milestone-target');
    const nameElement = document.getElementById('current-milestone-name');
    const progressTextElement = document.getElementById('milestone-progress-text');
    const progressBarElement = document.getElementById('milestone-progress-bar');
    const completedElement = document.getElementById('completed-milestones');
    const remainingElement = document.getElementById('remaining-to-next');
    
    if (targetElement) targetElement.textContent = `€${currentMilestone.target.toLocaleString()}`;
    if (nameElement) nameElement.textContent = currentMilestone.name;
    if (progressTextElement) progressTextElement.textContent = `€${totalRevenue.toLocaleString()} / €${currentMilestone.target.toLocaleString()}`;
    
    if (progressBarElement) {
        progressBarElement.style.width = `${progressPercentage}%`;
        progressBarElement.className = `bg-gradient-to-r ${currentMilestone.color} h-3 rounded-full transition-all duration-800 flex items-center justify-end pr-2`;
    }
    
    // Aggiorna statistiche
    if (completedElement) completedElement.textContent = completedMilestones;
    if (remainingElement) remainingElement.textContent = `€${(currentMilestone.target - totalRevenue).toLocaleString()}`;
    
    console.log('✅ Milestone progress aggiornato');
    
    // Se la vista è espansa, aggiorna anche quella
    if (isProgressExpanded) {
        renderExpandedMilestones(totalRevenue);
    }
}

// Toggle espansione progress bar
function toggleProgressExpansion() {
    isProgressExpanded = !isProgressExpanded;
    
    const compactView = document.getElementById('progress-compact');
    const expandedView = document.getElementById('progress-expanded');
    
    if (isProgressExpanded) {
        compactView.classList.add('hidden');
        expandedView.classList.remove('hidden');
        expandedView.classList.add('expand-animation');
        
        // Calcola revenue totale per il rendering
        const totalRevenue = projects.reduce((sum, project) => {
            return sum + project.tasks.filter(task => task.completed).reduce((taskSum, task) => taskSum + task.value, 0);
        }, 0);
        
        renderExpandedMilestones(totalRevenue);
    } else {
        expandedView.classList.add('hidden');
        compactView.classList.remove('hidden');
    }
}

// Renderizza vista espansa delle milestone
function renderExpandedMilestones(totalRevenue) {
    const container = document.getElementById('milestones-container');
    
    container.innerHTML = milestones.map((milestone, index) => {
        const isCompleted = totalRevenue >= milestone.target;
        const previousMilestone = index > 0 ? milestones[index - 1] : { target: 0 };
        const progressToThisMilestone = Math.min(totalRevenue - previousMilestone.target, milestone.target - previousMilestone.target);
        const progressPercentage = Math.max(0, (progressToThisMilestone / (milestone.target - previousMilestone.target)) * 100);
        
        return `
            <div class="milestone-item p-4 bg-white rounded-lg border transition-all duration-200 ${
                isCompleted 
                ? 'border-green-300 bg-green-50' 
                : totalRevenue >= previousMilestone.target 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-200'
            }">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${milestone.icon}</div>
                        <div>
                            <div class="font-bold ${isCompleted ? 'text-green-700' : 'text-gray-800'}">
                                ${milestone.name}
                            </div>
                            <div class="text-sm text-gray-500">€${milestone.target.toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        ${isCompleted 
                            ? '<div class="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">✅ Completato</div>' 
                            : `<div class="text-lg font-bold text-blue-600">${progressPercentage.toFixed(0)}%</div>`
                        }
                    </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="progress-bar h-2 rounded-full transition-all duration-300" 
                         style="width: ${isCompleted ? 100 : progressPercentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Aggiungi alla recent activity
function addToRecentActivity(action, taskTitle, projectTitle, value) {
    const activityContainer = document.getElementById('recent-activity');
    const timestamp = new Date().toLocaleTimeString();
    
    const actionText = action === 'completed' ? 'completato' : 'riaperto';
    const actionIcon = action === 'completed' ? '✅' : '🔄';
    
    const activityHtml = `
        <div class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-sm">
            <div class="flex-shrink-0 text-lg">
                ${actionIcon}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">
                    ${taskTitle}
                </p>
                <p class="text-xs text-gray-500">
                    ${projectTitle} • €${value} • ${timestamp}
                </p>
            </div>
        </div>
    `;
    
    // Inserisci in cima e mantieni solo le ultime 5 attività
    activityContainer.innerHTML = activityHtml + activityContainer.innerHTML;
    const activities = activityContainer.children;
    if (activities.length > 5) {
        for (let i = 5; i < activities.length; i++) {
            activities[i].remove();
        }
    }
    
    // Rimuovi il placeholder se presente
    const placeholder = activityContainer.querySelector('p.text-gray-500');
    if (placeholder && placeholder.textContent.includes('Nessuna attività recente')) {
        placeholder.remove();
    }
}

// Modal functions
function addNewProject() {
    const modal = document.getElementById('project-modal');
    const titleInput = document.getElementById('project-title');
    
    if (!modal) {
        console.error('❌ Modal non trovato!');
        return;
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Reset e inizializza con task predefiniti
    resetModalTasks();
    addDefaultTasksToModal();
    
    if (titleInput) {
        titleInput.focus();
    }
}

function closeModal() {
    document.getElementById('project-modal').classList.add('hidden');
    document.getElementById('project-modal').classList.remove('flex');
    document.getElementById('project-form').reset();
    modalTaskCounter = 1;
}

// Reset task nel modal
function resetModalTasks() {
    document.getElementById('modal-tasks-container').innerHTML = '';
    modalTaskCounter = 1;
}

// Aggiungi task predefiniti al modal
function addDefaultTasksToModal() {
    const defaultTasks = [
        { title: "Pianificazione iniziale", percentage: 10 },
        { title: "Sviluppo principale", percentage: 60 },
        { title: "Testing e revisioni", percentage: 20 },
        { title: "Consegna finale", percentage: 10 }
    ];
    
    defaultTasks.forEach(task => {
        addTaskToModal(task.title, task.percentage);
    });
}

// Aggiungi task al modal
function addTaskToModal(title = '', percentage = '') {
    const taskId = modalTaskCounter++;
    const taskHtml = `
        <div class="flex items-center space-x-3 p-3 task-item" data-task-id="${taskId}">
            <div class="flex-1">
                <input type="text" 
                       placeholder="Nome del task" 
                       value="${title}"
                       class="w-full px-3 py-2 custom-input text-gray-800" 
                       data-task-title>
            </div>
            <div class="w-16">
                <input type="number" 
                       placeholder="%" 
                       value="${percentage}"
                       min="0" 
                       max="100"
                       class="w-full px-2 py-2 custom-input text-gray-800 text-center text-sm" 
                       data-task-percentage
                       oninput="updateTaskValue(${taskId})">
            </div>
            <div class="w-20 text-center">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold" data-task-value>
                    €0
                </span>
            </div>
            <button type="button" onclick="removeTaskFromModal(${taskId})" class="p-1 text-red-400 hover:text-red-600 transition-colors">
                <i class="fas fa-times text-sm"></i>
            </button>
        </div>
    `;
    
    document.getElementById('modal-tasks-container').insertAdjacentHTML('beforeend', taskHtml);
    
    // Calcola il valore iniziale
    setTimeout(() => updateTaskValue(taskId), 10);
}

// Aggiorna il valore del task in base alla percentuale
function updateTaskValue(taskId) {
    const payment = parseInt(document.getElementById('project-payment').value) || 0;
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    
    if (taskElement) {
        const percentageInput = taskElement.querySelector('[data-task-percentage]');
        const valueDisplay = taskElement.querySelector('[data-task-value]');
        
        const percentage = parseFloat(percentageInput.value) || 0;
        const value = Math.round(payment * (percentage / 100));
        
        valueDisplay.textContent = `€${value.toLocaleString()}`;
    }
}

// Aggiorna tutti i valori dei task quando cambia il pagamento totale
function updateAllTaskValues() {
    const taskElements = document.querySelectorAll('#modal-tasks-container > div');
    taskElements.forEach(taskElement => {
        const taskId = taskElement.getAttribute('data-task-id');
        if (taskId) {
            updateTaskValue(parseInt(taskId));
        }
    });
}

// Rimuovi task dal modal
function removeTaskFromModal(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.remove();
    }
}

// Crea nuovo progetto con task personalizzati
function createProject(e) {
    e.preventDefault();
    
    const title = document.getElementById('project-title').value;
    const payment = parseInt(document.getElementById('project-payment').value) || 100;
    const description = document.getElementById('project-description').value;
    
    // Raccogli i task dal modal
    const taskElements = document.querySelectorAll('#modal-tasks-container > div');
    
    const tasks = [];
    let totalPercentage = 0;
    
    taskElements.forEach((taskElement, index) => {
        const titleInput = taskElement.querySelector('[data-task-title]');
        const percentageInput = taskElement.querySelector('[data-task-percentage]');
        
        const taskTitle = titleInput?.value?.trim();
        let taskPercentage = parseFloat(percentageInput?.value) || 0;
        
        if (taskTitle) {
            tasks.push({
                title: taskTitle,
                percentage: taskPercentage
            });
            totalPercentage += taskPercentage;
        }
    });
    
    // Se non ci sono task, aggiungi quelli predefiniti
    if (tasks.length === 0) {
        tasks.push(
            { title: "Pianificazione iniziale", percentage: 10 },
            { title: "Sviluppo principale", percentage: 60 },
            { title: "Testing e revisioni", percentage: 20 },
            { title: "Consegna finale", percentage: 10 }
        );
        totalPercentage = 100;
    }
    
    // Se le percentuali non sommano a 100, ridistribuisci automaticamente
    if (totalPercentage !== 100) {
        const equalPercentage = 100 / tasks.length;
        tasks.forEach(task => {
            task.percentage = equalPercentage;
        });
    }
    
    // Crea i task con i valori calcolati
    const projectTasks = tasks.map(task => ({
        id: taskIdCounter++,
        title: task.title,
        completed: false,
        value: Math.round(payment * (task.percentage / 100))
    }));
    
    const newProject = {
        id: Date.now(),
        title: title || 'Nuovo Progetto',
        payment,
        description,
        tasks: projectTasks,
        createdAt: new Date().toISOString(),
        isCollapsed: false
    };
    
    projects.push(newProject);
    
    saveData();
    renderProjects();
    updateAnalytics();
    closeModal();
    
    console.log('🎉 Progetto creato:', newProject.title);
    
    // Scroll verso il nuovo progetto
    setTimeout(() => {
        const container = document.getElementById('projects-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, 100);
}

// Elimina progetto
function deleteProject(projectId) {
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
        projects = projects.filter(p => p.id !== projectId);
        saveData();
        renderProjects();
        updateAnalytics();
    }
}

// Aggiungi task
function addTask(projectId) {
    const taskTitle = prompt('Inserisci il titolo del nuovo task:');
    if (!taskTitle) return;
    
    const taskValue = prompt('Inserisci il valore del task (€):');
    if (!taskValue || isNaN(taskValue)) return;
    
    const project = projects.find(p => p.id === projectId);
    project.tasks.push({
        id: taskIdCounter++,
        title: taskTitle,
        completed: false,
        value: parseInt(taskValue)
    });
    
    saveData();
    renderProjects();
    updateAnalytics();
}

// Elimina task
function deleteTask(projectId, taskId) {
    if (confirm('Sei sicuro di voler eliminare questo task?')) {
        const project = projects.find(p => p.id === projectId);
        project.tasks = project.tasks.filter(t => t.id !== taskId);
        saveData();
        renderProjects();
        updateAnalytics();
    }
}

// Funzioni di utilità per animazioni
function celebrateCompletion() {
    // Crea coriandoli virtuali
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 10);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.transition = 'all 3s ease-out';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.style.top = window.innerHeight + 'px';
        confetti.style.transform = 'rotate(720deg)';
        confetti.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        document.body.removeChild(confetti);
    }, 3000);
}

// Controlla se un progetto è completato e celebra
function checkProjectCompletion(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project && project.tasks.length > 0 && project.tasks.every(task => task.completed)) {
        setTimeout(celebrateCompletion, 500);
    }
} 