class Task{ //treść, status, data utworzenia
    constructor(id, name, description, user, status = 'pending', date = new Date()){
        this.id = id;
        this.name = name;
        this.description = description;
        this.user = user;
        this.status = status;
        this.date = date;
    }
}

class TaskManager{ //zarządzanie zadaniami, np. dodawanie, edytowanie, usuwanie
    constructor(){
        this.tasks = [

        ];
        this.currentId = 1;
    }

    addTask(name, description, user){
        const task = new Task(this.currentId++, name, description, user);
        this.tasks.push(task);
        return task;
    }

    editTask(id){

    }

    deleteTask(id){
        
    }

    getTasks() {
        return this.tasks;
    }

}

// Obsługa DOM
const taskManager = new TaskManager();

const form = document.querySelector('form');
const taskList = document.getElementById('task-list');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('task-name').value.trim();
    const desc = document.getElementById('task-desc').value.trim();
    const user = document.getElementById('task-user').value.trim();

    if (name && desc && user) {
        const newTask = taskManager.addTask(name, desc, user);
        displayTask(newTask);
        form.reset();
    } else{
        alert('Wypełnij wszystkie pola!');
    }
});

function displayTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.innerHTML = `
    <div class="tasks">
        <p class="task-text"><strong>${task.name}</strong> - ${task.description}</p>
        <p class="task-text">Użytkownik: ${task.user},  Status wykonania: ${task.status}</p>
        <p class="task-text">Data dodania: ${task.date.toLocaleString()}</p>
        <button class="edit-btn">Edytuj</button>
        <button class="delete-btn">Usuń</button>
    </div>
    `;

    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        taskManager.editTask(task.id);
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        taskManager.deleteTask(task.id);
        li.remove();
    });

    taskList.appendChild(li);
}