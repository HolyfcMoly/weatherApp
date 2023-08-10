export async function getCityName(lat,lon) {
    const apiKey = '84fd0e86-55e2-413c-ac46-0a754af6776a';
    const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${lat},${lon}&sco=latlong&kind=locality&results=5&format=json`);
    const data = await response.json();
    const result = {};
    if(data.response.GeoObjectCollection.featureMember.length === 0) {
        return result.error = true;
    } else {
        result.cityName = await data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
        result.countryName = await data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;
    }
    
    return result;
}