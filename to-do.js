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



// Feature: Create new tasks
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
    liNewTask.draggable = "true";

    const checkNewTask = document.createElement("input");
    checkNewTask.type = "checkbox";

    const spanNewTask = document.createElement("span");
    spanNewTask.contenteditable = "true";
    spanNewTask.spellcheck = "false";
    spanNewTask.textContent = newTask;

    liNewTask.appendChild(checkNewTask);
    liNewTask.appendChild(spanNewTask);

    // Add to the list of open Tasks
    document.getElementById("ulOpenTasks").appendChild(liNewTask);

    // If it's a non pre - existing task, then add to localStorage
    if (!previous) {
        data.openTasks.push(newTask);
        saveTodoroData();
    }

    // Add drag events to the new task
    liNewTask.addEventListener("dragstart", () => {
        liNewTask.classList.add("active-task");
    });

    liNewTask.addEventListener("dragend", (e) => {
        // Prevent default to admit tasks reordering
        e.preventDefault();

        liNewTask.classList.remove("active-task");
    });

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


    // Reset input value and focus on it
    document.getElementById("txtNewTask").value = "";
    document.getElementById("txtNewTask").focus();
}