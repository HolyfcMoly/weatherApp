export const url = {
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
    * @param {string} query поиск, например 'London', 'New York'
    */
    geo(query) {
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&lang=ru`
    },
}