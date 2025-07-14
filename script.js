// To-Do Familiar App - JavaScript con Login, Ojito y Firebase

class TodoApp {
    constructor() {
        this.currentUser = 'todos';
        this.tasks = [];
        this.dailyTasks = this.getDailyTasks();
        this.points = {
            mama: 0,
            papa: 0,
            hijo: 0,
            hija: 0,
            lastReset: new Date().getMonth()
        };
        this.winners = [];
        this.isAuthenticated = false;
        this.familyPassword = 'familia2024'; // Contraseña familiar
        this.init();
    }

    init() {
        this.setupLoginEventListeners();
        this.checkAuthentication();
    }

    // Login y autenticación
    setupLoginEventListeners() {
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.authenticate();
        });
        document.getElementById('familyPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.authenticate();
            }
        });
        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('familyPassword');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    authenticate() {
        const password = document.getElementById('familyPassword').value;
        const errorElement = document.getElementById('loginError');
        if (password === this.familyPassword) {
            this.isAuthenticated = true;
            this.showApp();
            this.loadDataFromFirebase();
            this.setupAppEventListeners();
            this.updateDate();
            this.renderTasks();
            this.updateStats();
            this.checkDailySummary();
            setInterval(() => this.updateDate(), 60000);
            setInterval(() => this.checkDailySummary(), 60000);
        } else {
            errorElement.textContent = 'Contraseña incorrecta. Intenta de nuevo.';
            document.getElementById('familyPassword').value = '';
            document.getElementById('familyPassword').focus();
        }
    }

    checkAuthentication() {
        const wasAuthenticated = sessionStorage.getItem('todoApp_authenticated');
        if (wasAuthenticated === 'true') {
            this.isAuthenticated = true;
            this.showApp();
            this.loadDataFromFirebase();
            this.setupAppEventListeners();
            this.updateDate();
            this.renderTasks();
            this.updateStats();
            this.checkDailySummary();
            setInterval(() => this.updateDate(), 60000);
            setInterval(() => this.checkDailySummary(), 60000);
        }
    }

    showApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        sessionStorage.setItem('todoApp_authenticated', 'true');
    }

    // Firebase Data Management
    async loadDataFromFirebase() {
        try {
            const { database, ref, get } = window.FirebaseApp;
            const tasksSnapshot = await get(ref(database, 'tasks'));
            if (tasksSnapshot.exists()) {
                this.tasks = tasksSnapshot.val();
            }
            const pointsSnapshot = await get(ref(database, 'points'));
            if (pointsSnapshot.exists()) {
                this.points = pointsSnapshot.val();
            }
            const winnersSnapshot = await get(ref(database, 'winners'));
            if (winnersSnapshot.exists()) {
                this.winners = winnersSnapshot.val();
            }
            this.setupFirebaseListeners();
        } catch (error) {
            this.showNotification('Error al cargar datos. Verifica conexión.');
        }
    }

    setupFirebaseListeners() {
        const { database, ref, onValue } = window.FirebaseApp;
        onValue(ref(database, 'tasks'), (snapshot) => {
            if (snapshot.exists()) {
                this.tasks = snapshot.val();
                this.renderTasks();
                this.updateStats();
            }
        });
        onValue(ref(database, 'points'), (snapshot) => {
            if (snapshot.exists()) {
                this.points = snapshot.val();
            }
        });
        onValue(ref(database, 'winners'), (snapshot) => {
            if (snapshot.exists()) {
                this.winners = snapshot.val();
            }
        });
    }

    async saveTasksToFirebase() {
        try {
            const { database, ref, set } = window.FirebaseApp;
            await set(ref(database, 'tasks'), this.tasks);
        } catch (error) {
            this.showNotification('Error al guardar tareas.');
        }
    }
    async savePointsToFirebase() {
        try {
            const { database, ref, set } = window.FirebaseApp;
            this.points.lastReset = new Date().getMonth();
            await set(ref(database, 'points'), this.points);
        } catch (error) {}
    }
    async saveWinnersToFirebase() {
        try {
            const { database, ref, set } = window.FirebaseApp;
            await set(ref(database, 'winners'), this.winners);
        } catch (error) {}
    }

    // Daily tasks for each user
    getDailyTasks() {
        return {
            todos: [
                { id: 'daily-1', text: 'Revisar el calendario familiar', user: 'todos', daily: true },
                { id: 'daily-2', text: 'Planificar comidas del día', user: 'todos', daily: true },
                { id: 'daily-3', text: 'Revisar lista de compras', user: 'todos', daily: true }
            ],
            mama: [
                { id: 'mama-daily-1', text: 'Preparar desayuno', user: 'mama', daily: true },
                { id: 'mama-daily-2', text: 'Revisar ropa para lavar', user: 'mama', daily: true },
                { id: 'mama-daily-3', text: 'Planificar cena', user: 'mama', daily: true },
                { id: 'mama-daily-4', text: 'Revisar medicamentos', user: 'mama', daily: true }
            ],
            papa: [
                { id: 'papa-daily-1', text: 'Revisar correos importantes', user: 'papa', daily: true },
                { id: 'papa-daily-2', text: 'Verificar finanzas del hogar', user: 'papa', daily: true },
                { id: 'papa-daily-3', text: 'Revisar mantenimiento casa', user: 'papa', daily: true },
                { id: 'papa-daily-4', text: 'Planificar actividades familiares', user: 'papa', daily: true }
            ],
            hijo: [
                { id: 'hijo-daily-1', text: 'Hacer la cama', user: 'hijo', daily: true },
                { id: 'hijo-daily-2', text: 'Organizar mochila', user: 'hijo', daily: true },
                { id: 'hijo-daily-3', text: 'Hacer tareas escolares', user: 'hijo', daily: true },
                { id: 'hijo-daily-4', text: 'Limpiar habitación', user: 'hijo', daily: true }
            ],
            hija: [
                { id: 'hija-daily-1', text: 'Hacer la cama', user: 'hija', daily: true },
                { id: 'hija-daily-2', text: 'Organizar mochila', user: 'hija', daily: true },
                { id: 'hija-daily-3', text: 'Hacer tareas escolares', user: 'hija', daily: true },
                { id: 'hija-daily-4', text: 'Limpiar habitación', user: 'hija', daily: true }
            ]
        };
    }

    updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('es-ES', options);
        document.getElementById('currentDate').textContent = dateString;
    }

    setupAppEventListeners() {
        document.querySelectorAll('.user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchUser(e.target.closest('.user-btn').dataset.user);
            });
        });
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.addTask();
        });
        document.getElementById('newTaskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        document.getElementById('showSummaryBtn').addEventListener('click', () => {
            this.showDailySummary();
        });
        document.getElementById('showScoreboardBtn').addEventListener('click', () => {
            this.showScoreboard();
        });
        document.getElementById('dailyTasks').addEventListener('click', (e) => {
            this.handleTaskAction(e);
        });
        document.getElementById('customTasks').addEventListener('click', (e) => {
            this.handleTaskAction(e);
        });
    }

    switchUser(user) {
        this.currentUser = user;
        document.querySelectorAll('.user-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-user="${user}"]`).classList.add('active');
        this.renderTasks();
        this.updateStats();
    }

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
            this.saveTasksToFirebase();
            input.value = '';
            input.focus();
        }
    }

    toggleTask(taskId) {
        let task = this.findTask(taskId);
        
        // Si no existe en this.tasks, buscar en dailyTasks y crear entrada
        if (!task) {
            const dailyTask = this.findDailyTask(taskId);
            if (dailyTask) {
                task = {
                    ...dailyTask,
                    completed: false,
                    createdAt: new Date().toISOString()
                };
                this.tasks.push(task);
            }
        }
        
        if (task) {
            const wasCompleted = task.completed;
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            if (task.completed && !wasCompleted) {
                this.addPoints(task.user, 10);
                this.showPointsNotification(task.user, 10);
            } else if (!task.completed && wasCompleted) {
                this.addPoints(task.user, -10);
            }
            this.saveTasksToFirebase();
            this.savePointsToFirebase();
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
                    <button class="edit-close-btn">&times;</button>
                </div>
                <div class="edit-body">
                    <label for="editTaskInput">Texto de la tarea:</label>
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
        modal.querySelector('.edit-close-btn').addEventListener('click', () => {
            modal.remove();
        });
        modal.querySelector('.edit-cancel-btn').addEventListener('click', () => {
            modal.remove();
        });
        modal.querySelector('.edit-save-btn').addEventListener('click', () => {
            const newText = input.value.trim();
            if (newText) {
                task.text = newText;
                this.saveTasksToFirebase();
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
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasksToFirebase();
        }
    }

    findTask(taskId) {
        return this.tasks.find(t => t.id === taskId);
    }

    findDailyTask(taskId) {
        for (const userTasks of Object.values(this.dailyTasks)) {
            const task = userTasks.find(t => t.id === taskId);
            if (task) return task;
        }
        return null;
    }

    handleTaskAction(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        const taskId = taskItem.dataset.taskId;
        if (e.target.closest('.task-checkbox')) {
            this.toggleTask(taskId);
        } else if (e.target.closest('.task-edit-btn')) {
            this.editTask(taskId);
        } else if (e.target.closest('.task-delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                this.deleteTask(taskId);
            }
        }
    }

    renderTasks() {
        this.renderDailyTasks();
        this.renderCustomTasks();
    }

    renderDailyTasks() {
        const container = document.getElementById('dailyTasks');
        container.innerHTML = '';
        const dailyTasks = this.dailyTasks[this.currentUser] || [];
        dailyTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    renderCustomTasks() {
        const container = document.getElementById('customTasks');
        container.innerHTML = '';
        const customTasks = this.tasks.filter(task => 
            task.user === this.currentUser && !task.daily
        );
        customTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const template = document.getElementById('taskTemplate');
        const taskElement = template.content.cloneNode(true);
        const taskDiv = taskElement.querySelector('.task-item');
        taskDiv.dataset.taskId = task.id;
        taskDiv.querySelector('.task-text').textContent = task.text;
        
        // Verificar si la tarea está completada (buscar en this.tasks primero)
        const savedTask = this.findTask(task.id);
        const isCompleted = savedTask ? savedTask.completed : false;
        
        if (isCompleted) {
            taskDiv.classList.add('completed');
            taskDiv.querySelector('.task-checkbox i').className = 'fas fa-check-circle';
        }
        return taskElement;
    }

    updateStats() {
        // Combinar tareas personalizadas con tareas diarias, verificando estado guardado
        const allTasks = [...this.tasks];
        
        // Agregar tareas diarias que no están en this.tasks
        Object.values(this.dailyTasks).flat().forEach(dailyTask => {
            const existingTask = this.tasks.find(t => t.id === dailyTask.id);
            if (!existingTask) {
                allTasks.push({ ...dailyTask, completed: false });
            }
        });
        
        const completedTasks = allTasks.filter(task => task.completed);
        const pendingTasks = allTasks.filter(task => !task.completed);
        document.getElementById('completedCount').textContent = completedTasks.length;
        document.getElementById('pendingCount').textContent = pendingTasks.length;
    }

    checkDailySummary() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        if (currentHour === 20 && currentMinute === 0) {
            this.showDailySummary();
        }
    }

    showDailySummary() {
        const pendingTasks = this.getPendingTasksByUser();
        const content = this.createSummaryHTML(pendingTasks);
        this.showSummaryModal(content);
    }

    getPendingTasksByUser() {
        const pendingTasks = {};
        Object.keys(this.dailyTasks).forEach(user => {
            const userDailyTasks = this.dailyTasks[user];
            const pendingDailyTasks = userDailyTasks.filter(task => {
                const existingTask = this.tasks.find(t => t.id === task.id);
                return !existingTask || !existingTask.completed;
            });
            if (pendingDailyTasks.length > 0) {
                pendingTasks[user] = pendingDailyTasks;
            }
        });
        this.tasks.forEach(task => {
            if (!task.completed && !task.daily) {
                if (!pendingTasks[task.user]) {
                    pendingTasks[task.user] = [];
                }
                pendingTasks[task.user].push(task);
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
        const userIcons = {
            'todos': 'fas fa-users',
            'mama': 'fas fa-female',
            'papa': 'fas fa-male',
            'hijo': 'fas fa-child',
            'hija': 'fas fa-child'
        };
        let html = `
            <div class="summary-header">
                <h2><i class="fas fa-list-check"></i> Resumen del Día</h2>
                <p>Tareas pendientes por miembro de la familia</p>
            </div>
            <div class="summary-content">
        `;
        Object.keys(pendingTasks).forEach(user => {
            const tasks = pendingTasks[user];
            html += `
                <div class="summary-user">
                    <h3><i class="${userIcons[user]}"></i> ${userNames[user]}</h3>
                    <ul>
            `;
            tasks.forEach(task => {
                html += `<li><i class="fas fa-circle"></i> ${task.text}</li>`;
            });
            html += `
                    </ul>
                </div>
            `;
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
        const modal = document.createElement('div');
        modal.className = 'summary-modal';
        modal.innerHTML = `
            <div class="summary-modal-content">
                ${content}
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.summary-close-btn').addEventListener('click', () => {
            modal.remove();
        });
        modal.querySelector('.summary-view-all-btn').addEventListener('click', () => {
            modal.remove();
            this.switchUser('todos');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        document.body.appendChild(notification);
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    showScoreboard() {
        this.resetMonthlyPoints();
        const winner = this.getMonthlyWinner();
        if (winner) {
            this.showMonthlySummary(winner);
        }
        const content = this.createScoreboardHTML();
        this.showScoreboardModal(content);
    }

    resetMonthlyPoints() {
        const currentMonth = new Date().getMonth();
        if (this.points.lastReset !== currentMonth) {
            const currentWinner = this.getMonthlyWinner();
            if (currentWinner) {
                this.winners.push({
                    month: this.getMonthYearString(new Date()),
                    winner: currentWinner.user,
                    points: currentWinner.points
                });
                this.saveWinnersToFirebase();
            }
            this.points = {
                mama: 0,
                papa: 0,
                hijo: 0,
                hija: 0,
                lastReset: currentMonth
            };
            this.savePointsToFirebase();
        }
    }

    getMonthlyWinner() {
        const userNames = {
            'mama': 'Mamá',
            'papa': 'Papá',
            'hijo': 'Hijo',
            'hija': 'Hija'
        };
        let maxPoints = 0;
        let winner = null;
        Object.keys(this.points).forEach(user => {
            if (user !== 'lastReset' && this.points[user] > maxPoints) {
                maxPoints = this.points[user];
                winner = { user, name: userNames[user], points: maxPoints };
            }
        });
        return winner;
    }

    getMonthYearString(date) {
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('es-ES', options);
    }

    showMonthlySummary(winner) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="points-content">
                <i class="fas fa-crown"></i>
                <span>¡${winner.name} es el ganador del mes con ${winner.points} puntos!</span>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    createScoreboardHTML() {
        const userNames = {
            'mama': 'Mamá',
            'papa': 'Papá',
            'hijo': 'Hijo',
            'hija': 'Hija'
        };
        const userIcons = {
            'mama': 'fas fa-female',
            'papa': 'fas fa-male',
            'hijo': 'fas fa-child',
            'hija': 'fas fa-child'
        };
        const sortedUsers = Object.keys(this.points)
            .filter(user => user !== 'lastReset')
            .map(user => ({
                user,
                name: userNames[user],
                icon: userIcons[user],
                points: this.points[user]
            }))
            .sort((a, b) => b.points - a.points);
        let html = `
            <div class="scoreboard-header">
                <h2><i class="fas fa-trophy"></i> Scoreboard Familiar</h2>
                <p>Puntos del mes actual</p>
            </div>
            <div class="scoreboard-content">
        `;
        sortedUsers.forEach((userData, index) => {
            const isWinner = index === 0 && userData.points > 0;
            const rank = index + 1;
            const badge = this.getAchievementBadge(userData.points);
            html += `
                <div class="scoreboard-user ${isWinner ? 'winner' : ''}">
                    <div class="user-rank">
                        <div class="rank-number">${rank}</div>
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="user-info">
                        <h3>${userData.name}</h3>
                        <div class="user-points">
                            <i class="fas fa-star"></i>
                            <span>${userData.points} puntos</span>
                        </div>
                    </div>
                    <div class="user-achievement">
                        <div class="badge ${badge.class}">${badge.text}</div>
                    </div>
                </div>
            `;
        });
        html += `
            </div>
            <div class="scoreboard-footer">
                <div class="points-info">
                    <p><i class="fas fa-info-circle"></i> Cada tarea completada otorga 10 puntos</p>
                    <p><i class="fas fa-calendar"></i> Los puntos se reinician cada mes</p>
                </div>
                <button class="scoreboard-close-btn">Cerrar</button>
            </div>
        `;
        return html;
    }

    getAchievementBadge(points) {
        if (points >= 100) {
            return { class: 'gold', text: '🏆 Maestro' };
        } else if (points >= 50) {
            return { class: 'silver', text: '🥈 Experto' };
        } else if (points >= 20) {
            return { class: 'bronze', text: '🥉 Aprendiz' };
        } else {
            return { class: 'beginner', text: '⭐ Principiante' };
        }
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
        modal.querySelector('.scoreboard-close-btn').addEventListener('click', () => {
            modal.remove();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
