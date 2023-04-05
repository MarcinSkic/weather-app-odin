import "./style.scss";

const form = document.querySelector<HTMLFormElement>("form")!;
const searchBar = document.querySelector<HTMLInputElement>("input#location")!;

form.addEventListener("submit", (event: Event) => {
    getData(searchBar.value);
    event.preventDefault();
});

async function getData(query: String) {
    const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${
            import.meta.env.VITE_WEATHER_API_KEY
        }&q=${query}`
    );
    const data = await response.json();
    console.log(data);
}

getData("auto:ip");
