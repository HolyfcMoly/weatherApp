// класс Popup представляет всплывающее окно
export default class Popup {
    constructor() {
        this.popupEl = document.querySelector(".popup-alert");
        this.close = document.querySelector(".close");
        this.btn = document.querySelector(".more-btn");
    }
    // функция принимающая 2 параметра, сам trigger и закрывающий элемент
    popup(trigger, closeEl) {
        trigger.classList.add("fadeDown");
        trigger.classList.add("popup-active");
        closeEl.addEventListener("click", (e) => {
            if (e.target) {
                trigger.classList.remove("fadeDown");
                trigger.classList.remove("popup-active");
            }
        });
        setTimeout(() => {
            trigger.classList.remove("fadeDown");
            trigger.classList.remove("popup-active");
        }, 60000);
    }
    // функция для показа скрытого контента
    more() {
        const popupContent = document.querySelector(".popup-alert-hide");
        popupContent.classList.remove("hide");
        if (!popupContent.classList.contains("hide")) {
            this.btn.classList.add("hidden");
        } else {
            this.btn.classList.remove("hidden");
        }
    }
    // функция запуска
    init() {
        this.popup(this.popupEl, this.close);
        this.btn.addEventListener("click", () => this.more());
    }
}