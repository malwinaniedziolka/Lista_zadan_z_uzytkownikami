class Task{ //treść, status, data utworzenia
    constructor(id, name, description, user, priority, category, status = 'Pending', date = new Date()){
        this.id = id;
        this.name = name;
        this.description = description;
        this.user = user;
        this.priority = priority; 
        this.category = category;
        this.status = status;
        this.date = date;
    }
}

class TaskManager{ //zarządzanie zadaniami, np. dodawanie, edytowanie, usuwanie
    constructor(){
        this.tasks = [];
        this.currentId = 1;
    }

    addTask(name, description, user, priority, category){
        const task = new Task(this.currentId++, name, description, user, priority, category);
        this.tasks.push(task);
        return task;
    }

    editTask(id, newName, newDescription, newUser, newPriority, newCategory) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.name = newName;
            task.description = newDescription;
            task.user = newUser;
            task.priority = newPriority;
            task.category = newCategory;
        }
    }

    deleteTask(id){
        this.tasks = this.tasks.filter(t => t.id !== id);
    }

    getTasks(){
        return this.tasks;
    }

    doneTask(id){
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = 'Done';
        }
    }
}

const taskManager = new TaskManager();

const form = document.querySelector('form');
const taskList = document.getElementById('task-list');

let taskBeingEdited = null;

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('task-name').value.trim();
    const desc = document.getElementById('task-desc').value.trim();
    const user = document.getElementById('task-user').value.trim();
    const priorityElem = document.querySelector('input[name="priority"]:checked');
    const priority = priorityElem ? priorityElem.value : '';
    const categoryElem = document.querySelector('input[name="category"]:checked');
    const category = categoryElem ? categoryElem.value : '';

    if (name && desc && user && priority && category) {
        if (taskBeingEdited) {
            taskManager.editTask(taskBeingEdited.id, name, desc, user, priority, category);
            taskList.innerHTML = ''; 
            taskManager.getTasks().forEach(displayTask);
            taskBeingEdited = null;
            document.querySelector('.h1').textContent = "Add new task";
            form.querySelector('button[type="submit"]').textContent = "Add task";
            form.reset();
        }
        else{
            const newTask = taskManager.addTask(name, desc, user, priority, category);
            displayTask(newTask);
            form.reset();
        }
    } else{
        alert('Wypełnij wszystkie pola!');
    }
});

function displayTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    const doneClass = task.status === 'Done' ? 'task-done' : '';
    li.innerHTML = `
    <div class="tasks ${doneClass}">
        <p class="task-text"><strong>${task.name}</strong> - ${task.description}</p>
        <p class="task-text">User: ${task.user},  Status: ${task.status}</p>
        <p class="task-text">Date added: ${task.date.toLocaleString()}</p>
        <p class="task-text">Priority: ${task.priority},  Category: ${task.category}</p>
        <button class="done-btn">Done</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    </div>
    `;

    const sortDate = document.getElementById('sort-date');
    sortDate.addEventListener('change', () => {
        let sorting = taskManager.getTasks().slice();
        taskList.innerHTML = '';

        if(sortDate.value == "newest"){
            sorting.sort((a, b) => new Date(b.date) - new Date(a.date)); 
        }
        if(sortDate.value == "oldest"){
            sorting.sort((a, b) => new Date(a.date) - new Date(b.date)); 
        }
        sorting.forEach(displayTask);
    });

    const sortStatus = document.getElementById('sort-status');
    sortStatus.addEventListener('change', () => {
        let sorting = taskManager.getTasks();
        let filteredTasks;
        taskList.innerHTML = '';

        if(sortStatus.value == "pending"){
            filteredTasks = sorting.filter(task => task.status === "Pending");
            filteredTasks.forEach(displayTask);
        }
        if(sortStatus.value == "done"){
            filteredTasks = sorting.filter(task => task.status === "Done");
            filteredTasks.forEach(displayTask);
        }
        if(sortStatus.value == ""){
            sorting.forEach(displayTask);
        }
    });

    const sortPriority = document.getElementById('sort-priority');
    sortPriority.addEventListener('change', () => {
        let sorting = taskManager.getTasks();
        let filteredTasks;
        taskList.innerHTML = '';

        if(sortPriority.value == "low"){
            filteredTasks = sorting.filter(task => task.priority === "Low");
            filteredTasks.forEach(displayTask);
        }
        if(sortPriority.value == "medium"){
            filteredTasks = sorting.filter(task => task.priority === "Medium");
            filteredTasks.forEach(displayTask);
        }
        if(sortPriority.value == "high"){
            filteredTasks = sorting.filter(task => task.priority === "High");
            filteredTasks.forEach(displayTask);
        }
        if(sortPriority.value == ""){
            sorting.forEach(displayTask);
        }
    });

    const sortCategory = document.getElementById('sort-category');
    sortCategory.addEventListener('change', () => {
        let sorting = taskManager.getTasks();
        let filteredTasks;
        taskList.innerHTML = '';

        if(sortCategory.value == "work"){
            filteredTasks = sorting.filter(task => task.category === "Work");
            filteredTasks.forEach(displayTask);
        }
        if(sortCategory.value == "hobby"){
            filteredTasks = sorting.filter(task => task.category === "Hobby");
            filteredTasks.forEach(displayTask);
        }
        if(sortCategory.value == "school"){
            filteredTasks = sorting.filter(task => task.category === "School");
            filteredTasks.forEach(displayTask);
        }
        if(sortCategory.value == "private"){
            filteredTasks = sorting.filter(task => task.category === "Private");
            filteredTasks.forEach(displayTask);
        }
        if(sortCategory.value == ""){
            sorting.forEach(displayTask);
        }
    });

    const doneBtn = li.querySelector('.done-btn');
    doneBtn.addEventListener('click', () => {
        taskManager.doneTask(task.id);
        li.remove();
        displayTask(task);
    });

    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        document.getElementById('task-name').value = task.name;
        document.getElementById('task-desc').value = task.description;
        document.getElementById('task-user').value = task.user;

        document.querySelector(`input[name="priority"][value="${task.priority}"]`).checked = true;
        document.querySelector(`input[name="category"][value="${task.category}"]`).checked = true;

        taskBeingEdited = task;

        document.querySelector('.h1').textContent = "Edit task";
        form.querySelector('button[type="submit"]').textContent = "Save changes";
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        taskManager.deleteTask(task.id);
        li.remove();
    });

    taskList.appendChild(li);
}