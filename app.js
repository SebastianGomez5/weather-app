console.log("API_KEY:", API_KEY);

const cityInput = document.getElementById("cityInput");
const countryInput = document.getElementById("countryInput");
const checkWeatherBtn = document.getElementById("checkWeatherBtn");
const weatherDisplay = document.getElementById("weatherDisplay");

/**
 * Construye la URL de consulta
 */
function buildUrl(city, country) {
  const query = country ? `${city},${country.toUpperCase()}` : city;
  return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=es`;
}

/**
 * Devuelve la URL del ícono oficial de OpenWeatherMap
 */
function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * para cambiar el tema dinámicamente según día/noche
 */
function setTheme(iconCode) {
  if (iconCode.includes("d")) {
    document.body.classList.add("day-theme");
    document.body.classList.remove("night-theme");
  } else {
    document.body.classList.add("night-theme");
    document.body.classList.remove("day-theme");
  }
}

/**
 * Renderiza la información del clima en el DOM
 */
function displayWeather(data) {
  const { main, weather, name, sys } = data;
  const iconCode = weather[0].icon;
  const iconUrl = getWeatherIconUrl(weather[0].icon);

  setTheme(iconCode);

  weatherDisplay.innerHTML = `
    <h2>
      <img src="${iconUrl}" alt="${weather[0].description}" />
      Clima en ${name}, ${sys.country}
    </h2>
    <p>${weather[0].description}</p>
    <p> <strong>Temperatura:</strong> ${main.temp} °C</p>
    <p> <strong>Sensación térmica:</strong> ${main.feels_like} °C</p>
    <p> <strong>Humedad:</strong> ${main.humidity}%</p>
  `;
}

/**
 * Manejo de errores
 */
function displayError(message) {
  weatherDisplay.innerHTML = `<p style="color: red;"> ${message}</p>`;
}

/**
 * Consulta el clima usando async/await
 */
async function getWeather() {
  const city = cityInput.value.trim();
  const country = countryInput.value.trim();

  if (!city) {
    displayError("Por favor ingresa una ciudad.");
    return;
  }

  weatherDisplay.innerHTML = "<p> Cargando...</p>";

  try {
    const response = await fetch(buildUrl(city, country));
    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    displayWeather(data);
  } catch (error) {
    displayError(error.message);
  }
}

checkWeatherBtn.addEventListener("click", getWeather);

