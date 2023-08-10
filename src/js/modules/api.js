    const apiKey = 'd37689ff161e969e2d476005a81a5492';

    export async function fetchData(url) {
        const fullUrl = `${url}&appid=${apiKey}`;
        const response = await fetch(fullUrl);
        return response.json();
    }