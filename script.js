// To-Do Familiar App - JavaScript with Firebase Integration

class TodoApp {
    constructor() {
        this.currentUser = 'todos';
        this.tasks = this.loadTasks();
        this.dailyTasks = this.getDailyTasks();
        this.points = this.loadPoints();
        this.winners = this.loadWinners();
        this.init();
    }

    init() {
        this.updateDate();
        this.setupEventListeners();
        this.renderTasks();
        this.updateStats();
        this.checkDailySummary();
        
        // Update date every minute
        setInterval(() => this.updateDate(), 60000);
        
        // Check for daily summary every minute
        setInterval(() => this.checkDailySummary(), 60000);
    }

    // Event Listeners
    setupEventListeners() {
        // User selection
        document.querySelectorAll('.user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchUser(e.target.closest('.user-btn').dataset.user);
            });
        });

        // Add new task
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.addTask();
        });

        document.getElementById('newTaskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Manual summary button
        document.getElementById('showSummaryBtn').addEventListener('click', () => {
            this.showDailySummary();
        });

        // Scoreboard button
        document.getElementById('showScoreboardBtn').addEventListener('click', () => {
            this.showScoreboard();
        });

        // Task containers for event delegation
        document.getElementById('dailyTasks').addEventListener('click', (e) => {
            this.handleTaskAction(e);
        });

        document.getElementById('customTasks').addEventListener('click', (e) => {
            this.handleTaskAction(e);
        });
    }

    // User Management
    switchUser(user) {
        this.currentUser = user;
        
        // Update active button
        document.querySelectorAll('.user-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-user="${user}"]`).classList.add('active');
        
        this.renderTasks();
        this.updateStats();
    }

    // Task Management
    addTask() {
        const input = document.getElementById('newTaskInput');
        const text = input.value.trim();
        
        if (text) {
            const task = {
                id: 'task-' + Date.now(),
                text: text,
                user: this.currentUser,
                completed: false,
                daily: false,
                createdAt: new Date().toISOString()
            };
            
            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            
            input.value = '';
            input.focus();
        }
    }

    toggleTask(taskId) {
        const task = this.findTask(taskId);
        if (task) {
            const wasCompleted = task.completed;
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            // Update points
            if (task.completed && !wasCompleted) {
                this.addPoints(task.user, 10);
                this.showPointsNotification(task.user, 10);
            } else if (!task.completed && wasCompleted) {
                this.addPoints(task.user, -10);
            }
            
            this.saveTasks();
            this.savePoints();
            this.renderTasks();
            this.updateStats();
        }
    }

    addPoints(user, points) {
        if (user !== 'todos' && this.points[user] !== undefined) {
            this.points[user] = Math.max(0, this.points[user] + points);
        }
    }

    showPointsNotification(user, points) {
        const userNames = {
            'mama': 'Mamá',
            'papa': 'Papá',
            'hijo': 'Hijo',
            'hija': 'Hija'
        };

        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="points-content">
                <i class="fas fa-star"></i>
                <span>¡${userNames[user]} ganó ${points} puntos!</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    editTask(taskId) {
        const task = this.findTask(taskId);
        if (task) {
            this.showEditModal(task);
        }
    }

    showEditModal(task) {
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="edit-modal-content">
                <div class="edit-header">
                    <h3><i class="fas fa-edit"></i> Editar Tarea</h3>
                    <button class="edit-close-btn">×</button>
                </div>
                <div class="edit-body">
                    <label for="editTaskInput">Nuevo texto de la tarea:</label>
                    <input type="text" id="editTaskInput" value="${task.text}" maxlength="100">
                    <div class="edit-actions">
                        <button class="edit-cancel-btn">Cancelar</button>
                        <button class="edit-save-btn">Guardar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const input = modal.querySelector('#editTaskInput');
        input.focus();
        input.select();

        // Event listeners
        modal.querySelector('.edit-close-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.edit-cancel-btn').addEventListener('click', () => modal.remove());
        
        modal.querySelector('.edit-save-btn').addEventListener('click', () => {
            const newText = input.value.trim();
            if (newText !== '') {
                task.text = newText;
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
                modal.remove();
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                modal.querySelector('.edit-save-btn').click();
            } else if (e.key === 'Escape') {
                modal.remove();
            }
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    deleteTask(taskId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    findTask(taskId) {
        return this.tasks.find(task => task.id === taskId) || 
               Object.values(this.dailyTasks).flat().find(task => task.id === taskId);
    }

    // Task Action Handler
    handleTaskAction(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.taskId;

        if (e.target.closest('.task-checkbox')) {
            this.toggleTask(taskId);
        } else if (e.target.closest('.task-edit-btn')) {
            this.editTask(taskId);
        } else if (e.target.closest('.task-delete-btn')) {
            this.deleteTask(taskId);
        }
    }

    // Rendering
    renderTasks() {
        this.renderDailyTasks();
        this.renderCustomTasks();
    }

    renderDailyTasks() {
        const container = document.getElementById('dailyTasks');
        container.innerHTML = '';

        const userDailyTasks = this.dailyTasks[this.currentUser] || [];
        const allDailyTasks = this.currentUser === 'todos' ? 
            Object.values(this.dailyTasks).flat() : userDailyTasks;

        allDailyTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    renderCustomTasks() {
        const container = document.getElementById('customTasks');
        container.innerHTML = '';

        const userTasks = this.tasks.filter(task => 
            task.user === this.currentUser && !task.daily
        );

        if (userTasks.length === 0) {
            container.innerHTML = '<p class="no-tasks">No hay tareas personalizadas. ¡Agrega una nueva!</p>';
            return;
        }

        userTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const template = document.getElementById('taskTemplate');
        const taskElement = template.content.cloneNode(true);
        
        const taskItem = taskElement.querySelector('.task-item');
        const taskText = taskElement.querySelector('.task-text');
        const checkbox = taskElement.querySelector('.task-checkbox i');
        
        taskItem.dataset.taskId = task.id;
        taskText.textContent = task.text;
        
        if (task.completed) {
            taskItem.classList.add('completed');
            checkbox.className = 'fas fa-check-circle';
        } else {
            checkbox.className = 'fas fa-circle';
        }

        // Hide delete button for daily tasks
        if (task.daily) {
            taskElement.querySelector('.task-delete-btn').style.display = 'none';
        }
        
        return taskElement;
    }

    // Statistics
    updateStats() {
        const allTasks = [
            ...Object.values(this.dailyTasks).flat(),
            ...this.tasks.filter(task => task.user === this.currentUser)
        ];

        const completed = allTasks.filter(task => task.completed).length;
        const pending = allTasks.filter(task => !task.completed).length;

        document.getElementById('completedCount').textContent = completed;
        document.getElementById('pendingCount').textContent = pending;
    }

    // Daily Summary
    checkDailySummary() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Check if it's 8:00 PM (20:00)
        if (currentHour === 20 && currentMinute === 0) {
            this.showDailySummary();
        }
    }

    showDailySummary() {
        const pendingTasks = this.getPendingTasksByUser();
        
        if (Object.keys(pendingTasks).length === 0) {
            this.showNotification('¡Excelente! Todas las tareas del día están completadas. 🎉');
            return;
        }

        const summaryHTML = this.createSummaryHTML(pendingTasks);
        this.showSummaryModal(summaryHTML);
    }

    getPendingTasksByUser() {
        const pendingTasks = {};
        
        // Get all users
        const users = ['todos', 'mama', 'papa', 'hijo', 'hija'];
        
        users.forEach(user => {
            const userTasks = [];
            
            // Add daily tasks
            const dailyTasks = this.dailyTasks[user] || [];
            dailyTasks.forEach(task => {
                if (!task.completed) {
                    userTasks.push(task.text);
                }
            });
            
            // Add custom tasks
            const customTasks = this.tasks.filter(task => 
                task.user === user && !task.completed && !task.daily
            );
            customTasks.forEach(task => {
                userTasks.push(task.text);
            });
            
            if (userTasks.length > 0) {
                pendingTasks[user] = userTasks;
            }
        });
        
        return pendingTasks;
    }

    createSummaryHTML(pendingTasks) {
        const userNames = {
            'todos': 'Todos',
            'mama': 'Mamá',
            'papa': 'Papá',
            'hijo': 'Hijo',
            'hija': 'Hija'
        };

        let html = `
            <div class="summary-header">
                <h2><i class="fas fa-clock"></i> Resumen del Día - 8:00 PM</h2>
                <p>Tareas pendientes por completar:</p>
            </div>
            <div class="summary-content">
        `;

        Object.keys(pendingTasks).forEach(user => {
            const tasks = pendingTasks[user];
            if (tasks.length > 0) {
                html += `
                    <div class="summary-user">
                        <h3><i class="fas fa-user"></i> ${userNames[user]}</h3>
                        <ul>
                `;
                
                tasks.forEach(task => {
                    html += `<li><i class="fas fa-circle"></i> ${task}</li>`;
                });
                
                html += `
                        </ul>
                    </div>
                `;
            }
        });

        if (Object.keys(pendingTasks).length === 0) {
            html += `
                <div class="summary-user">
                    <h3><i class="fas fa-check-circle"></i> ¡Excelente!</h3>
                    <p>Todas las tareas del día han sido completadas.</p>
                </div>
            `;
        }

        html += `
            </div>
            <div class="summary-footer">
                <button class="summary-close-btn">Cerrar</button>
                <button class="summary-view-all-btn">Ver Todas las Tareas</button>
            </div>
        `;

        return html;
    }

    showSummaryModal(content) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.summary-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'summary-modal';
        modal.innerHTML = `
            <div class="summary-modal-content">
                ${content}
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.summary-close-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.summary-view-all-btn').addEventListener('click', () => {
            modal.remove();
            this.switchUser('todos');
            document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Auto-close after 30 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 30000);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-bell"></i>
                <span>${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Add event listener for close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    showScoreboard() {
        // Check if month has changed to reset points
        const currentMonth = new Date().getMonth();
        if (currentMonth !== this.points.lastReset) {
            this.resetMonthlyPoints();
        }

        const scoreboardHTML = this.createScoreboardHTML();
        this.showScoreboardModal(scoreboardHTML);
    }

    resetMonthlyPoints() {
        // Guardar ganador antes de reiniciar
        const winner = this.getMonthlyWinner();
        if (winner) {
            this.winners.push({
                month: this.getMonthYearString(new Date(new Date().getFullYear(), new Date().getMonth() - 1)),
                user: winner.user,
                points: winner.points
            });
            this.saveWinners();
        }
        this.points = {
            mama: 0,
            papa: 0,
            hijo: 0,
            hija: 0,
            lastReset: new Date().getMonth()
        };
        this.savePoints();
        // Mostrar resumen del mes anterior
        if (winner) {
            setTimeout(() => this.showMonthlySummary(winner), 1000);
        }
    }

    getMonthlyWinner() {
        const userNames = {
            'mama': 'Mamá',
            'papa': 'Papá',
            'hijo': 'Hijo',
            'hija': 'Hija'
        };
        const users = ['mama', 'papa', 'hijo', 'hija'];
        let maxPoints = 0;
        let winner = null;
        users.forEach(user => {
            if (this.points[user] > maxPoints) {
                maxPoints = this.points[user];
                winner = user;
            }
        });
        if (winner && maxPoints > 0) {
            return { user: userNames[winner], points: maxPoints };
        }
        return null;
    }

    getMonthYearString(date) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `${meses[date.getMonth()]} ${date.getFullYear()}`;
    }

    showMonthlySummary(winner) {
        const modal = document.createElement('div');
        modal.className = 'scoreboard-modal';
        modal.innerHTML = `
            <div class="scoreboard-modal-content">
                <div class="scoreboard-header">
                    <h2><i class="fas fa-crown"></i> Empleado del Mes</h2>
                    <p>¡Felicidades a <b>${winner.user}</b> por ser el ganador del mes anterior con <b>${winner.points} puntos</b>!</p>
                </div>
                <div class="scoreboard-footer">
                    <button class="scoreboard-close-btn">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.scoreboard-close-btn').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        setTimeout(() => { if (modal.parentNode) modal.remove(); }, 15000);
    }

    createScoreboardHTML() {
        const userNames = {
            'mama': 'Mamá',
            'papa': 'Papá',
            'hijo': 'Hijo',
            'hija': 'Hija'
        };

        // Sort users by points
        const sortedUsers = Object.keys(this.points)
            .filter(key => key !== 'lastReset')
            .sort((a, b) => this.points[b] - this.points[a]);

        let html = `
            <div class="scoreboard-header">
                <h2><i class="fas fa-trophy"></i> Scoreboard Familiar</h2>
                <p>Puntos del mes actual</p>
            </div>
            <div class="scoreboard-content">
        `;

        sortedUsers.forEach((user, index) => {
            const points = this.points[user];
            const isWinner = index === 0 && points > 0;
            
            html += `
                <div class="scoreboard-user ${isWinner ? 'winner' : ''}">
                    <div class="user-rank">
                        <span class="rank-number">${index + 1}</span>
                        ${isWinner ? '<i class="fas fa-crown"></i>' : ''}
                    </div>
                    <div class="user-info">
                        <h3>${userNames[user]}</h3>
                        <div class="user-points">
                            <i class="fas fa-star"></i>
                            <span>${points} puntos</span>
                        </div>
                    </div>
                    <div class="user-achievement">
                        ${this.getAchievementBadge(points)}
                    </div>
                </div>
            `;
        });

        html += `
            </div>
        `;
        // Mostrar historial de ganadores
        if (this.winners.length > 0) {
            html += `<div class="scoreboard-history">
                <h3>Historial de Empleados del Mes</h3>
                <ul>`;
            this.winners.slice(-6).reverse().forEach(w => {
                html += `<li><b>${w.month}:</b> ${w.user} (${w.points} puntos)</li>`;
            });
            html += `</ul></div>`;
        }
        html += `
            <div class="scoreboard-footer">
                <div class="points-info">
                    <p><i class="fas fa-info-circle"></i> Cada tarea completada = 10 puntos</p>
                    <p><i class="fas fa-calendar"></i> Los puntos se reinician cada mes</p>
                </div>
                <button class="scoreboard-close-btn">Cerrar</button>
            </div>
        `;

        return html;
    }

    getAchievementBadge(points) {
        if (points >= 100) return '<span class="badge gold">🏆 Maestro</span>';
        if (points >= 50) return '<span class="badge silver">🥈 Experto</span>';
        if (points >= 20) return '<span class="badge bronze">🥉 Aprendiz</span>';
        return '<span class="badge beginner">⭐ Principiante</span>';
    }

    showScoreboardModal(content) {
        const modal = document.createElement('div');
        modal.className = 'scoreboard-modal';
        modal.innerHTML = `
            <div class="scoreboard-modal-content">
                ${content}
            </div>
        `;

        document.body.appendChild(modal);

        // Event listener
        modal.querySelector('.scoreboard-close-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Auto-close after 60 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 60000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Add some CSS for the no-tasks message
const style = document.createElement('style');
style.textContent = `
    .no-tasks {
        text-align: center;
        color: #718096;
        font-style: italic;
        padding: 20px;
        background: #f7fafc;
        border-radius: 10px;
        border: 2px dashed #e2e8f0;
    }
`;
document.head.appendChild(style);
