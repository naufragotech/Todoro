const modalParamsContainer = document.getElementById("modalParamsContainer");

function openModalParams() {
    modalParamsContainer.classList.remove("hidden");
}

function closeModalParams() {
    modalParamsContainer.classList.add("hidden");
}

// Close modal params on click outside of the modal
modalParamsContainer.addEventListener("click", (e) => {

    if (!document.getElementById("modalParams").contains(e.target)) {
        closeModalParams();
    }

});

// Show the value of the range input via the span associated
document.querySelectorAll("input[type='range']").forEach((inp) => {
    inp.addEventListener("input", () => {
        document.getElementById("span" + inp.id.slice(3,)).textContent = inp.value;
    })
});

// Timer as a global variable
const timer = document.getElementById("timer");

// Auxiliary function to setTimer
function setTimer(min, sec) {

    let timeString = "";

    timeString = String(min).length > 1 ? String(min) : `0${min}`;
    timeString += ":";
    timeString += String(sec).length > 1 ? String(sec) : `0${sec}`;

    timer.textContent = timeString;
}


// Global variables for timer state
let active = false;
let paused = false;


async function startPomodoro() {
    active = true;
    paused = false;

    // Get the params value to start Pomodoro
    const work = parseInt(document.getElementById("rngWork").value);
    const rest = parseInt(document.getElementById("rngRest").value);
    const reps = parseInt(document.getElementById("rngReps").value);

    document.getElementById("btnPomodoro").classList.add("hidden");

    document.getElementById("timerBar").classList.remove("hidden");

    closeModalParams();

    let i = 0;
    const cycleDescrip = document.getElementById("cycleDescrip");
    const cycleCounter = document.getElementById("cycleCounter");

    while (active && i < reps) {

        try {

            cycleDescrip.textContent = "Trabajo 💪";
            cycleCounter.textContent = `${i + 1} / ${reps}`;
            await countDown(work);

            if (rest !== 0) {
                cycleDescrip.textContent = "Descanso 😴";
                await countDown(rest);
            }
            i++;

        } catch {
            setTimer(0, 0);
        }

    }

    stopPomodoro();

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

    });
}

// Control functions (pause - continue - stop)
const btnPause = document.getElementById("btnPause");
const btnContinue = document.getElementById("btnContinue");

function pausePomodoro() {
    paused = true;

    btnPause.classList.add("hidden");
    btnContinue.classList.remove("hidden");
}

function continuePomodoro() {
    paused = false;

    btnContinue.classList.add("hidden");
    btnPause.classList.remove("hidden");
}

function stopPomodoro() {
    active = false;

    btnContinue.classList.add("hidden");
    btnPause.classList.remove("hidden");

    document.getElementById("timerBar").classList.add("hidden");
    document.getElementById("btnPomodoro").classList.remove("hidden");
}