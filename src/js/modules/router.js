import UpdateWeather from './updateWeather.js';
import Popup from './popup.js';
import Input from './input.js';

let weather;

function initialize() {
    if(!weather) {
        weather = new UpdateWeather(".left_info", '.right_info-grid', '.right_info-today', '.right_info_list', '[data-error]', '[data-current-location-btn]', ".header_list_item-btn");
    }
    return weather;
}

export function currentLocation() {
    const defaultLocation = '#/weather?lat=55.7522&lon=37.6156'
    new Input('[data-search-field]', '.input_container', '.left_info-search-result').clearInput()
    window.navigator.geolocation.getCurrentPosition(res => {
        const {latitude, longitude} = res.coords;
        initialize().checkWeather(`lat=${latitude}`, `lon=${longitude}`);
    }, err => {
        window.location.hash = defaultLocation;
        new Popup().init();
    })
}

export const searchedLocation = query => {
    initialize().checkWeather(...query.split('&'))
}

export const routes = new Map([
    ['/current-location', currentLocation],
    ['/weather', searchedLocation]
]);

export function checkHash() {
    const requestURL = window.location.hash.slice(1)

    const [route, query] = requestURL.includes ? requestURL.split('?') : [requestURL];

    routes.get(route) ? routes.get(route)(query) : initialize().error404();
}

export function init() {
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('load', () => {
        if(!window.location.hash) {
            window.location.hash = '#/current-location'
        } else {
            checkHash();
        }
    })
}
