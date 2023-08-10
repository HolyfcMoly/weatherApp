import ChangeTheme from "../js/modules/theme.js";
import SwitchPadding from "../js/modules/switchPadding.js";
import Input from "../js/modules/input.js";
import UpdateWeather from "../js/modules/updateWeather.js";
import * as module from '../js/modules/router.js'

window.addEventListener('DOMContentLoaded', () => {
    const weather = new UpdateWeather(".left_info", '.right_info-grid', '.right_info-today', '.right_info_list', '[data-error]', '[data-current-location-btn]', ".header_list_item-btn");
    const currentLocationBtn = document.querySelector('[data-current-location-btn]');
    
    currentLocationBtn.addEventListener('click', module.currentLocation)
    module.init();    
    
    new Input('[data-search-field]', '.input_container', '.left_info-search-result').init()
    new ChangeTheme(".header_list_item-btn--theme").changeTheme();
    new SwitchPadding().init();
})