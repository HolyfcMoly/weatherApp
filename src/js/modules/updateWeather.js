import { getTime, getDate, weekDayNames, monthNames } from "./dateTime.js";
import { url } from "./urls.js";
import { fetchData } from "./api.js";
import { getCityName } from "./geo.js";

export default class UpdateWeather {
    constructor(
        leftInfo,
        todayWeather,
        hourlySection,
        forecastSection,
        errorContent,
        currentLocationBtn,
        btns
    ) {
        this.days = [];
        this.daysDeg = [];
        this.originalTemps = [];

        this.icons = [];
        this.hourlyIcons = [];

        this.currentWeatherDiv = null;
        this.leftDigitTemp = null;
        this.leftDigitTempDeg = null;

        this.currentWeatherUlGrid = null;
        this.currentDigitTemp = null;
        this.currentDigitTempDeg = null;

        this.isConverted = false;
        this.isCelsius = false;
        this.requestInProgress = false;

        this.btns = document.querySelectorAll(btns);
        this.leftInfo = document.querySelector(leftInfo);
        this.todayWeather = document.querySelector(todayWeather);
        this.hourlySection = document.querySelector(hourlySection);
        this.forecastSection = document.querySelector(forecastSection);
        this.errorContent = document.querySelector(errorContent);
        this.currentLocationBtn = document.querySelector(currentLocationBtn);
    }

    convertTemperature(temp) {
        if (!temp) return;
        this.leftDigitTempDeg.innerHTML = "°C";
        this.currentDigitTempDeg.innerHTML = "°C";
        this.daysDeg.forEach((deg) => (deg.textContent = "°C"));
        this.isConverted = true;

        let temperature;
        if (typeof temp === "number") {
            temperature = this.originalTemps[temp];
        } else {
            temperature = parseInt(temp.textContent);
        }

        let converted;
        if (this.isCelsius) {
            converted = Math.round((temperature * 9) / 5 + 32);
            this.leftDigitTempDeg.innerHTML = "°F";
            this.currentDigitTempDeg.innerHTML = "°F";
            this.daysDeg.forEach((deg) => (deg.textContent = "°F"));
            if (typeof temp === "number") {
                this.originalTemps[temp] = converted;
            } else {
                temp.innerHTML = converted;
            }
        } else {
            converted = Math.round(((temperature - 32) * 5) / 9);
            this.leftDigitTempDeg.innerHTML = "°C";
            this.currentDigitTempDeg.innerHTML = "°C";
            this.daysDeg.forEach((deg) => (deg.textContent = "°C"));
            if (typeof temp === "number") {
                this.originalTemps[temp] = converted;
            } else {
                temp.innerHTML = converted;
            }
        }
        return converted;
    }

    toggleTemperature() {
        this.isCelsius = !this.isCelsius;

        if (this.leftDigitTemp) {
            this.convertTemperature(this.leftDigitTemp);
        }
        if (this.currentDigitTemp) {
            this.convertTemperature(this.currentDigitTemp);
        }
        this.days.forEach((day, i) => {
            this.originalTemps[i] = parseInt(day.textContent);
        });
        const convertedTemps = this.originalTemps.map((temp, i) => {
            return this.convertTemperature(i);
        });
        convertedTemps.forEach((temp, i) => {
            this.days[i].textContent = temp;
        });
    }

    toggleBtnClass(btn) {
        if (!btn.classList.contains("active-btn")) {
            this.btns.forEach((btn) => btn.classList.remove("active-btn"));
            btn.classList.add("active-btn");
            this.toggleTemperature();
        }
    }

    resetConversion() {
        if (this.isConverted) {
            this.isCelsius = false;
            this.currentDigitTempDeg.textContent = "°C";
            this.leftDigitTempDeg.textContent = "°C";
            this.daysDeg.forEach((deg) => (deg.textContent = "°C"));
            this.btns.forEach((btn) => {
                btn.textContent === "°F"
                    ? btn.classList.remove("active-btn")
                    : btn.classList.add("active-btn");
            });
            this.isConverted = false;
        }
    }

    getWeatherIcons() {
        const weatherIcons = {
            "200_family": `
                <use xlink:href="#rainDrizzle" x="25" y="65"></use>
                <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                <use xlink:href="#grayCloud" fill="url(#gradGray)" x="-7" y="20"></use>
                <use xlink:href="#whiteCloud" x="11"></use>
                <use xlink:href="#thunderBolt" fill="url(#gradYellow)" x="25" y="55"></use>
                <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8"></use>
            `,
            "300_family": `
                <use xlink:href="#rainDrizzle" x="25" y="65"></use>
                <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                <use xlink:href="#whiteCloud" x="11"></use>
                <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8"></use>
            `,
            "500_family_1": `
                <use xlink:href="#rainDrizzle" x="20" y="65"></use>
                <use xlink:href="#rainDrizzle" x="30" y="65""></use>
                <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                <use xlink:href=" #sun" x="-8" y="-15"></use>
                <use xlink:href="#whiteCloud" x="11"></use>
            `,
            "500_family_2": `
                <use xlink:href="#rainDrizzle" x="20" y="65"></use>
                <use xlink:href="#rainDrizzle" x="30" y="65"></use>
                <use xlink:href="#rainDrizzle" x="40" y="65""></use>
                <use xlink:href="#grayCloud" fill="url(#gradGray)" x="-5" y="20"></use>
                <use xlink:href="#whiteCloud" x="11"></use>
                <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8"></use>
            `,
            "600_family": `
                <use xlink:href="#snowFlake" id="snow-b" class="snow" x="25"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="25" y="150"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="85" y="190"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="139" y="150"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="238" y="150"></use>
                <use xlink:href="#snowFlake" id="snow-s" class="snow-s" x="190" y="190"></use>
            `,
            "700_family": `
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
            "803_family": `
                <use xlink:href="#whiteCloud" x="11"></use>
                <use xlink:href="#grayCloud" class="gray-cloud" fill="url(#gradGray)" x="27" y="8"></use>
            `,
        };
        return weatherIcons;
    }

    getWeatherIconId(weatherId) {
        const icons = this.getWeatherIcons();

        function iconId(weatherId) {
            if (/^300/.test(weatherId)) {
                return icons["300_family"];
            }
            if (/^50[0-4]/.test(weatherId)) {
                return icons["500_family_1"];
            }
            if (/^[520-531]/.test(weatherId)) {
                return icons["500_family_2"];
            }
            if (/^600/.test(weatherId)) {
                return icons["600_family"];
            }
            if (/^700/.test(weatherId)) {
                return icons["700_family"];
            }
            if (/^800/.test(weatherId)) {
                return icons[800];
            }
            if (/^801/.test(weatherId)) {
                return icons[801];
            }
            if (/^802/.test(weatherId)) {
                return icons[802];
            }
            if (/^80[3-4]/.test(weatherId)) {
                return icons["803_family"];
            }
        }
        return iconId(weatherId);
    }

    windDirection(trigger, deg) {
        const directions = {
            "0-15": "С",
            "15-75": "С-В",
            "75-105": "В",
            "105-165": "Ю-В",
            "165-195": "Ю",
            "195-255": "Ю-З",
            "255-285": "З",
            "285-345": "С-З",
            "345-360": "C",
        };

        let number = deg;
        Object.entries(directions).forEach(([range, dir]) => {
            const [start, end] = range.split("-");
            if (number >= start && number <= end) {
                trigger.innerHTML = dir;
            }
        });
    }

    error404 = () => {
        const errorContent = document.querySelector("[data-error]");
        const forecastSection = document.querySelector(".right_info_list");
        errorContent.innerHTML = `
            <p>Ooops, 404</p>
            <h1>Страница не найдена</h1>
            <a href="#/weather?lat=55.7522&lon=37.6156" class="error-btn active-btn">
            <span>Назад</span>
            </a>
        `;
        errorContent.style.display = "flex";
        forecastSection.innerHTML = "";
        this.hourlySection.innerHTML = "";
        try {
            this.currentWeatherDiv.style.display = "none";
        } catch (error) {}
    };

    capitalize(str) {
        if (typeof str !== "string") {
            return str;
        }
        str = str.replace(/^./, (c) => c.toUpperCase());
        return str;
    }

    grabbingScroll(list) {
        let done = false;
        let startX;
        let scrollLeft;

        list.addEventListener("mousedown", (e) => {
            done = true;
            list.classList.add("active-item");
            startX = e.pageX - list.offsetLeft;
            scrollLeft = list.scrollLeft;
        });
        list.addEventListener("mouseleave", () => {
            done = false;
            list.classList.remove("active-item");
        });
        list.addEventListener("mouseup", () => {
            done = false;
            list.classList.remove("active-item");
        });
        list.addEventListener("mousemove", (e) => {
            if (!done) return;
            const x = e.pageX - list.offsetLeft;
            const walk = (x - startX) * 2;
            list.scrollLeft = scrollLeft - walk;
        });
    }

    async checkWeather(lat, lon) {
        if (this.requestInProgress) return;
        this.requestInProgress = true;
        this.days = [];
        this.daysDeg = [];
        this.icons = [];
        this.hourlyIcons = [];
        this.originalTemps = [];
        this.leftDigitTemp = null;
        this.currentDigitTemp = null;
        this.forecastSection.innerHTML = "";
        this.hourlySection.innerHTML = "";
        this.errorContent.style.display = "none";

        const loading = document.querySelector("[data-loading]");
        loading.style.display = "grid";

        if (this.currentWeatherDiv &&
            this.leftInfo.contains(this.currentWeatherDiv)
        ) {
            this.leftInfo.removeChild(this.currentWeatherDiv);
        }

        if (this.currentWeatherUlGrid &&
            this.todayWeather.contains(this.currentWeatherUlGrid)
        ) {
            this.todayWeather.removeChild(this.currentWeatherUlGrid);
        }

        if (window.location.hash === "#/current-location") {
            this.currentLocationBtn.setAttribute("disabled", "");
        } else {
            this.currentLocationBtn.removeAttribute("disabled");
        }

        const currentWeather = await fetchData(url.currentWeather(lat, lon));
        const {
            weather: [current],
            dt: dateUnix,
            name,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC, country },
            main: { temp, humidity, pressure, feels_like },
            wind: { speed, deg },
            visibility,
            timezone,
        } = currentWeather;

        const description = current.description;
        const weatherId = current.id;
        const icon = this.getWeatherIconId([weatherId]);

        const div = document.createElement("div");
        div.classList.add("left-info-content", "px-5", "py-5");
        div.innerHTML = `
            <div class="left_info_weather">
                <figure>
                    <svg class="left_info_weather-icon" viewBox="0 0 100 100"></svg>
                </figure>
                <div class="left_info_weather--text d-flex ff-rob-thin">
                    <h2>${parseInt(temp)}</h2>
                    <p class="left_info_weather--degrees">°C</p>
                </div>
            </div>
            <div class="left_info_place d-flex-column justify-between">
                <h1 class="left_info_place--text">${name}</h1>
                <p class="left_info_place--subtext">${country}</p>
                <div class="left_info_place-date d-flex ff-rob-thin">
                    <h1 class="left_info_place-date--day">${getDate(
                        dateUnix,
                        timezone
                    )}</h1>
                </div>
            </div>
            <div class="left_info_weather-now d-flex align-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                </svg>
                <p class="left_info_weather-now-text">${this.capitalize(
                    description
                )}</p>
            </div>
            <div class="left_info_time d-flex align-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="left_info_time-text ff-rob-thin">${getTime(
                    timezone
                )}</p>
            </div>
        `;
        this.currentWeatherDiv = this.leftInfo.appendChild(div);
        document.querySelector(".left_info_weather-icon").innerHTML = icon;
        this.leftDigitTemp = document.querySelector(".left_info_weather--text h2");
        this.leftDigitTempDeg = document.querySelector(".left_info_weather--degrees");

        let sunrise = new Date(sunriseUnixUTC * 1000);
        const localSunrise = new Date(sunrise.getTime() + timezone * 1000);
        const sunriseHour = localSunrise.getUTCHours();
        const sunriseMinutes = localSunrise.getUTCMinutes();

        let sunset = new Date(sunsetUnixUTC * 1000);
        const localSunset = new Date(sunset.getTime() + timezone * 1000);
        const sunsetHour = localSunset.getUTCHours();
        const sunsetMinutes = localSunset.getUTCMinutes();

        const ul = document.createElement("ul");
        ul.classList.add("weather-info");
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
                <div class="weather-info__pressure d-flex ff-rob-thin">
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
                <div class="weather-info__deg d-flex ">
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
                    <p>${sunriseHour < 10 ? "0" : ""}${sunriseHour}
                        :${sunriseMinutes < 10 ? "0" : ""}${sunriseMinutes}</p>
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
                    <p>${sunsetHour < 10 ? "0" : ""}${sunsetHour}
                        :${sunsetMinutes < 10 ? "0" : ""}${sunsetMinutes}</p>
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
        this.currentWeatherUlGrid = this.todayWeather.appendChild(ul);
        this.currentDigitTemp = document.querySelector(".weather-info__feelLike p");
        this.currentDigitTempDeg = document.querySelector(".weather-info__feelLike p").nextElementSibling;

        document.querySelector(".weather-info__deg svg").style.transform = `rotate(${deg}deg)`;
        const direction = document.querySelector(".weather-info__deg p");
        this.windDirection(direction, deg);

        async function reverseGeo() {
            const reverseGeo = await fetchData(url.reverseGeo(lat, lon));
            const [reverse] = reverseGeo;
            const cityName = await getCityName(reverse.lat, reverse.lon);
            const hasLocalNames =
                reverse.local_names &&
                typeof reverse.local_names === "object" &&
                reverse.local_names.hasOwnProperty("ru");

            let ruName;
            if (hasLocalNames) {
                ruName = reverse.local_names.ru;
            } else {
                ruName = reverse.name;
            }
            document.querySelector(".left_info_place--text").innerHTML = `${
                cityName === true ? ruName : cityName.cityName
            }`;
            document.querySelector(".left_info_place--subtext").innerHTML = `${
                cityName === true ? country : cityName.countryName
            }`;
        }
        reverseGeo();

        const forecast = await fetchData(url.forecast(lat, lon));
        const {
            list: forecastList,
            city: { timezones },
        } = forecast;

        const h2 = document.createElement("h2");
        h2.classList.add("right_info_header");
        h2.textContent = `На сегодня`;

        const list = document.createElement("ul");
        list.classList.add("right_info-today-list", "d-flex");
        list.style.overflowX = "scroll";

        this.hourlySection.appendChild(h2);
        this.hourlySection.appendChild(list);
        // 24h forecast
        for (const [index, data] of forecastList.entries()) {
            if (index > 7) break;

            const {
                dt_txt,
                main: { temp },
                wind: { deg: windDir, speed },
                weather: [forecast],
            } = data;
            const newDate = new Date(dt_txt);
            const weatherId = forecast.id;
            const icon = this.getWeatherIconId([weatherId]);
            this.hourlyIcons.push(icon);

            const hours = newDate.getHours();
            const minutes = newDate.getMinutes();

            const item = document.createElement("li");
            item.classList.add("right_info-today-list--item", "px-5", "py-5");
            item.innerHTML = `
                        <div class="card-today">
                            <p class="today-date ff-rob-thin">
                            ${weekDayNames[newDate.getUTCDay()]},
                            ${newDate.getDate()}
                            </p>
                            <p class="today-time ff-rob-thin">
                            ${hours < 10 ? "0" : ""}${hours}:
                            ${minutes < 10 ? "0" : ""}${minutes}
                            </p>
                            <svg class="today_weather-icon" viewBox="0 0 100 100">
                                <use xlink:href="#sun"></use>
                            </svg>
                            <div class="today-temp_content d-flex justify-center ff-rob-thin">
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
            this.grabbingScroll(list);
            const todayIcons = document.querySelectorAll(".today_weather-icon");
            todayIcons.forEach((svg, i) => {
                svg.innerHTML = this.hourlyIcons[i];
            });
            const directions = document.querySelectorAll(".today_weather__wind-deg p");
            const svgs = document.querySelectorAll(".today_weather__wind-deg svg");
            svgs.forEach((svg, i) => {
                const transform = svg.getAttribute("transform");
                const degrees = +transform.match(/\d+/)[0];
                this.windDirection(directions[i], degrees);
            });
            const daysTemp = document.querySelectorAll(".today-temp");
            const daysDegrees = document.querySelectorAll(".today-degrees");
            daysTemp.forEach((day) => this.days.push(day));
            daysDegrees.forEach((deg) => this.daysDeg.push(deg));
        }
        // 5 days forecast
        for (let i = 7, len = forecastList.length; i < len; i += 8) {
            const {
                main: { temp_max, humidity, pressure },
                wind: { deg: windDir, speed },
                weather: [forecast],
                dt_txt,
            } = forecastList[i];
            const date = new Date(dt_txt);
            const description = forecast.description;
            const weatherId = forecast.id;
            const icon = this.getWeatherIconId([weatherId]);
            this.icons.push(icon);
            const li = document.createElement("li");
            li.classList.add(
                "right_info_list_item",
                "dark-cards",
                "px-5",
                "py-5",
                "d-flex-column",
                "justify-between"
            );
            li.innerHTML = `
                        <div>
                        <h2 class="right_info_list_item-day ff-rob-thin">
                        ${weekDayNames[date.getUTCDay()]}, 
                        ${monthNames[date.getUTCMonth()]} ${date.getDate()}
                        </h2>
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
                        <p class="right_info_list_item-description d-flex justify-center">${this.capitalize(
                            description
                        )}</p>
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
            const rightInfoList = document.querySelector(".right_info_list");
            rightInfoList.appendChild(li);
            this.grabbingScroll(rightInfoList);

            const iconsEl = document.querySelectorAll(".weather_anim-icon");
            iconsEl.forEach((svg, i) => {
                svg.innerHTML = this.icons[i];
            });
            const directions = document.querySelectorAll(".weather-wind__deg p");
            const svgs = document.querySelectorAll(".weather-wind__deg svg");
            svgs.forEach((svg, i) => {
                const transform = svg.getAttribute("transform");
                const degrees = +transform.match(/\d+/)[0];
                this.windDirection(directions[i], degrees);
            });
            const daysTemp = document.querySelectorAll(".day-temp");
            const daysDegrees = document.querySelectorAll(".day-degrees");
            daysTemp.forEach((day) => this.days.push(day));
            daysDegrees.forEach((deg) => this.daysDeg.push(deg));
        }
        loading.style.display = "none";
        this.resetConversion();
        this.requestInProgress = false;
        this.btns.forEach((btn) =>
            btn.addEventListener("click", () => {
                this.toggleBtnClass(btn);
            })
        );
    }
}