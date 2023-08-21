import { yandexKey } from "./keys.js";
// асинхронная функция для получения названия города принимающая 2 параметра (lat,lon)
export async function getCityName(lat, lon) {
    const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${yandexKey}&geocode=${lat},${lon}&sco=latlong&kind=locality&results=5&format=json`
    );
    const data = await response.json();
    // в объект result в зависимости от условий будет записаны следующие данные :
    // {error: true/false, cityName: 'London', countryName: 'England', stateName: 'Англия'}
    const result = {};
    if (data.response.GeoObjectCollection.featureMember.length === 0) {
        return (result.error = true);
    } else {
        result.cityName = await data.response.GeoObjectCollection
            .featureMember[0].GeoObject.name;
        result.countryName = await data.response.GeoObjectCollection
            .featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData
            .AddressDetails.Country.CountryName;
        result.stateName = await data.response.GeoObjectCollection
            .featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData
            .AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
    }

    return result;
}