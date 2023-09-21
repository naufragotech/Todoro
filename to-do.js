// Initialize the global arrays openTasks and closedTasks
// The openTasks are store in localStorage as a string separated by ';;;'
let openTasks = localStorage.getItem("Todoro_openTasks");

// Check if is the first time opened the app (Todoro_openTasks not exist)
if (openTasks === null) {

    // Creates Todoro_openTasks in localStorage
    localStorage.setItem("Todoro_openTasks", "");
    openTasks = [];

} else if (openTasks === "") {

    openTasks = [];

} else {

    openTasks = openTasks.split(";;;");

    // Create all the tasks in the main view
    openTasks.forEach((task) => {
        createNewTask(task, true);
    });
}

// Errase previous closed tasks / create Todoro_closedTasks in localStorage
localStorage.setItem("Todoro_closedTasks", "");
let closedTasks = [];


// Feature: Create new tasks
document.getElementById("btnNewTask").addEventListener("click", (e) => {
    
    // Prevent Default in order to not refresh the page
    e.preventDefault();

    const newTask = document.getElementById("txtNewTask").value;
    createNewTask(newTask);

});


function createNewTask(newTask, existing = false) {

    if (newTask !== "") {        

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
        if (!existing) {
            openTasks.push(newTask);
            localStorage.setItem("Todoro_openTasks", openTasks.join(";;;"));
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
                openTasks = openTasks.filter(t => t !== newTask);
                localStorage.setItem("Todoro_openTasks", openTasks.join(";;;"));

                // Add to closedTasks array
                closedTasks.push(newTask);
                localStorage.setItem("Todoro_closedTasks", closedTasks.join(";;;"));


            } else {

                spanNewTask.classList.remove("done-task");
                document.getElementById("ulOpenTasks").appendChild(liNewTask);

                // Filter from closedTasks array
                closedTasks = closedTasks.filter(t => t !== newTask);
                localStorage.setItem("Todoro_closedTasks", closedTasks.join(";;;"));

                // Add to openTasks array again
                openTasks.push(newTask);
                localStorage.setItem("Todoro_openTasks", openTasks.join(";;;"));
            }
        });


        // Reset input value and focus on it
        document.getElementById("txtNewTask").value = "";
        document.getElementById("txtNewTask").focus();
    }
}