class Task {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}

class TaskManager {
    #tasks = [];
    static #storageKey = 'tasks';

    constructor(taskListId, taskInputId, taskTypeId, editTaskModalId, editTaskInputId, editTaskTypeId, saveChangesButtonId) {
        this.taskListElement = document.getElementById(taskListId);
        this.taskInput = document.getElementById(taskInputId);
        this.taskType = document.getElementById(taskTypeId);
        this.editTaskModal = document.getElementById(editTaskModalId);
        this.editTaskInput = document.getElementById(editTaskInputId);
        this.editTaskType = document.getElementById(editTaskTypeId);
        this.saveChangesButton = document.getElementById(saveChangesButtonId);
        
        this.loadTasks();
        this.addEventListeners();
    }

    static get storageKey() {
        return this.#storageKey;
    }

    addEventListeners() {
        document.getElementById('addTaskButton').addEventListener('click', () => this.addTask());
        this.saveChangesButton.addEventListener('click', () => this.updateTask());
    }

    loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem(TaskManager.storageKey)) || [];
        this.#tasks = storedTasks.map(task => new Task(task.id, task.name, task.type));
        this.renderTasks();
    }

    renderTasks() {
        this.taskListElement.innerHTML = '';
        this.#tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span>${task.name} <span class="badge bg-${task.type === 'Priority' ? 'danger' : 'secondary'}">${task.type}</span></span>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-warning btn-sm" onclick="taskManager.openEditModal(${task.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm ms-2" onclick="taskManager.deleteTask(${task.id})"><i class="fas fa-trash"></i> Delete</button>
                </div>`;
            this.taskListElement.appendChild(li);
        });
    }

    addTask() {
        const taskName = this.taskInput.value.trim();
        const taskType = this.taskType.value;

        if (taskName) {
            const newTask = new Task(Date.now(), taskName, taskType);
            this.#tasks.push(newTask);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
        }
    }

    openEditModal(taskId) {
        const taskToEdit = this.#tasks.find(task => task.id === taskId);
        this.editTaskInput.value = taskToEdit.name;
        this.editTaskType.value = taskToEdit.type;
        this.currentTaskId = taskId;

        // Show modal using Bootstrap 5
        const modalInstance = new bootstrap.Modal(this.editTaskModal);
        modalInstance.show();
    }

    updateTask() {
        const taskName = this.editTaskInput.value.trim();
        const taskType = this.editTaskType.value;

        if (taskName) {
            const taskIndex = this.#tasks.findIndex(task => task.id === this.currentTaskId);
            if (taskIndex !== -1) {
                this.#tasks[taskIndex].name = taskName;
                this.#tasks[taskIndex].type = taskType;
                this.saveTasks();
                this.renderTasks();
                this.editTaskInput.value = '';
                this.currentTaskId = null;

                // Close the modal
                const modalInstance = bootstrap.Modal.getInstance(this.editTaskModal);
                modalInstance.hide();
            }
        }
    }

    deleteTask(taskId) {
        this.#tasks = this.#tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem(TaskManager.storageKey, JSON.stringify(this.#tasks));
    }
}

// Instantiate TaskManager
const taskManager = new TaskManager(
    'taskList',
    'taskInput',
    'taskType',
    'editTaskModal',
    'editTaskInput',
    'editTaskType',
    'saveChangesButton'
);
