# WeatherApp

Веб приложение "Погода", с использованием API 'openweathermap' для получения и отображения данных о погоде. Приложение адаптивно для мобильных устройств.

Так же используется API от Yandex - 'Геокодер'. Геокодер используется для получение и преобразование данных, а именно получает от 'openweathermap' данные координат, по этим координатам получаем: название города, страну, штат. Если же такие данные отсутсвуют то используются названия от 'openweathermap'.

## Начало работы

  1. Зарегестрируйтесь на 'openweathermap.org', 'yandex.ru'
  2. Получите ключ на 'openweathermap.org', перейдите на 'developer.tech.yandex.ru/services' и получите ключ
  3. Клонируйте репозиторий на свой компьютер.
  4. перейдите по пути src/js/modules в файл keys.js 
      ```
      export const openWeatherKey = 'CHANGE_ME';
      export const yandexKey = 'CHANGE_ME';
      ```
      Измените 'CHANGE_ME' на свои ключи.
  5. Откройте терминал, установите папку node_modules. (npm i)
  6. В терминале запустите gulp командой 'gulp'

## Demo
[Demo](https://holyweatherapp.netlify.app/)

### Общий вид, измение единиц измерения, изменение темы.

![common-view](https://github.com/HolyfcMoly/weatherApp/assets/108127983/75231016-2ba4-40d3-8820-602c1f387c93)

### Выбор локации, текущая локация.

![location](https://github.com/HolyfcMoly/weatherApp/assets/108127983/c50a7e23-254b-4515-ad41-50b849282964)

## Технологии

- HTML
- CSS
- JavaScript

## Author

HolyfcMoly

https://github.com/HolyfcMoly

## License

 [MIT](https://opensource.org/license/mit/)
