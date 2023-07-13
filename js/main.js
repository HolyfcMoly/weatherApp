window.addEventListener("DOMContentLoaded", () => {
    const apiKey = '0f14f6df785ce6eb97b04d873ae40fd8';
    const leftInfo = document.querySelector(".left_info");
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const btns = document.querySelectorAll(".header_list_item-btn");
    const themeBtn = document.querySelector(".header_list_item-btn--theme");
    const wrapper = document.querySelector('.wrapper');
    const leftDigit = wrapper.querySelector('.left_info_weather--text h2');
    const rightDigit = wrapper.querySelector('.right_info_list_item-degrees-day');
    const degrees = wrapper.querySelector('.left_info_weather--degrees');
    const searchBtn = document.querySelector('.input_container_search-btn');
    const input = document.querySelector('.input_search');
    let isCelsius = true;
    
    
        fetch('city.list.json')
            .then(res => res.json())
            .then(data => {
                data.forEach(obj => {
                    const cityObj = {
                        id: obj.id,
                        city: obj.name,
                        country: obj.country
                    }
                    return cityObj
                })
            })


        async function checkWeather(city = 'Moscow') {

        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`
        const response = await fetch(apiUrl);
        const data = await response.json()
        console.log(data, 'data')

        document.querySelector('.left_info_place--text').innerHTML = data.city.name;
        leftDigit.innerHTML = Math.round(data.list[0].main.temp);

        let sunrise = new Date(data.city.sunrise * 1000);
        const sunriseHour = sunrise.getHours();
        const sunriseMinutes = sunrise.getMinutes();

        let sunset = new Date(data.city.sunset * 1000);
        const sunsetHour = sunset.getHours();
        const sunsetMinutes = sunset.getMinutes();
        
        document.querySelector('.weather-info__sunrise p').innerHTML = `
        ${sunriseHour < 10 ? '0' : ''}${sunriseHour}
        :${sunriseMinutes < 10 ? '0' : ''}${sunriseMinutes}`;

        document.querySelector('.weather-info__sunset p').innerHTML = `
        ${sunsetHour < 10 ? '0' : ''}${sunsetHour}
        :${sunsetMinutes < 10 ? '0' : ''}${sunsetMinutes}`;

        document.querySelector('.weather-info__wind p').innerHTML = data.list[0].wind.speed;
        document.querySelector('.weather-info__hum p').innerHTML = data.list[0].main.humidity;
        document.querySelector('.weather-info__visability p').innerHTML = data.list[0].visibility / 1000;
        document.querySelector('.weather-info__pressure p').innerHTML = data.list[0].main.pressure;

        const deg = data.list[0].wind.deg

        document.querySelector('.weather-info__deg svg').style.transform = `rotate(${deg}deg)`
        const direction = document.querySelector('.weather-info__deg p');
        windDirection(direction, deg);
    }

    function windDirection(trigger, deg) {
        const directions = {
            "0-15" : "С",
            "15-75" : "С-В",
            "75-105" : "В",
            "105-165" : "Ю-В",
            "165-195" : "Ю",
            "195-255" : "Ю-З",
            "255-285" : "З",
            "285-345" : "С-З",
            "345-360" : "C",
        }

        let number = deg;
        Object.entries(directions).forEach(([range, dir]) => {
            const [start, end] = range.split('-');
            if(number >= start && number <= end) {
                trigger.innerHTML = dir
            }
        })
    }

    function date() {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        document.querySelector('.left_info_time-text').innerHTML = `
        ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}
        `
    }

    function convertTemperature(trigger, degrees = '°') {
        let temperature = +trigger.innerHTML;
        if (isCelsius) {
            let fahrenheit = (temperature * 9/5) + 32;
            trigger.innerHTML = Math.round(fahrenheit);
            degrees.innerHTML = "°F"
        } else {
            let celsius = (temperature - 32) * 5/9;
            trigger.innerHTML = Math.round(celsius);
            degrees.innerHTML = "°C"
        }
    }

    function toggleTemperature() {
        isCelsius = !isCelsius;
        convertTemperature(leftDigit);
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

    checkWeather()
    date();
    toggleTemperature();
    handleScreenChange(mediaQuery);
    mediaQuery.addEventListener("change", handleScreenChange);
    themeBtn.addEventListener("click", switchTheme);
    btns.forEach((btn) => btn.addEventListener("click", toggleBtnClass));
    searchBtn.addEventListener('click', () => {
        checkWeather(input.value);
        input.value = '';
    });
    input.addEventListener('keydown', (e) => {
        if(e.keyCode === 13) {
            checkWeather(input.value);
            input.value = '';
        }
    })
});
