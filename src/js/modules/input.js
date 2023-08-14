import { url } from "./urls.js";
import { fetchData } from "./api.js";
import { getCityName } from "./geo.js";
export default class Input {
    constructor(input, inputContainer, searchList) {
        /**
        * @param {string} input - селектор для поля input
        * @param {string} inputContainer - селектор input контейнера
        * @param {string} searchList - селектор для списка результатов
        */
        this.input = document.querySelector(input);
        this.inputContainer = document.querySelector(inputContainer);
        this.searchList = document.querySelector(searchList);
        this.error = document.querySelector(".error");
        this.searchTimeout = null;
        this.searchTimeoutDuration = 500;
    }
    // функция сброса
    clearInput() {
        this.input.value = "";
        this.searchList.innerHTML = "";
        this.inputContainer.classList.remove("input_container-active");
        this.error.innerHTML = "";
        this.searchList.classList.remove("active");
    }
    // функция инициализирует поле ввода и функцию поиска
    init() {
        window.addEventListener("click", (e) => {
            const parent = this.input.parentNode;
            if (e.target === parent || e.target === this.input) {
                if (this.input.value) {
                    this.inputContainer.classList.add("input_container-active");
                }
                this.searchList.classList.add("active");
                this.error.style.display = "flex";
            } else {
                this.inputContainer.classList.remove("input_container-active");
                this.searchList.classList.remove("active");
                this.error.style.display = "none";
            }
        });

        this.input.addEventListener("input", () => {
            const loading = document.querySelector(".loading");
            if (this.searchTimeout) {
                clearInterval(this.searchTimeout);
            }

            if (!this.input.value) {
                this.searchList.classList.remove("active");
                this.inputContainer.classList.remove("input_container-active");
                this.searchList.innerHTML = "";
                loading.classList.remove("searching");
                this.error.innerHTML = "";
            } else {
                loading.classList.add("searching");
                this.error.innerHTML = `
                <div class="error-content dark-list d-flex">
                    <span></span>
                    <p>Нет совпадений</p>
                </div>
                `;
                this.inputContainer.classList.add("input_container-active");
            }

            if (this.input.value) {
                this.searchTimeout = setTimeout(async () => {
                    try {
                        const locations = await fetchData( url.geo(this.input.value));
                        this.searchList.classList.add("active");
                        this.searchList.innerHTML = `
                        <ul class="view-list dropdown dark-list" data-search-list></ul>
                        `;
                        const items = [];
                        console.log(locations)
                        for (const location of locations) {
                            const {
                                name,
                                local_names,
                                lat,
                                lon,
                                country,
                                state,
                            } = location;
                            const cityName = await getCityName(lat, lon);

                            items.push({
                                cityName,
                                name,
                                country,
                                local_names,
                                lat,
                                lon,
                                state,
                            });
                        }
                        if (!items.length) {
                            throw new Error();
                        }
                        for (const item of items) {
                            const hasLocalNames =
                                item.local_names &&
                                typeof item.local_names === "object" &&
                                item.local_names.hasOwnProperty("ru");
                            let ruName;
                            if (hasLocalNames) {
                                ruName = item.local_names.ru;
                            } else {
                                ruName = item.name;
                            }
                            const searchItem = document.createElement("li");
                            searchItem.classList.add("view-item");
                            items.push({ location });
                            searchItem.innerHTML = `
                                <div class="justify-between">
                                    <div>
                                        <p class="view-item-title">${
                                            item.cityName === true
                                                ? ruName
                                                : item.cityName.cityName
                                        }</p>
                                        <p class="view-item-state">${
                                            item.cityName === true
                                                ? ''
                                                : item.cityName.stateName || ''
                                        }</p>
                                        <p class="view-item-subtitle">${
                                            item.cityName === true
                                            ? item.state || ''
                                            : item.cityName.countryName || ''
                                        }</p>
                                    </div>
                                    <p class="view-item-country">${item.country}</p>
                                </div>
                                <a href="#/weather?lat=${item.lat}&lon=${item.lon}" 
                                aria-label='${item.name} weather' data-search-toggler></a>
                            `;
                            this.searchList
                                .querySelector("[data-search-list]")
                                .appendChild(searchItem);
                            loading.classList.remove("searching");

                            if (searchItem) {
                                this.inputContainer.classList.add("input_container-active");
                                this.error.innerHTML = "";
                            }
                            searchItem.addEventListener("click", (e) => {
                                const link = e.currentTarget.querySelector("[data-search-toggler]");
                                if (link) {
                                    link.click();
                                    this.clearInput();
                                }
                            });
                        }
                    } catch (error) {
                        loading.classList.remove("searching");
                    }
                }, this.searchTimeoutDuration);
            }
        });
    }
}