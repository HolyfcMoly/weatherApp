window.addEventListener("DOMContentLoaded", () => {
    const apiKey = 'd37689ff161e969e2d476005a81a5492';
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const wrapper = document.querySelector('.wrapper');
    const leftInfo = wrapper.querySelector(".left_info");
    const todayWeather = document.querySelector('.right_info-grid');
    const forecastSection = document.querySelector('.right_info_list');
    const btns = document.querySelectorAll(".header_list_item-btn");
    const themeBtn = document.querySelector(".header_list_item-btn--theme");
    const leftDigit = wrapper.querySelector('.left_info_weather--text h2');
    const rightDigit = wrapper.querySelector('.right_info_list_item-degrees-day');
    const degrees = wrapper.querySelector('.left_info_weather--degrees');
    const searchBtn = document.querySelector('.input_container_search-btn');
    const input = document.querySelector('[data-search-field]');
    const searchList = document.querySelector('.left_info-search-result');
    const defaultLocation = '#/weather?lat=55.7522&lon=37.6156' // Moscow;
    const currentLocationBtn = document.querySelector('[data-current-location-btn]');
    const container = document.querySelector('.left_info ');
    const feelLike = document.querySelector('.weather-info__feelLike p');
    const feelLikeDegrees = document.querySelector('.weather-info__feelLike p').nextElementSibling
    
    let isCelsius = true;
    let searchTimeout = null;
    const searchTimeoutDuration = 500;
    
        const fetchData = (url, callback) => {
            fetch(`${url}&appid=${apiKey}`)
                .then(res => res.json())
                .then(data => callback(data))
        }

        const url = {
            currentWeather(lat, lon) {
                return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric&lang=ru`
            },
            forecast(lat, lon) {
                return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}`
            },
            reverseGeo(lat, lon) {
                return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
            },
            /*
            * @param {string} query поиск например 'London', 'New York'
            */
            geo(query) {
                return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
            },
        }

        const weekDayNames = [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ];

        const monthNames = [
            'Янв',
            'Фев',
            'Мар',
            'Апр',
            'Май',
            'Июн',
            'Июл',
            'Авг',
            'Сен',
            'Окт',
            'Ноя',
            'Дек',
        ];

        const weatherNow = [
            'Дождь',
            'Гроза',
            'Ясно',
            'Облачно',
            'Небольшой дождь',
            'Снег',
            'Небольшая облачность',
            'Переменная облачность',
            'Туман',
        ];

        const getDate = function(dateUnix, timezone) {
            const date = new Date((dateUnix + timezone) * 1000);
            const weekDayName = weekDayNames[date.getUTCDay()];
            const monthName = monthNames[date.getUTCMonth()];

            return `${weekDayName}, ${monthName} ${date.getUTCDate()}`
        }

        function getTime(timezone) {
            const offset = -new Date().getTimezoneOffset();
            const timestamp = Date.now() - offset * 60 * 1000;
            const now = new Date(timestamp);
            const timeForTimeZone = new Date(now.getTime() + (timezone * 1000))
            const hour = timeForTimeZone.getHours();
            const minutes = timeForTimeZone.getMinutes();

            return `${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`
        }

        const currentLocation = () => {
            window.navigator.geolocation.getCurrentPosition(res => {
                const {latitude, longitude} = res.coords;

                checkWeather(`lat=${latitude}, lon=${longitude}`);
            }, err => {
                window.location.hash = defaultLocation;
            })
        }

        const searchedLocation = query => checkWeather(...query.split('&'))

        const routes = new Map([
            ['/current-weather', currentLocation],
            ['/weather', searchedLocation]
        ]);

        const checkHash = () => {
            const requestURL = window.location.hash.slice(1)
        
            const [route, query] = requestURL.includes ? requestURL.split('?') : [requestURL];

            routes.get(route) ? routes.get(route)(query) : 'error404()';
        }

        window.addEventListener('hashchange', checkHash);
        window.addEventListener('load', () => {
            if(!window.location.hash) {
                window.location.hash = '#/current-location'
            } else {
                checkHash();
            }
        })

        function checkWeather(lat, lon) {
            // leftInfo.innerHTML = '';
            // todayWeather.innerHTML = '';
            // forecastSection.innerHTML = '';

            if(window.location.hash === '#/current-location') {
                currentLocationBtn.setAttribute('disabled', '')
            } else {
                currentLocationBtn.removeAttribute('disabled');
            }

            fetchData(url.currentWeather(lat, lon), (currentWeather) => {
                const {
                    weather,
                    dt: dateUnix,
                    sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
                    main:{temp, humidity, pressure, feels_like},
                    wind: {speed, deg},
                    visibility,
                    timezone
                } = currentWeather;
                console.log(currentWeather)
                const [{description, icon}] = weather;
                leftDigit.innerHTML = parseInt(temp);
                document.querySelector('.left_info_place-date--day').innerHTML = `${getDate(dateUnix,timezone)}`
                document.querySelector('.left_info_time-text').innerHTML = `${getTime(timezone)}`;

                let sunrise = new Date(sunriseUnixUTC * 1000);
                const localSunrise = new Date(sunrise.getTime() + timezone * 1000);
                const sunriseHour = localSunrise.getUTCHours();
                const sunriseMinutes = localSunrise.getUTCMinutes();

                let sunset = new Date(sunsetUnixUTC * 1000);
                const localSunset = new Date(sunset.getTime() + timezone * 1000);
                const sunsetHour = localSunset.getUTCHours();
                const sunsetMinutes = localSunset.getUTCMinutes();
                
                document.querySelector('.weather-info__sunrise p').innerHTML = `
                ${sunriseHour < 10 ? '0' : ''}${sunriseHour}
                :${sunriseMinutes < 10 ? '0' : ''}${sunriseMinutes}`;

                document.querySelector('.weather-info__sunset p').innerHTML = `
                ${sunsetHour < 10 ? '0' : ''}${sunsetHour}
                :${sunsetMinutes < 10 ? '0' : ''}${sunsetMinutes}`;


                document.querySelector('.left_info_weather-now-text').innerHTML = description;
                
                document.querySelector('.weather-info__feelLike p').innerHTML = Math.floor(parseInt(feels_like))
                document.querySelector('.weather-info__pressure p').innerHTML = pressure;
                document.querySelector('.weather-info__wind p').innerHTML = speed;
                document.querySelector('.weather-info__hum p').innerHTML = humidity;
                document.querySelector('.weather-info__visability p').innerHTML = visibility / 1000;

                const degrees = deg

                document.querySelector('.weather-info__deg svg').style.transform = `rotate(${degrees}deg)`
                const direction = document.querySelector('.weather-info__deg p');
                windDirection(direction, degrees);

                fetchData(url.reverseGeo(lat, lon), function([{name, country}]) {
                    document.querySelector('.left_info_place--text').innerHTML = `${name}, ${country}`
                })

                fetchData(url.forecast(lat, lon), (forecast) => {
                    const {
                        list: forecastList,
                        city: {timezone}
                    } = forecast;

                        //24h forecast
                    // for (const [index, data] of forecastList.entries()) {
                    //     if(index > 7) break;

                    //     const {
                    //         dt: dateUnix,
                    //         main:{temp, humidity, pressure},
                    //         wind: {deg, speed},
                    //         weather
                    //     } = data;
                    //     const [{description}] = weather;
                    //     document.querySelectorAll
                    // }
                    forecast.innerHTML = `
                        <ul class="right_info_list d-flex"></ul>
                    `;

                    for (let i = 7, len = forecastList.length; i < len; i+=8) {

                        const {
                            main:{temp_max, humidity, pressure},
                            wind: {deg, speed},
                            weather,
                            dt_txt
                        } = forecastList[i];
                        const [{description}] = weather;
                        const date = new Date(dt_txt);
                        const li = document.createElement('li');
                        li.classList.add("right_info_list_item", "dark-cards", "px-5", "py-5");

                        li.innerHTML = `
                            <h2 class="right_info_list_item-day">${weekDayNames[date.getUTCDay()]}, ${monthNames[date.getUTCMonth()]} ${date.getDate()}</h2>
                            <figure>
                                <svg class="weather_anim-icon" viewBox="0 0 100 100">
                                    <use xlink:href="#rainDrizzle" x="25" y="65"></use>
                                    <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                                        <use xlink:href=" #sun" x="-8" y="-15"></use>
                                    <use xlink:href="#whiteCloud" x="11"></use>
                                    <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8">
                                    </use>
                                </svg>
                            </figure>
                            <div class="right_info_list_item-degrees-day d-flex justify-center">
                                <p class="day-temp">${temp_max}</p>
                                <p class="day-degrees">°C</p>
                            </div>
                            <p class="right_info_list_item-description d-flex justify-center">${description}</p>
                            <div class="right_info_list_item--weather d-flex justify-between">
                                <h2 class="weather-pressure">Давление:</h2>
                                <div class="weather-pressure-info d-flex">
                                    <p>${pressure}</p>
                                    <p>гПа</p>
                                </div>
                                <h2 class="weather-wind-title">Ветер:</h2>
                                <div class="weather-wind-speed d-flex">
                                    <p>${speed}</p>
                                    <p>м/с</p>
                                    <div class="weather-wind__deg d-flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" transform="rotate(${deg})">
                                            <path fill="none" d="M-1-1h582v402H-1z"/>
                                            <path fill="currentColor" transform="rotate(180,128,128)" d="M216 217a16 16 0 0 1-19 3l-70-38-71 37a16 16 0 0 1-19-3 16 16 0 0 1-3-19l80-169a1 1 0 0 1 0-1 16 16 0 0 1 29 1l76 171a16 16 0 0 1-3 18z"/>
                                        </svg>
                                        <p>С-З</p>
                                    </div>
                                </div>
                                <h2 class="weather-hum">Влажность</h2>
                                <div class="weather-hum-info d-flex">
                                    <p>${humidity}</p>
                                    <p>%</p>
                                </div>
                            </div>
                        `;
                        const rightInfo = document.querySelector('.right_info');
                        
                        rightInfo.querySelector('.right_info_list').appendChild(li)
                    }

                    console.log(forecast, 'forecast')
                })
            })
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
    const daysTemp = document.querySelectorAll('.day-temp');
    const daysDegrees = document.querySelectorAll('.day-degrees');

    function convertTemperature(temp, degrees = '°C') {
        const temperature = parseInt(temp.textContent);
        if (isCelsius) {
            const converted = Math.round((temperature * 9/5) + 32);
            temp.innerHTML = converted;
        } else {
            const converted = Math.round((temperature - 32) * 5/9);
            temp.innerHTML = converted;
        }
        degrees.textContent = isCelsius ? '°F' : '°C';
    }
    
    function toggleTemperature() {
        isCelsius = !isCelsius;
        convertTemperature(leftDigit, degrees);
        convertTemperature(feelLike,feelLikeDegrees);
        daysTemp.forEach((temp, i) => {
            console.log(temp.textContent); 
            convertTemperature(temp, daysDegrees[i])
        });
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


    searchBtn.addEventListener('click', () => {
        searchList.classList.toggle('active');
        if(searchList.classList.contains('active')) {
            const searchItems = document.querySelectorAll('[data-search-toggler]')
            searchItems.forEach(item => item.addEventListener('click', () => searchList.classList.remove('active')))
        }
        checkWeather(input.value);
        input.value = '';
    });

    input.addEventListener('input', () => {
        if(searchTimeout) {
            clearInterval(searchTimeout);
        }

        if(!input.value) {
            searchList.classList.remove('active')
            searchList.innerHTML = ''
            input.classList.remove('searching')
        } else {
            input.classList.add('searching')
        }

        if(input.value) {
            searchTimeout = setTimeout(() => {
                fetchData(url.geo(input.value), function(locations) {
                    input.classList.remove('searching');
                    searchList.classList.add('active');
                    searchList.innerHTML = `
                        <ul class="view-list dropdown" data-search-list></ul>
                    `;
                    const items = [];
                    for (const {name, lat, lon, country, state} of locations) {
                        const searchItem = document.createElement('li');
                        searchItem.classList.add('view-item');

                        searchItem.innerHTML = `
                            <div>
                                <p class="view-item-title">${name}</p>
                                <p class="view-item-subtitle">${state || ''}, ${country}</p>
                            </div>
                            <a href="#/weather?lat=${lat}&lon=${lon}" aria-label='${name} weather' data-search-toggler></a>
                        `;
                        searchList.querySelector('[data-search-list]').appendChild(searchItem);
                        items.push(searchItem.querySelector('[data-search-toggler]'))
                        searchItem.addEventListener('click', (e) => {
                            const link = e.currentTarget.querySelector('[data-search-toggler]')
                                if(link) {
                                    link.click();
                                    input.value = '';
                                    searchList.classList.remove('active');
                                }
                        })
                    }
                })
            }, searchTimeoutDuration)
        }
    })

    // input.addEventListener('keydown', (e) => {
    //     if(e.keyCode === 13) {
    //         checkWeather(input.value);
    //         input.value = '';
    //     }
    // })
});