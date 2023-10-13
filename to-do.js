// Initialize the global data object stored in localStorage
let data = localStorage.getItem("Todoro_data");

// Check if is the first time opened the app (Todoro_data doesn't exist)
if (data === null) {

    // Creates Todoro_data in localStorage
    data = {
        openTasks: [],
        closedTasks: []
    };

    saveTodoroData();

} else {

    data = JSON.parse(data);

    // Create all the open tasks in the main view
    data.openTasks = data.openTasks.filter(t => t !== "");

    data.openTasks.forEach((task) => {
        createNewTask(task, true);
    });

    // Errase previous closed tasks
    data.closedTasks = [];

    saveTodoroData();

}

// Auxiliary functions to improve readibility
function saveTodoroData() {
    localStorage.setItem("Todoro_data", JSON.stringify(data));
}

function refreshTodoroData() {

    openTasks = [];
    document.querySelectorAll("#ulOpenTasks span.task-name").forEach(t => openTasks.push(t.textContent));

    closedTasks = [];
    document.querySelectorAll("#ulClosedTasks span.task-name").forEach(t => closedTasks.push(t.textContent));

    data.openTasks = openTasks;
    data.closedTasks = closedTasks;

    saveTodoroData();

}



// *** Feature: Create new tasks ***

document.getElementById("btnNewTask").addEventListener("click", (e) => {

    const newTask = document.getElementById("txtNewTask").value;

    if (newTask !== "") {

        // Prevent default in order to not refresh the page
        e.preventDefault();

        createNewTask(newTask);

    }


});

function createNewTask(newTask, previous = false) {

    // The li serves as the container for the task's info and buttons
    const liNewTask = document.createElement("li");
    liNewTask.classList.add("task");
    liNewTask.draggable = true;

    addTaskInfo(liNewTask, newTask);
    addTaskButons(liNewTask);

    // Add to the list of open Tasks
    document.getElementById("ulOpenTasks").appendChild(liNewTask);

    // If it isn't a pre-existing task, then add to localStorage
    if (!previous) {
        refreshTodoroData();
    }

    addDragEvents(liNewTask);

    // Reset input value and focus on it
    document.getElementById("txtNewTask").value = "";
    document.getElementById("txtNewTask").focus();
}


// * Complementary functions for creating a new task *

// Create checkbox and span for task name
function addTaskInfo(liNewTask, newTask) {
    // Creating task info div and components
    const divTaskInfo = document.createElement("div");
    divTaskInfo.classList.add("task-info");

    const checkNewTask = document.createElement("input");
    checkNewTask.type = "checkbox";

    const spanNewTask = document.createElement("span");
    spanNewTask.classList.add("task-name");
    spanNewTask.textContent = newTask;

    divTaskInfo.appendChild(checkNewTask);
    divTaskInfo.appendChild(spanNewTask);

    liNewTask.append(divTaskInfo);

    // Add change checkbox events to the new task
    checkNewTask.addEventListener("change", () => {

        if (checkNewTask.checked) {
            spanNewTask.classList.add("done-task");
            document.getElementById("ulClosedTasks").appendChild(liNewTask);

        } else {
            spanNewTask.classList.remove("done-task");
            document.getElementById("ulOpenTasks").appendChild(liNewTask);

        }

        refreshTodoroData();

    });

}

// Add action buttons for the new task
function addTaskButons(liNewTask) {
    // Creating task buttons div and components
    const divTaskButtons = document.createElement("div");
    divTaskButtons.classList.add("task-buttons");

    // btnMenu
    const btnMenu = document.createElement("button");
    btnMenu.classList.add("btn-borderless", "btn-menu");

    const imgMenu = document.createElement("img");
    imgMenu.src = "./images/menu.png";
    imgMenu.alt = "Menu de tarea"
    imgMenu.width = 12;

    btnMenu.appendChild(imgMenu);

    console.log(btnMenu);

    // btnErase
    const btnErase = document.createElement("button");
    btnErase.classList.add("btn-borderless", "btn-erase", "hide");

    const imgErase = document.createElement("img");
    imgErase.src = "./images/erase.png";
    imgErase.alt = "Eliminar tarea"
    imgErase.width = 18;

    btnErase.appendChild(imgErase);

    // btnEdit
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btn-borderless", "btn-edit", "hide");

    const imgEdit = document.createElement("img");
    imgEdit.src = "./images/edit.png";
    imgEdit.alt = "Editar tarea";
    imgEdit.width = 16;

    btnEdit.append(imgEdit);

    divTaskButtons.appendChild(btnMenu);
    divTaskButtons.appendChild(btnErase);
    divTaskButtons.appendChild(btnEdit);

    liNewTask.append(divTaskButtons);

    // Adding functionality to the buttons

    btnMenu.addEventListener("click", () => showMenu(divTaskButtons));

    btnErase.addEventListener("click", () => {
        liNewTask.remove();
        refreshTodoroData();
    })

    document.addEventListener("click", (e) => {
        if (!divTaskButtons.contains(e.target)) {
            hideMenu(divTaskButtons);
        }
    })
}

function showMenu(btnGroup) {
    btnGroup.children[0].classList.add("hide");
    btnGroup.children[1].classList.remove("hide");
    btnGroup.children[2].classList.remove("hide");
}

function hideMenu(btnGroup) {
    btnGroup.children[0].classList.remove("hide");
    btnGroup.children[1].classList.add("hide");
    btnGroup.children[2].classList.add("hide");
}

function addDragEvents(liNewTask) {
    // Adding touch and drag events to the new task
    // Touch for mobile
    liNewTask.addEventListener("touchstart", () => {
        liNewTask.classList.add("active-task");
    });

    liNewTask.addEventListener("touchmove", (e) => {
        rearrangeList(liNewTask, e.targetTouches[0].clientY);
    })

    liNewTask.addEventListener("touchend", () => {
        liNewTask.classList.remove("active-task");
    });

    // Drag for desktop
    liNewTask.addEventListener("dragstart", () => {
        liNewTask.classList.add("active-task");
    });

    liNewTask.addEventListener("drag", (e) => {
        rearrangeList(liNewTask, e.clientY);
    })

    liNewTask.addEventListener("dragend", () => {
        liNewTask.classList.remove("active-task");
    });
}


// *** Feature: Rearrange list on drag and drop ***

// Function needed for dragging tasks over the lists
document.querySelectorAll(".list").forEach((list) => {
    list.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
});

// Function for rearranging the list's tasks
function rearrangeList(activeTask, clientY) {

    if (clientY !== 0) {

        let closestTask = null;
        let minDistance = Number.NEGATIVE_INFINITY;

        const list = activeTask.parentElement;
        const nonActiveTasks = list.querySelectorAll(".task:not(.active-task)");

        nonActiveTasks.forEach((task) => {

            const taskY = task.getBoundingClientRect().top;
            const distance = clientY - taskY;

            if (distance < 0 && distance > minDistance) {
                minDistance = distance;
                closestTask = task;
            }


        });

        if (closestTask === null) {
            list.appendChild(activeTask);
        } else {
            list.insertBefore(activeTask, closestTask);
        }

    }

}