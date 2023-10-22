const modalTutorialContainer = document.getElementById("modalTutorialContainer");

function openModalTutorial() {
    modalTutorialContainer.classList.remove("hidden");
}

function closeModalTutorial() {
    modalTutorialContainer.classList.add("hidden");
}

// Close modal tutorial on click outside of the modal
modalTutorialContainer.addEventListener("click", (e) => {

    if (!document.getElementById("modalTutorial").contains(e.target)) {
        closeModalTutorial();
    }

});

const carouselBtns = document.querySelectorAll(".btn-carousel");
const slides = [...document.querySelectorAll(".slide")];
const positionBtns = [...document.querySelectorAll(".btn-position")];

// Functino for changing the Slide
function changeSlide(activeIndex, newIndex) {

    slides[newIndex].dataset.activeSlide = true;
    positionBtns[newIndex].dataset.activePosition = true;

    delete slides[activeIndex].dataset.activeSlide;
    delete positionBtns[activeIndex].dataset.activePosition;

}

// Change slides from the carousel buttons
carouselBtns.forEach((btn) => {
    btn.addEventListener("click", () => {

        const offset = btn.dataset.carouselBtn === "prev" ? -1 : 1;

        const activeSlide = document.querySelector("[data-active-slide]");
        const activeIndex = slides.indexOf(activeSlide);

        let newIndex = activeIndex + offset;

        if (newIndex < 0) {
            newIndex = slides.length - 1;

        } else if (newIndex >= slides.length) {
            newIndex = newIndex - slides.length;

        }

        changeSlide(activeIndex, newIndex);

    });
});

// Change slides from the position buttons
positionBtns.forEach((btn) => {

    btn.addEventListener("click", () => {
        
        const activePosition = document.querySelector("[data-active-position]");
        const activeIndex = positionBtns.indexOf(activePosition);
        
        const newIndex = positionBtns.indexOf(btn);

        changeSlide(activeIndex, newIndex);
        

    });

});