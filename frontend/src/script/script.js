import {myModule} from "./module.js";

[...document.querySelectorAll(".menu li a")].forEach(function(currentElement, currentIndex){
    if(currentElement.pathname === window.location.pathname) {
        currentElement.classList.add("selected");
    }
});

console.log(myModule, "<<<<<<<<<");

const allInputs = [...document.querySelectorAll(".form input")]

allInputs.forEach((input) => {
    input.addEventListener("keyup", () => {
        
        if (input.value.length >= 3) {
            document.querySelector(".button").classList.remove("disabled");
        } else {
            document.querySelector(".button").classList.add("disabled");
        }
    })
});

