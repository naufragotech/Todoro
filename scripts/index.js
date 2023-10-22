// Open the tutorial at window loading
window.onload = () => {
    openModalTutorial();
}

// Close all modals params on 'Escape' key
window.addEventListener("keydown", () => {
    closeModalTutorial();
    closeModalParams();
});