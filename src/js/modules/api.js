import { openWeatherKey } from "./keys.js";
// асинхронная функция принимающая параметр url
export async function fetchData(url) {
    const fullUrl = `${url}&appid=${openWeatherKey}`;
    const response = await fetch(fullUrl);
    return response.json();
}