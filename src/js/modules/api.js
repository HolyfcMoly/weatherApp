import { openWeatherKey } from "./keys";

export async function fetchData(url) {
    const fullUrl = `${url}&appid=${openWeatherKey}`;
    const response = await fetch(fullUrl);
    return response.json();
}