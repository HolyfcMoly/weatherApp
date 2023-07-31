window.addEventListener("DOMContentLoaded", () => {
    const apiKey = 'd37689ff161e969e2d476005a81a5492';
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const wrapper = document.querySelector('.wrapper');
    const leftInfo = wrapper.querySelector(".left_info");
    const todayWeather = document.querySelector('.right_info-grid');
    const forecastSection = document.querySelector('.right_info_list');
    const btns = document.querySelectorAll(".header_list_item-btn");
    const themeBtn = document.querySelector(".header_list_item-btn--theme");
    const searchBtn = document.querySelector('.input_container_search-btn');
    const input = document.querySelector('[data-search-field]');
    const searchList = document.querySelector('.left_info-search-result');
    const defaultLocation = '#/weather?lat=55.7522&lon=37.6156' // Moscow;
    const currentLocationBtn = document.querySelector('[data-current-location-btn]');
    const hourlySection = document.querySelector('.right_info-today');
    const btnMore = document.querySelector('.more-btn');
    const inputContainer = document.querySelector('.input_container')
    const errorContent = document.querySelector('[data-error]');


    
    let days = [];
    let daysDeg = [];
    let originalTemps = [];
    let icons = [];
    let hourlyIcons = [];
    
    let currentWeatherDiv;
    let leftDigitTemp;
    let leftDigitTempDeg;

    let currentWeatherUlGrid;
    let currentDigitTemp;
    let currentDigitTempDeg;

    let isConverted = false;
    let isCelsius = true;
    let searchTimeout = null;
    const searchTimeoutDuration = 500;

    const popupEl = document.querySelector('.popup-alert');
    const closeEl = popupEl.querySelector('.close');

    
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
                return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric&lang=ru`
            },
            reverseGeo(lat, lon) {
                return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
            },
            /*
            * @param {string} query поиск например 'London', 'New York'
            */
            geo(query) {
                return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&lang=ru`
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
                checkWeather(`lat=${latitude}`, `lon=${longitude}`);
            }, err => {
                popup(popupEl, closeEl)
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

            routes.get(route) ? routes.get(route)(query) : error404();
        }

        window.addEventListener('hashchange', checkHash);
        window.addEventListener('load', () => {
            if(!window.location.hash) {
                window.location.hash = '#/current-location'
            } else {
                checkHash();
            }
        })

        const error404 = () => {
            errorContent.innerHTML = `
                <p>Ooops, 404</p>
                <h1>Страница не найдена</h1>
                <a href="#/weather?lat=55.7522&lon=37.6156" class="error-btn active-btn">
                <span>Назад</span>
                </a>
            `;
            errorContent.style.display = 'flex';
            forecastSection.innerHTML = '';
            hourlySection.innerHTML = '';
            currentWeatherDiv.innerHTML = '';
        }

        const weatherIcons = {
            '200_family': `
                <use xlink:href="#rainDrizzle" x="25" y="65"></use>
                <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                <use xlink:href="#grayCloud" fill="url(#gradGray)" x="-7" y="20"></use>
                <use xlink:href="#whiteCloud" x="11"></use>
                <use xlink:href="#thunderBolt" fill="url(#gradYellow)" x="25" y="55"></use>
                <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8"></use>
            `,
            '300_family': `
                <use xlink:href="#rainDrizzle" x="25" y="65"></use>
                <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                <use xlink:href="#whiteCloud" x="11"></use>
                <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8"></use>
            `,
            '500_family_1': `
                <use xlink:href="#rainDrizzle" x="20" y="65"></use>
                <use xlink:href="#rainDrizzle" x="30" y="65""></use>
                <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                <use xlink:href=" #sun" x="-8" y="-15"></use>
                <use xlink:href="#whiteCloud" x="11"></use>
            `,
            '500_family_2': `
                <use xlink:href="#rainDrizzle" x="20" y="65"></use>
                <use xlink:href="#rainDrizzle" x="30" y="65"></use>
                <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                <use xlink:href="#grayCloud" fill="url(#gradGray)" x="-5" y="20"></use>
                <use xlink:href="#whiteCloud" x="11"></use>
                <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8"></use>
            `,
            '600_family': `
                <use xlink:href="#snowFlake" id="snow-b" class="snow" x="25"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="25" y="150"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="85" y="190"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="139" y="150"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="238" y="150"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="190" y="190"></use>
            `,
            '700_family': `
                <use xlink:href="#grayCloud" class="mist_cloud" opacity="0.5" fill="url(#gradGray)" x="10"></use>
                <use xlink:href="#grayCloud" class="mist_cloud-s" opacity="0.5" fill="url(#gradGray)" x="20" y="78"></use>
                <use xlink:href="#grayCloud" class="mist_cloud-s" opacity="0.5" fill="url(#gradGray)" x="30" y="110"></use>
                <use xlink:href="#grayCloud" class="mist_cloud-s" opacity="0.5" fill="url(#gradGray)" x="80" y="95"></use>
                <use xlink:href="#mist" class="mist" x="0" y="50"></use>
            `,
            800: `
                <use xlink:href="#sun"></use>
            `,
            801: `
                <use xlink:href=" #sun" x="-8" y="-15"></use>
                <use xlink:href="#whiteCloud" x="11"></use>
            `,
            802: `
                <use xlink:href="#whiteCloud" x="11"></use>
                <use xlink:href="#whiteCloud" transform="scale(0.7)"></use>
            `,
            '803_family': `
                <use xlink:href="#whiteCloud" x="11"></use>
                <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8"></use>
            `,
        }

        function iconId(weatherId) {
            if(/^300/.test(weatherId)) {
                return '300_family';
            } 
            if(/^50[0-4]/.test(weatherId)) {
                return '500_family_1'
            } 
            if(/^[520-531]/.test(weatherId)) {
                return '500_family_2'
            } 
            if(/^600/.test(weatherId)) {
                return '600_family'
            } 
            if(/^700/.test(weatherId)) {
                return '700_family'
            } 
            if(/^800/.test(weatherId)) {
                return 800
            } 
            if(/^801/.test(weatherId)) {
                return 801
            } 
            if(/^802/.test(weatherId)) {
                return 802
            } 
            if(/^80[3-4]/.test(weatherId)) {
                return '803_family'
            }
        }

        function checkWeather(lat, lon) {
            days = [];
            daysDeg = [];
            icons = [];
            hourlyIcons = [];
            originalTemps = [];
            leftDigitTemp = null;
            currentDigitTemp = null;
            forecastSection.innerHTML = '';
            hourlySection.innerHTML = '';
            errorContent.style.display = 'none'

            const loading = document.querySelector('[data-loading]');
            loading.style.display = 'grid';

            if(currentWeatherDiv && currentWeatherUlGrid) {
                leftInfo.removeChild(currentWeatherDiv)
                todayWeather.removeChild(currentWeatherUlGrid)
            }
            
            if(window.location.hash === '#/current-location') {
                currentLocationBtn.setAttribute('disabled', '')
            } else {
                currentLocationBtn.removeAttribute('disabled');
            }
            fetchData(url.currentWeather(lat, lon), (currentWeather) => {
                const {
                    weather: [current],
                    name,
                    dt: dateUnix,
                    sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC, country},
                    main:{temp, humidity, pressure, feels_like},
                    wind: {speed, deg},
                    visibility,
                    timezone
                } = currentWeather;

                const description = current.description;
                const weatherId = current.id;
                const icon = weatherIcons[iconId(weatherId)]
                const div = document.createElement('div');
                div.classList.add('left-info-content', 'px-5', 'py-5');
                div.innerHTML = `
                    <div class="left_info_weather">
                        <figure>
                            <svg class="left_info_weather-icon" viewBox="0 0 100 100">
                                <use xlink:href="#rainDrizzle" x="25" y="65"></use>
                                <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                                <use xlink:href=" #sun" x="-8" y="-15"></use>
                                <use xlink:href="#whiteCloud" x="11"></use>
                                <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8">
                                </use>
                            </svg>
                        </figure>
                        <div class="left_info_weather--text d-flex ff-rob-thin">
                            <h2>${parseInt(temp)}</h2>
                            <p class="left_info_weather--degrees">°C</p>
                        </div>
                    </div>
                    <div class="left_info_place d-flex justify-between">
                        <h1 class="left_info_place--text">${name}, ${country}</h1>
                        <div class="left_info_place-date d-flex ff-rob-thin">
                            <h1 class="left_info_place-date--day">${getDate(dateUnix,timezone)}</h1>
                        </div>
                    </div>
                    <div class="left_info_weather-now d-flex align-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                        </svg>
                        <p class="left_info_weather-now-text">${description}</p>
                    </div>
                    <div class="left_info_time d-flex align-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="left_info_time-text ff-rob-thin">${getTime(timezone)}</p>
                    </div>
                `;
                currentWeatherDiv = leftInfo.appendChild(div);
                document.querySelector('.left_info_weather-icon').innerHTML = icon;

                leftDigitTemp = document.querySelector('.left_info_weather--text h2');
                leftDigitTempDeg = document.querySelector('.left_info_weather--degrees');
                let sunrise = new Date(sunriseUnixUTC * 1000);
                const localSunrise = new Date(sunrise.getTime() + timezone * 1000);
                const sunriseHour = localSunrise.getUTCHours();
                const sunriseMinutes = localSunrise.getUTCMinutes();

                let sunset = new Date(sunsetUnixUTC * 1000);
                const localSunset = new Date(sunset.getTime() + timezone * 1000);
                const sunsetHour = localSunset.getUTCHours();
                const sunsetMinutes = localSunset.getUTCMinutes();

                const ul = document.createElement('ul');
                ul.classList.add('weather-info');
                ul.innerHTML = `
                    <li class="weather-info-item dark-cards px-5 py-5">
                        <h2 class="weather-info-header">По ощущению</h2>
                        <div class="weather-info__feelLike ff-rob-light d-flex">
                            <p>${Math.floor(parseInt(feels_like))}</p>
                            <p>°C</p>
                        </div>
                    </li>
                    <li class="weather-info-item dark-cards px-5 py-5">
                        <h2 class="weather-info-header">Давление</h2>
                        <div class="weather-info__pressure d-flex justify-center ff-rob-thin">
                            <p>${pressure}</p>
                            <p>гПа</p>
                        </div>
                    </li>
                    <li class="weather-info-item dark-cards px-5 py-5">
                        <h2 class="weather-info-header">Ветер</h2>
                        <div class="weather-info__wind ff-rob-thin d-flex">
                            <p>${speed}</p>
                            <p>м/с</p>
                        </div>
                        <div class="weather-info__deg d-flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                                <path fill="none" d="M-1-1h582v402H-1z"/>
                                <path fill="currentColor" transform="rotate(180,128,128)" d="M216 217a16 16 0 0 1-19 3l-70-38-71 37a16 16 0 0 1-19-3 16 16 0 0 1-3-19l80-169a1 1 0 0 1 0-1 16 16 0 0 1 29 1l76 171a16 16 0 0 1-3 18z"/>
                                </svg>
                                <p>С-З</p>
                                <svg xmlns="http://www.w3.org/2000/svg" class="weather-info_wind-icon" width="24"
                                height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="feather feather-wind">
                                <path
                                    d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2">
                                </path>
                            </svg>
                        </div>
                    </li>
                    <li class="weather-info-item dark-cards px-5 py-5">
                        <h2 class="weather-info-header">Восход & Закат</h2>
                        <div class="weather-info__sunrise d-flex ff-rob-thin">
                            <figure>
                                <svg class="weather-info_anim-icon" viewBox="0 0 100 100">
                                    <use xlink:href="#sun" y="-15"></use>
                                </svg>
                            </figure>
                            <p>${sunriseHour < 10 ? '0' : ''}${sunriseHour}
                                :${sunriseMinutes < 10 ? '0' : ''}${sunriseMinutes}</p>
                        </div>
                        <div class="weather-info__sunset d-flex ff-rob-thin">
                            <figure>
                                <svg class="weather-info_anim-icon" viewBox="0 0 100 100">
                                    <use xlink:href="#star" x="55" y="10"></use>
                                    <use xlink:href="#star" x="65" y="20"></use>
                                    <use xlink:href="#star" x="50" y="30"></use>
                                    <use xlink:href="#moon" x="-8" y="-15"></use>
                                </svg>
                            </figure>
                            <p>${sunsetHour < 10 ? '0' : ''}${sunsetHour}
                                :${sunsetMinutes < 10 ? '0' : ''}${sunsetMinutes}</p>
                        </div>
                    </li>
                    <li class="weather-info-item dark-cards px-5 py-5">
                        <h2 class="weather-info-header">Влажность</h2>
                        <div class="weather-info__hum d-flex">
                            <svg viewBox="0 0 100 100" width="60" height="60">
                                <use xlink:href="#rainDrop" transform="scale(6.5)" x="-2" y="0"></use>
                            </svg>
                            <p class="ff-rob-light">${humidity}</p>
                            <p>%</p>
                        </div>
                    </li>
                    <li class="weather-info-item dark-cards px-5 py-5">
                        <h2 class="weather-info-header">Видимость</h2>
                        <div class="weather-info__visability d-flex">
                            <p class="ff-rob-light">${visibility / 1000}</p>
                            <p>км</p>
                        </div>
                    </li>
                `;
                currentWeatherUlGrid = todayWeather.appendChild(ul);
                currentDigitTemp = document.querySelector('.weather-info__feelLike p');
                currentDigitTempDeg = document.querySelector('.weather-info__feelLike p').nextElementSibling;
                

                document.querySelector('.weather-info__deg svg').style.transform = `rotate(${deg}deg)`
                const direction = document.querySelector('.weather-info__deg p');
                windDirection(direction, deg);

                fetchData(url.reverseGeo(lat, lon), function([{name, country}]) {
                    document.querySelector('.left_info_place--text').innerHTML = `${name}, ${country}`
                })

                fetchData(url.forecast(lat, lon), (forecast) => {
                    const {
                        list: forecastList,
                        city: {timezone}
                    } = forecast;

                    const h2 = document.createElement('h2');
                    h2.classList.add('right_info_header');
                    h2.textContent = `На сегодня`;

                    const list = document.createElement('ul');
                    list.classList.add('right_info-today-list', 'd-flex');
                    list.style.overflowX = 'scroll'

                    hourlySection.appendChild(h2)
                    hourlySection.appendChild(list)
                        // 24h forecast
                    for (const [index, data] of forecastList.entries()) {
                        if(index > 7) break;

                        const {
                            dt_txt,
                            main:{temp},
                            wind: {deg: windDir, speed},
                            weather: [forecast]
                        } = data;

                        const newDate = new Date(dt_txt)
                        const weatherId = forecast.id;
                        const icon = weatherIcons[iconId(weatherId)]
                        hourlyIcons.push(icon)

                        const hours = newDate.getHours();
                        const minutes = newDate.getMinutes();

                        const item = document.createElement('li');
                        item.classList.add("right_info-today-list--item", "px-5", "py-5");
                        item.innerHTML = `
                            <div class="card-today">
                                <p class="today-date ff-rob-thin">${weekDayNames[newDate.getUTCDay()]}, ${newDate.getDate()}</p>
                                <p class="today-time ff-rob-thin">${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}</p>
                                <svg class="today_weather-icon" viewBox="0 0 100 100">
                                    <use xlink:href="#sun"></use>
                                </svg>
                                <div class="d-flex justify-center ff-rob-thin">
                                    <p class="today-temp">${parseInt(temp)}</p>
                                    <p class="today-degrees">°C</p>
                                </div>
                                <div class="today_weather__wind-speed">
                                    <div class="today_weather__wind-deg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256" transform="rotate(${windDir})">
                                            <path fill="none" d="M-1-1h582v402H-1z"/>
                                            <path fill="currentColor" transform="rotate(180,128,128)" d="M216 217a16 16 0 0 1-19 3l-70-38-71 37a16 16 0 0 1-19-3 16 16 0 0 1-3-19l80-169a1 1 0 0 1 0-1 16 16 0 0 1 29 1l76 171a16 16 0 0 1-3 18z"/>
                                        </svg>
                                        <p>С-З</p>
                                    </div>
                                    <div class="d-flex justify-center ff-rob-thin">
                                        <p>${speed}</p>
                                        <p>м/с</p>
                                    </div>
                                </div>
                            </div>
                        `;
                        list.appendChild(item);
                        const todayIcons = document.querySelectorAll('.today_weather-icon');
                        todayIcons.forEach((svg, i) => {
                            svg.innerHTML = hourlyIcons[i]
                        })
                        const directions = document.querySelectorAll('.today_weather__wind-deg p');
                        const svgs = document.querySelectorAll('.today_weather__wind-deg svg');
                        svgs.forEach((svg, i) => {
                            const transform = svg.getAttribute('transform');
                            const degrees = +transform.match(/\d+/)[0]
                            windDirection(directions[i],degrees)
                        });
                        const daysTemp = document.querySelectorAll('.today-temp');
                        const daysDegrees = document.querySelectorAll('.today-degrees');
                        daysTemp.forEach(day=>days.push(day));
                        daysDegrees.forEach(deg=>daysDeg.push(deg))
                    }
                    // 5 days forecast
                    for (let i = 7, len = forecastList.length; i < len; i+=8) {

                        const {
                            main:{temp_max, humidity, pressure},
                            wind: {deg: windDir, speed},
                            weather: [forecast],
                            dt_txt
                        } = forecastList[i];
                        const date = new Date(dt_txt);
                        const description = forecast.description;
                        const weatherId = forecast.id;
                        const icon = weatherIcons[iconId(weatherId)]
                        icons.push(icon);
                        const li = document.createElement('li');
                        li.classList.add("right_info_list_item", "dark-cards", "px-5", "py-5", 'd-flex-column', 'justify-between');
                        li.innerHTML = `
                            <div>
                            <h2 class="right_info_list_item-day ff-rob-thin">${weekDayNames[date.getUTCDay()]}, ${monthNames[date.getUTCMonth()]} ${date.getDate()}</h2>
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
                            <div class="right_info_list_item-degrees-day d-flex justify-center ff-rob-thin">
                                <p class="day-temp">${parseInt(temp_max)}</p>
                                <p class="day-degrees">°C</p>
                                
                            </div>
                            <p class="right_info_list_item-description d-flex justify-center">${description}</p>
                            </div>
                            <div class="right_info_list_item--weather d-flex">
                                <div class="d-flex justify-between">
                                    <h2 class="weather-pressure">Давление:</h2>
                                    <div class="weather-pressure-info d-flex ff-rob-thin">
                                        <p>${pressure}</p>
                                        <p>гПа</p>
                                    </div>
                                </div>
                                <div class="d-flex justify-between">
                                    <h2 class="weather-wind-title">Ветер:</h2>
                                    <div class="weather-wind-speed d-flex ff-rob-thin">
                                        <p>${speed}</p>
                                        <p>м/с</p>
                                        <div class="weather-wind__deg d-flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" transform="rotate(${windDir})">
                                                <path fill="none" d="M-1-1h582v402H-1z"/>
                                                <path fill="currentColor" transform="rotate(180,128,128)" d="M216 217a16 16 0 0 1-19 3l-70-38-71 37a16 16 0 0 1-19-3 16 16 0 0 1-3-19l80-169a1 1 0 0 1 0-1 16 16 0 0 1 29 1l76 171a16 16 0 0 1-3 18z"/>
                                            </svg>
                                            <p>С-З</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-between">
                                    <h2 class="weather-hum">Влажность</h2>
                                    <div class="weather-hum-info d-flex ff-rob-thin">
                                        <svg viewBox="0 0 100 100" width="20" height="20">
                                            <use xlink:href="#rainDrop" transform="scale(5.5)" x="-2" y="2"></use>
                                        </svg>
                                        <p>${humidity}</p>
                                        <p>%</p>
                                    </div>
                                </div>
                            </div>
                        `;
                        const rightInfo = document.querySelector('.right_info');
                        rightInfo.querySelector('.right_info_list').appendChild(li);
                        
                        const iconsEl = document.querySelectorAll('.weather_anim-icon');
                        iconsEl.forEach((svg, i) => {
                            svg.innerHTML = icons[i]
                        })
                        const directions = document.querySelectorAll('.weather-wind__deg p');
                        const svgs = document.querySelectorAll('.weather-wind__deg svg');
                        svgs.forEach((svg, i) => {
                            const transform = svg.getAttribute('transform');
                            const degrees = +transform.match(/\d+/)[0]
                            windDirection(directions[i],degrees)
                        });
                        const daysTemp = document.querySelectorAll('.day-temp');
                        const daysDegrees = document.querySelectorAll('.day-degrees');
                        daysTemp.forEach(day=>days.push(day));
                        daysDegrees.forEach(deg=>daysDeg.push(deg))
                    }
                })
                loading.style.display = 'none';
            })
            resetConversion();
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
    function resetConversion() {
        if(isConverted) {
            isCelsius = false;
            currentDigitTempDeg.textContent = '°C';
            leftDigitTempDeg.textContent = '°C';
            daysDeg.forEach((deg => deg.textContent = '°C'));
            btns.forEach((btn) => {
                btn.textContent === '°F' ? btn.classList.remove("active-btn") : btn.classList.add("active-btn");
            });
            isConverted = false;
        }
    }

    function convertTemperature(temp, degrees = '°C') {
        if(!temp || !degrees) return;
        isConverted = true;
        let temperature;
        if(typeof temp === 'number') {
            temperature = originalTemps[temp];
        }  else {
            temperature = parseInt(temp.textContent)
        }

        let converted;
        if (isCelsius) {
            converted = Math.round((temperature * 9/5) + 32);
            degrees.textContent = '°F';
            daysDeg.forEach((deg => deg.textContent = '°F'));
            temp.innerHTML = converted;
        } else {
            converted = Math.round((temperature - 32) * 5/9);
            degrees.textContent = '°C';
            daysDeg.forEach((deg => deg.textContent = '°C'));
            temp.innerHTML = converted;
        }
        return converted
    }

    function toggleTemperature() {
        isCelsius  = !isCelsius ;
        if(leftDigitTemp) {
            convertTemperature(leftDigitTemp, leftDigitTempDeg);
        };
        if(currentDigitTemp) {
            convertTemperature(currentDigitTemp,currentDigitTempDeg);
        };
        days.forEach((day,i) => {
            originalTemps[i] = parseInt(day.textContent);
        });
        const convertedTemps = originalTemps.map((temp, i) => {
            return convertTemperature(i)
        }); 
        convertedTemps.forEach((temp, i) => {
            days[i].textContent = temp; 
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

    function popup(trigger, closeEl) {
        trigger.classList.add('fadeDown');
        trigger.classList.add('popup-active');
        closeEl.addEventListener('click', (e) => {
            const target = e.target;
            if(target) {
                trigger.classList.remove('fadeDown');
                trigger.classList.remove('popup-active');
            }
        })
        setTimeout(() => {
            trigger.classList.remove('fadeDown');
            trigger.classList.remove('popup-active');
        }, 60000)
    }

    
    function more() {
        const popupContent = document.querySelector('.popup-alert-hide')
        popupContent.classList.remove('hide');
        if(!popupContent.classList.contains('hide')) {
            btnMore.classList.add('hidden');
        } else {
            btnMore.classList.remove('hidden');
        }
    }
    btnMore.addEventListener('click', more)

    toggleTemperature();
    handleScreenChange(mediaQuery);
    currentLocationBtn.addEventListener('click', currentLocation);
    mediaQuery.addEventListener("change", handleScreenChange);
    themeBtn.addEventListener("click", switchTheme);
    btns.forEach((btn) => btn.addEventListener("click", toggleBtnClass));
    

    

    input.addEventListener('input', () => {
        const loading = document.querySelector('.loading')
        const error = document.querySelector('.error');
        if(searchTimeout) {
            clearInterval(searchTimeout);
        }
        
        if(!input.value) {
            searchList.classList.remove('active');
            inputContainer.classList.remove('input_container-active');
            searchList.innerHTML = '';
            loading.classList.remove('searching');
            error.innerHTML = '';
        } else {
            loading.classList.add('searching');
            error.innerHTML = `
            <div class="error-content d-flex">
                <span></span>
                <p>Нет совпадений</p>
            </div>
            `;
            inputContainer.classList.add('input_container-active');
        }

        if(input.value) {
            searchTimeout = setTimeout(() => {
                fetchData(url.geo(input.value), function(locations) {
                    loading.classList.remove('searching');
                    searchList.classList.add('active');
                    searchList.innerHTML = `
                        <ul class="view-list dropdown dark-list" data-search-list></ul>
                    `;
                    const items = [];
                    for (const {name, local_names, lat, lon, country, state} of locations) {
                        const hasLocalNames = local_names && typeof local_names === 'object' &&
                        local_names.hasOwnProperty('ru');
                        let ruName;
                        if(hasLocalNames) {
                            ruName = local_names.ru;
                        } else {
                            ruName = name;
                        }
                        const searchItem = document.createElement('li');
                        searchItem.classList.add('view-item');

                        searchItem.innerHTML = `
                            <div class="justify-between">
                                <div>
                                    <p class="view-item-title">${ruName}</p>
                                    <p class="view-item-subtitle">${state || ''}</p>
                                </div>
                                <p class="view-item-country">${country}</p>
                            </div>
                            <a href="#/weather?lat=${lat}&lon=${lon}" aria-label='${name} weather' data-search-toggler></a>
                        `;
                        searchList.querySelector('[data-search-list]').appendChild(searchItem);
                        items.push(searchItem.querySelector('[data-search-toggler]'));
                        if(searchItem) {
                            inputContainer.classList.add('input_container-active');
                                error.innerHTML = ''
                        } 
                        searchItem.addEventListener('click', (e) => {
                            const link = e.currentTarget.querySelector('[data-search-toggler]')
                                if(link) {
                                    link.click();
                                    input.value = '';
                                    inputContainer.classList.remove('input_container-active');
                                    error.innerHTML = '';
                                    searchList.classList.remove('active');
                                }
                        })
                    }
                })
            }, searchTimeoutDuration)
        }
    })
});