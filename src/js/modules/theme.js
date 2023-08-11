export default class ChangeTheme {
    constructor(themeBtn) {
        this.themeBtn = document.querySelector(themeBtn);
    }

    changeTheme = () => {
        this.themeBtn.addEventListener("click", () => {
            const icon = this.themeBtn.querySelector("svg");
            const body = document.querySelector("body");
            if (icon.classList.contains("feather-moon")) {
                this.themeBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" 
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-sun">
                    <circle cx="12" cy="12" r="5"></circle>
                    <path d="M12 1v2m0 18v2M4 4l2 2m12 12 2 2M1 12h2m18 0h2M4 20l2-2M18 6l2-2"></path>
                    </svg>
                    `;
                body.classList.add("dark");
                this.themeBtn.classList.remove("fadeInDown");
                this.themeBtn.classList.add("fadeInUp");
            } else {
                this.themeBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-moon">
                    <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
                    </svg>
                    `;
                body.classList.remove("dark");
                this.themeBtn.classList.add("fadeInDown");
                this.themeBtn.classList.remove("fadeInUp");
            }
        });
    };
}