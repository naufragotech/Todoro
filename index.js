// Función para crear nuevas tareas
document.getElementById("btnNuevaTarea").addEventListener("click", (e) => {
    const txtNuevaTarea = document.getElementById("txtNuevaTarea").value;

    if (txtNuevaTarea !== "") {
        // Prevent Default para que no actualice la página
        e.preventDefault();

        // Se crea el nuevo elemento li como contenedor
        const liNuevaTarea = document.createElement("li");
        liNuevaTarea.classList.add("task");
        liNuevaTarea.draggable = "true";

        const checkNuevaTarea = document.createElement("input");
        checkNuevaTarea.type = "checkbox";

        const spanNuevatarea = document.createElement("span");
        spanNuevatarea.contenteditable = "true";
        spanNuevatarea.spellcheck = "false";
        spanNuevatarea.textContent = txtNuevaTarea;

        // Se añade el checkbox y el span al elemento li
        liNuevaTarea.appendChild(checkNuevaTarea);
        liNuevaTarea.appendChild(spanNuevatarea);

        // Se agrega a la lista de tareas
        document.getElementById("tareasAbiertas").appendChild(liNuevaTarea);

        // Se resetea el valor del input
        document.getElementById("txtNuevaTarea").value = "";
        document.getElementById("txtNuevaTarea").focus();

        // Agregar eventos de arrastrado (drag) a la tarea
        // Cuando inicie el drag, agregarle la clase 'active-task'
        liNuevaTarea.addEventListener("dragstart", () => {
            liNuevaTarea.classList.add("active-task");
        });

        // Cuando termine el drag, quitarle la clase 'active-task'
        liNuevaTarea.addEventListener("dragend", (e) => {
            e.preventDefault();
            liNuevaTarea.classList.remove("active-task");
        })

        // Realizar cambios según el estado del checkbox
        checkNuevaTarea.addEventListener("change", () => {
            // Tachar o destachar span (nombre tarea)
            if (checkNuevaTarea.checked) {
                spanNuevatarea.classList.add("done-task");
            } else {
                spanNuevatarea.classList.remove("done-task");
            }

            // Llevar item a la lista de tareas Cerradas
            document.getElementById("tareasCerradas").appendChild(liNuevaTarea);
        });
    }
});

// Abre el modal
function abrirModal() {
    document.getElementById("modalParametros").classList.remove("hide");
}

// Cierra el modal
function cerrarModal() {
    document.getElementById("modalParametros").classList.add("hide");
}

// Actualiza los números cuando detecta un cambio en algún parámetro
document.querySelectorAll("input[type='range']").forEach((inp) => {
    inp.addEventListener("input", () => {
        document.getElementById(inp.id + "Span").textContent = inp.value;
    })
});

// Inicia la funcionalidad de Pomodoro
function iniciarPomodoro() {
    const trabajo = document.getElementById("trabajo").value;
    const descanso = document.getElementById("descanso").value;
    const veces = document.getElementById("veces").value;

    console.log(trabajo, descanso, veces);
}
