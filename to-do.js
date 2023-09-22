// Initialize the global data object stored in localStorage
let data = localStorage.getItem("Todoro_data");

// Check if is the first time opened the app (Todoro_data not exist)
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

// Auxiliary function to improve readibility
function saveTodoroData() {
    localStorage.setItem("Todoro_data", JSON.stringify(data));
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

    // The li serves as container for the check and span
    const liNewTask = document.createElement("li");
    liNewTask.classList.add("task");
    liNewTask.draggable = true;

    const checkNewTask = document.createElement("input");
    checkNewTask.type = "checkbox";

    const spanNewTask = document.createElement("span");
    spanNewTask.textContent = newTask;

    liNewTask.appendChild(checkNewTask);
    liNewTask.appendChild(spanNewTask);

    // Add to the list of open Tasks
    document.getElementById("ulOpenTasks").appendChild(liNewTask);

    // If it isn't a pre-existing task, then add to localStorage
    if (!previous) {
        data.openTasks.push(newTask);
        saveTodoroData();
    }

    // Add change checkbox events to the new task
    checkNewTask.addEventListener("change", () => {

        if (checkNewTask.checked) {
            spanNewTask.classList.add("done-task");
            document.getElementById("ulClosedTasks").appendChild(liNewTask);

            // Filter from the openTasks array
            data.openTasks = data.openTasks.filter(t => t !== newTask);

            // Add to closedTasks array
            data.closedTasks.push(newTask);

            saveTodoroData();

        } else {

            spanNewTask.classList.remove("done-task");
            document.getElementById("ulOpenTasks").appendChild(liNewTask);

            // Filter from closedTasks array
            data.closedTasks = data.closedTasks.filter(t => t !== newTask);

            // Add to openTasks array again
            data.openTasks.push(newTask);

            saveTodoroData();
        }
    });

    // Add touch and drag events to the new task
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

    // Reset input value and focus on it
    document.getElementById("txtNewTask").value = "";
    document.getElementById("txtNewTask").focus();
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