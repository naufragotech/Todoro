// Open the tutorial at window loading
window.onload = () => {

    const lastSession = Date.parse(localStorage.getItem("last_session"));
    const today = new Date();
    const MAX_DAYS = 15 * 24 * 60 * 60 * 1000;

    // Show tutorial if it's user first access or hasn't enter in 15 days
    if (isNaN(lastSession) || (today - lastSession) >= MAX_DAYS) {
        openModalTutorial();
    }

    localStorage.setItem("last_session", today.toISOString());
}

// Close all modals params on 'Escape' key
window.addEventListener("keydown", () => {
    closeModalTutorial();
    closeModalParams();
});