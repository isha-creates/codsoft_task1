/* ==========================================
   DOM ELEMENTS
========================================== */

const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

const addTaskBtn = document.getElementById("addTask");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const emptyState = document.getElementById("emptyState");

/* ==========================================
   VARIABLES
========================================== */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

/* ==========================================
   SAVE TASKS
========================================== */

function saveTasks(){

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

/* ==========================================
   TOAST MESSAGE
========================================== */

function showToast(message){

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

/* ==========================================
   CLEAR FORM
========================================== */

function clearForm(){

    taskInput.value = "";

    category.value = "";

    priority.value = "";

    dueDate.value = "";

}

/* ==========================================
   UPDATE DASHBOARD
========================================== */

function updateDashboard(){

    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(task=>task.completed).length;

    completedTasks.textContent = completed;

    pendingTasks.textContent = tasks.length - completed;

    let percentage = 0;

    if(tasks.length>0){

        percentage = Math.round(
            (completed/tasks.length)*100
        );

    }

    progressBar.style.width = percentage + "%";

    progressText.textContent =
        percentage + "% Completed";

}

/* ==========================================
   ADD TASK
========================================== */

function addTask(){

    const taskName = taskInput.value.trim();

    if(taskName===""){

        showToast("Please enter a task.");

        return;

    }

    const task = {

        id: Date.now(),

        name: taskName,

        category: category.value || "General",

        priority: priority.value || "Low",

        dueDate: dueDate.value,

        completed:false,

        createdAt:new Date().toLocaleString()

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    updateDashboard();

    clearForm();

    showToast("Task Added Successfully");

}

/* ==========================================
   BUTTON EVENT
========================================== */

addTaskBtn.addEventListener("click",addTask);

/* ==========================================
   ENTER KEY SUPPORT
========================================== */

taskInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        addTask();

    }

});
/* ==========================================
   RENDER TASKS
========================================== */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    // Filter Tasks
    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    if (currentFilter === "pending") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (currentFilter === "high") {
        filteredTasks = filteredTasks.filter(task => task.priority === "High");
    }

    // Empty State
    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";
        taskList.style.display = "none";

        return;

    }

    emptyState.style.display = "none";
    taskList.style.display = "block";

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = task.completed ? "task completed" : "task";

        // Check overdue
        let dueText = task.dueDate || "No Due Date";

        if (
            task.dueDate &&
            !task.completed &&
            new Date(task.dueDate) < new Date()
        ) {

            dueText = "⚠ Overdue";

        }

        li.innerHTML = `

<div class="left">

<input
type="checkbox"
${task.completed ? "checked" : ""}
onchange="toggleTask(${task.id})">

<div>

<div class="task-name">

${task.name}

</div>

<div class="task-info">

<span>🏷 ${task.category}</span>

<span class="priority ${task.priority.toLowerCase()}">

${task.priority}

</span>

<span>📅 ${dueText}</span>

<span>🕒 ${task.createdAt}</span>

</div>

</div>

</div>

<div class="actions">

<button
class="edit"
onclick="editTask(${task.id})">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="delete"
onclick="deleteTask(${task.id})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

`;

        taskList.appendChild(li);

    });

}

/* ==========================================
   COMPLETE / PENDING
========================================== */

function toggleTask(id){

    tasks = tasks.map(task=>{

        if(task.id===id){

            task.completed = !task.completed;

        }

        return task;

    });

    saveTasks();

    updateDashboard();

    renderTasks();

    showToast("Task Updated");

}

/* ==========================================
   EDIT TASK
========================================== */

function editTask(id){

    const task = tasks.find(task=>task.id===id);

    const updatedTask = prompt(

        "Edit your task",

        task.name

    );

    if(updatedTask===null) return;

    if(updatedTask.trim()===""){

        showToast("Task cannot be empty");

        return;

    }

    task.name = updatedTask.trim();

    saveTasks();

    renderTasks();

    showToast("Task Updated");

}

/* ==========================================
   DELETE TASK
========================================== */

function deleteTask(id){

    const confirmDelete = confirm(

        "Are you sure you want to delete this task?"

    );

    if(!confirmDelete){

        return;

    }

    tasks = tasks.filter(task=>task.id!==id);

    saveTasks();

    updateDashboard();

    renderTasks();

    showToast("Task Deleted");

} 
/* ==========================================
   SEARCH FUNCTION
========================================== */

const searchTask = document.getElementById("searchTask");

searchTask.addEventListener("input", () => {

    const keyword = searchTask.value.toLowerCase();

    const taskCards = document.querySelectorAll(".task");

    taskCards.forEach(card => {

        const taskName = card.querySelector(".task-name")
                             .textContent
                             .toLowerCase();

        if (taskName.includes(keyword)) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});


/* ==========================================
   FILTER BUTTONS
========================================== */

const filterButtons = document.querySelectorAll(".filter");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});


/* ==========================================
   SORT TASKS
========================================== */

const sortTasks = document.getElementById("sortTasks");

sortTasks.addEventListener("change", () => {

    const value = sortTasks.value;

    if (value === "priority") {

        const order = {
            High: 1,
            Medium: 2,
            Low: 3
        };

        tasks.sort((a, b) =>
            order[a.priority] - order[b.priority]
        );

    }

    else if (value === "name") {

        tasks.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    }

    else if (value === "date") {

        tasks.sort((a, b) => {

            if (!a.dueDate) return 1;

            if (!b.dueDate) return -1;

            return new Date(a.dueDate) -
                   new Date(b.dueDate);

        });

    }

    saveTasks();

    renderTasks();

});


/* ==========================================
   DARK MODE
========================================== */

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});


/* ==========================================
   INITIAL LOAD
========================================== */

updateDashboard();

renderTasks();


/* ==========================================
   SAVE BEFORE EXIT
========================================== */

window.addEventListener("beforeunload", () => {

    saveTasks();

});


/* ==========================================
   WELCOME MESSAGE
========================================== */

setTimeout(() => {

    if (tasks.length === 0) {

        showToast("👋 Welcome! Start by adding your first task.");

    }

}, 800);
