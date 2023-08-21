import UpdateWeather from "./updateWeather.js";
import Popup from "./popup.js";
import Input from "./input.js";
// глобальная переменная для хранения экземпляра погоды
let weather;
// инициализирует экземпляр погоды если он еще не создан
function initialize() {
    if (!weather) {
        weather = new UpdateWeather(
            ".left_info",
            ".right_info-grid",
            ".right_info-today",
            ".right_info_list",
            "[data-error]",
            "[data-current-location-btn]",
            ".header_list_item-btn"
        );
    }
    return weather;
}
// получение текущего местоположения и передача его в экземпляр погоды
export function currentLocation() {
    const defaultLocation = "#/weather?lat=55.7522&lon=37.6156";
    new Input(
        "[data-search-field]",
        ".input_container",
        ".left_info-search-result"
    ).clearInput();
    window.navigator.geolocation.getCurrentPosition((res) => {
            const { latitude, longitude } = res.coords;
            initialize().checkWeather(`lat=${latitude}`, `lon=${longitude}`);
        },
        (err) => {
            window.location.hash = defaultLocation;
            new Popup().init();
        }
    );
}
// поисковый запрос с передачей в экземпляр погоды
export const searchedLocation = (query) => {
    initialize().checkWeather(...query.split("&"));
};
// создание карты маршрутов 
export const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation],
]);
// проверка маршрута и вызов обработчика
export function checkHash() {
    const requestURL = window.location.hash.slice(1);

    const [route, query] = requestURL.includes
        ? requestURL.split("?")
        : [requestURL];

    routes.get(route) ? routes.get(route)(query) : initialize().error404();
}
// функция инициализации обработчиков
export function init() {
    window.addEventListener("hashchange", checkHash);
    window.addEventListener("load", () => {
        if (!window.location.hash) {
            window.location.hash = "#/current-location";
        } else {
            checkHash();
        }
    });
}