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

        // Se agrega a la lista de tareas abiertas
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
                document.getElementById("tareasCerradas").appendChild(liNuevaTarea);
            } else {
                spanNuevatarea.classList.remove("done-task");
                document.getElementById("tareasAbiertas").appendChild(liNuevaTarea);
            }
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

// Cerrar el modal al presionar 'Escape'
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        cerrarModal();
    }
})

// Actualiza los números cuando detecta un cambio en algún parámetro
document.querySelectorAll("input[type='range']").forEach((inp) => {
    inp.addEventListener("input", () => {
        document.getElementById(inp.id + "Span").textContent = inp.value;
    })
});

const timer = document.getElementById("timer");

function setTimer(min, sec) {

    let timeString = "";

    timeString = String(min).length > 1 ? String(min) : `0${min}`;
    timeString += ":";
    timeString += String(sec).length > 1 ? String(sec) : `0${sec}`;

    timer.textContent = timeString;
}

let active = true;
let paused = false;

// Inicia la funcionalidad de Pomodoro
async function iniciarPomodoro() {
    active = true;

    // Capturar los valores de los parámetros
    const trabajo = document.getElementById("trabajo").value;
    const descanso = document.getElementById("descanso").value;
    const veces = document.getElementById("veces").value;

    // Ocultar el botón de configuración de parámetros
    document.getElementById("btnPomodoro").classList.add("hide");

    // Mostrar el temporizador
    document.getElementById("timer-bar").classList.remove("hide");

    cerrarModal();

    let i = 0;
    while (active && i < veces) {

        try {

            document.getElementById("cycle-descrip").textContent = "Trabajo";
            document.getElementById("cycle-counter").textContent = `${i + 1} / ${veces}`;
            await countDown(trabajo);

            document.getElementById("cycle-descrip").textContent = "Descanso";
            await countDown(descanso);
            i++;

        } catch {
            setTimer(0, 0);
            document.getElementById("timer-bar").classList.add("hide");
            document.getElementById("btnPomodoro").classList.remove("hide");
        }

    }

    document.getElementById("timer-bar").classList.add("hide");
    document.getElementById("btnPomodoro").classList.remove("hide");

}

function countDown(min) {
    return new Promise((resolve, reject) => {
        let sec = 0;
        setTimer(min, sec);

        let cd = setInterval(() => {

            if (active && !paused) {
                sec--;
                if (sec < 0) {
                    sec = 59;
                    min--;
                }

                if (min < 0) {
                    resolve();
                    clearInterval(cd);
                } else {
                    setTimer(min, sec);
                }


            } else if (!active) {
                reject();
                clearInterval(cd);
            }

        }, 1000);

    })
}