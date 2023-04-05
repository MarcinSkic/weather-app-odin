import "./style.scss";
import usaFlag from "/simplifiedUS.svg";
import globe from "/web.svg";

enum UnitsSystem {
    Metric,
    Imperial,
}

const form = document.querySelector<HTMLFormElement>("form")!;
const searchBar = document.querySelector<HTMLInputElement>("input#location")!;
const errorDisplay = document.querySelector<HTMLDivElement>(".errors")!;
const systemBtn = document.querySelector<HTMLButtonElement>(".unitSystem")!;

const location = document.querySelector<HTMLHeadElement>("h1")!;
const temperature =
    document.querySelector<HTMLDivElement>(".stat.temperature")!;
const condition = document.querySelector<HTMLDivElement>(".stat.condition")!;
const humidity = document.querySelector<HTMLDivElement>(".stat.humidity")!;
const wind = document.querySelector<HTMLDivElement>(".stat.wind")!;

let unitSystem: UnitsSystem = UnitsSystem.Imperial;
let query = "auto:ip";
let weatherData: {
    temperature: { c: any; f: any };
    location?: any;
    condition?: { name: any; icon: any };
    humidity?: any;
    wind?: { kph: any; mph: any };
};

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
                    throw new Error(response.error.message, {
                        cause: response.error.code,
                    });
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

        weatherData = {
            location: name,
            temperature: { c: feelslike_c, f: feelslike_f },
            condition: { name: text, icon },
            humidity,
            wind: { kph: gust_kph, mph: gust_mph },
        };
    } catch (error: any) {
        errorDisplay.textContent = error.message;
    }
}

function renderData() {
    location.textContent = weatherData.location;

    if (unitSystem === UnitsSystem.Metric) {
        systemBtn.style.backgroundImage = `url(${globe})`;
    } else {
        systemBtn.style.backgroundImage = `url(${usaFlag})`;
    }

    temperature.querySelector("p")!.textContent =
        unitSystem === UnitsSystem.Metric
            ? `${weatherData.temperature.c}°C`
            : `${weatherData.temperature.f}°F`;

    condition.querySelector("img")!.src = weatherData.condition?.icon;
    condition.querySelector("p")!.textContent = weatherData.condition?.name;

    humidity.querySelector("p")!.textContent = `${weatherData.humidity}%`;

    wind.querySelector("p")!.textContent =
        unitSystem === UnitsSystem.Metric
            ? `${weatherData.wind?.kph} kph`
            : `${weatherData.wind?.mph} mph`;
}

form.addEventListener("submit", (event: Event) => {
    event.preventDefault();
    errorDisplay.textContent = "";
    query = searchBar.value;

    getData(query).then(() => {
        renderData();
    });
});

systemBtn.addEventListener("click", () => {
    unitSystem =
        unitSystem === UnitsSystem.Metric
            ? UnitsSystem.Imperial
            : UnitsSystem.Metric;

    renderData();
});

getData(query).then(() => {
    renderData();
});
