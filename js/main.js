window.addEventListener("DOMContentLoaded", () => {
    const leftInfo = document.querySelector(".left_info");
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const btns = document.querySelectorAll(".header_list_item-btn");
    const themeBtn = document.querySelector(".header_list_item-btn--theme");

    function handleScreenChange(mediaQuery) {
        if (mediaQuery.matches) {
            switchPadding();
        }
    }

    function switchPadding() {
        if (leftInfo.classList.contains("px-10")) {
            leftInfo.classList.remove("px-10");
            leftInfo.classList.add("px-5");
        } else {
            leftInfo.classList.remove("px-5");
            leftInfo.classList.add("px-10");
        }
    }

    function toggleBtnClass() {
        btns.forEach((btn) => {
            btn.addEventListener("click", () => {
                btns.forEach((btn) => btn.classList.remove("active-btn"));
                btn.classList.add("active-btn");
            });
        });
    }

    function switchTheme() {
        const icon = themeBtn.querySelector('svg');
        if (icon.classList.contains("feather-sun")) {
            themeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-moon">
                <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
            </svg>
            `;
        } else {
            themeBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2m0 18v2M4 4l2 2m12 12 2 2M1 12h2m18 0h2M4 20l2-2M18 6l2-2"></path>
            </svg>
            `;
        }
    }

    handleScreenChange(mediaQuery);
    mediaQuery.addEventListener("change", handleScreenChange);
    btns.forEach((btn) => btn.addEventListener("click", toggleBtnClass));
    themeBtn.addEventListener("click", switchTheme);
});
