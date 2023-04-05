import "./style.scss";

const form = document.querySelector<HTMLFormElement>("form")!;
const searchBar = document.querySelector<HTMLInputElement>("input#location")!;
let query = "auto:ip";

form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    query = searchBar.value;

    displayData();
});

async function getData(query: String) {
    try {
        const data = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${
                import.meta.env.VITE_WEATHER_API_KEY
            }&q=${query}`
        )
            .then((response) => response.json())
            .then((response) => {
                if ("error" in response) {
                    throw new Error(response.error.message);
                }
                return response;
            });

        const {
            current: {
                feelslike_c,
                feelslike_f,
                gust_kph,
                gust_mph,
                humidity,
                condition: { text, icon },
            },
            location: { name },
        } = data;

        return {
            location: name,
            temperature: { c: feelslike_c, f: feelslike_f },
            condition: { name: text, icon },
            humidity,
            wind: { kph: gust_kph, mph: gust_mph },
        };
    } catch (error) {
        alert(`Couldn't connect to API due to: ${error}`);
    }
}

async function displayData() {
    console.log(await getData(query));
}

displayData();
