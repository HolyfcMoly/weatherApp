window.addEventListener("DOMContentLoaded", () => {
    const leftInfo = document.querySelector(".left_info");
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const btns = document.querySelectorAll(".header_list_item-btn");
    const themeBtn = document.querySelector(".header_list_item-btn--theme");
    const wrapper = document.querySelector('.wrapper');
    const leftDigit = wrapper.querySelector('.left_info_weather--text h2');
    const rightDigit = wrapper.querySelector('.right_info_list_item-degrees-day');
    const degrees = wrapper.querySelector('.left_info_weather--degrees');
    let isCelsius = true;
    let temperature = 12; 
    // console.log(typeof +leftDigit.innerHTML)

    function convertTemperature(trigger) {
        if (isCelsius) {
            temperature = +leftDigit.innerHTML
            let fahrenheit = (temperature * 9/5) + 32;
            leftDigit.innerHTML = Math.round(fahrenheit);
            degrees.innerHTML = "°F"
        } else {
            leftDigit.innerHTML = temperature;
            degrees.innerHTML = "°C"
        }
    }

    function toggleTemperature() {
        isCelsius = !isCelsius;
        convertTemperature();
    }

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
        if (!this.classList.contains("active-btn")) {
            btns.forEach((btn) => btn.classList.remove("active-btn"));
            this.classList.add("active-btn");
            toggleTemperature();
        }
    }

    function switchTheme() {
        const icon = themeBtn.querySelector('svg');
        const body = document.querySelector('body');
        if (icon.classList.contains("feather-moon")) {
            themeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" 
            stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-sun">
            <circle cx="12" cy="12" r="5"></circle>
            <path d="M12 1v2m0 18v2M4 4l2 2m12 12 2 2M1 12h2m18 0h2M4 20l2-2M18 6l2-2"></path>
            </svg>
            `;
            body.classList.add('dark')
            themeBtn.classList.remove('fadeInDown');
            themeBtn.classList.add('fadeInUp');
        } else {
            themeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
            stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-moon">
            <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
            </svg>
            `;
            body.classList.remove('dark')
            themeBtn.classList.add('fadeInDown');
            themeBtn.classList.remove('fadeInUp');
        }
    }

    toggleTemperature();
    handleScreenChange(mediaQuery);
    mediaQuery.addEventListener("change", handleScreenChange);
    themeBtn.addEventListener("click", switchTheme);
    btns.forEach((btn) => btn.addEventListener("click", toggleBtnClass));
});
