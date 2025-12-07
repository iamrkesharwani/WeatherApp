// Selectors: Controls & Inputs
const tempToggleBtn = document.getElementById('tempToggleBtn');
const locationBtn = document.getElementById('locationBtn');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const addFavBtn = document.getElementById('addFavBtn');
const favorites = document.getElementById('favorites');

// Selectors: Layout Containers
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const currentWeather = document.getElementById('currentWeather');
const autoRefreshSection = document.getElementById('autoRefreshSection');
const favoritesError = document.getElementById('favoritesError');

// Selectors: Weather Data Display
const cityName = document.getElementById('cityName');
const countryName = document.getElementById('countryName');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weatherCondition');
const humidityValue = document.getElementById('humidityValue');
const windValue = document.getElementById('windValue');
const visibilityValue = document.getElementById('visibilityValue');
const pressureValue = document.getElementById('pressureValue');
const feelsLike = document.getElementById('feelsLike');
const minTemp = document.getElementById('minTemp');
const maxTemp = document.getElementById('maxTemp');
const autoRefreshToggle = document.getElementById('autoRefreshToggle');
const refreshCountdown = document.getElementById('refreshCountdown');

// State: App Variables
let favoriteCities = getFavs();
let currentUnit = 'C';
let lastWeatherData = null;
let refreshTimer = null;
let countdownTimer = null;
let secondsLeft = 60;
const DEFAULT_INTERVAL = secondsLeft;
const REFRESH_INTERVAL = 60 * 1000;
const MAX_FAVORITES = 5;

// Initialization: Render Favorites & Load Default City
renderFavorites();

window.addEventListener('DOMContentLoaded', () => {
  cityInput.value = 'Kolkata';
  fetchSearch('Kolkata');

  if (autoRefreshToggle.checked) {
    startAutoRefresh();
  }
});

// Events: Search & Location
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  fetchSearch(city);
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    fetchSearch(city);
  }
});

locationBtn.addEventListener('click', fetchCurrentLocation);

// Events: Settings & Favorites
tempToggleBtn.addEventListener('click', () => {
  if (!lastWeatherData) return;
  currentUnit = currentUnit === 'C' ? 'F' : 'C';
  updateUI(lastWeatherData);
});

autoRefreshToggle.addEventListener('change', () => {
  if (autoRefreshToggle.checked) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
});

addFavBtn.addEventListener('click', () => {
  if (!lastWeatherData) return;

  const city = lastWeatherData.city?.name;
  const alreadyExists = favoriteCities.includes(city);
  if (alreadyExists) return;

  if (favoriteCities.length >= MAX_FAVORITES) {
    favoritesError.classList.remove('hidden');
    setTimeout(() => favoritesError.classList.add('hidden'), 4000);
    return;
  }

  favoriteCities.push(city);
  setFavs(favoriteCities);
  renderFavorites();
});

// Logic: API Calls
async function fetchSearch(city) {
  if (!city) {
    return;
  }

  const LINK = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=ca99bdd3e4e03c83dd039eb7cecbb03a`;

  try {
    loading.classList.remove('hidden');
    currentWeather.classList.add('hidden');
    autoRefreshSection.classList.add('hidden');
    error.classList.add('hidden');

    const res = await fetch(LINK);
    if (!res.ok) throw new Error('City not found!');
    const data = await res.json();

    lastWeatherData = data;
    updateUI(data);
  } catch (err) {
    console.error(err);
    error.classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
    currentWeather.classList.remove('hidden');
    autoRefreshSection.classList.remove('hidden');
  }
}

function fetchCurrentLocation() {
  if (!navigator.geolocation) {
    alert('No location available');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const LINK = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=ca99bdd3e4e03c83dd039eb7cecbb03a`;

      try {
        loading.classList.remove('hidden');
        error.classList.add('hidden');
        currentWeather.classList.add('hidden');
        autoRefreshSection.classList.add('hidden');

        const res = await fetch(LINK);
        if (!res.ok) throw new Error('Location not found!');

        const data = await res.json();
        lastWeatherData = data;
        updateUI(data);
      } catch (err) {
        console.error(err);
        error.classList.remove('hidden');
      } finally {
        loading.classList.add('hidden');
        currentWeather.classList.remove('hidden');
        autoRefreshSection.classList.remove('hidden');
      }
    },
    () => {
      alert('Location permission denied!');
    }
  );
}

// Logic: UI Update
function updateUI(data) {
  const current = data.list[0];
  const countryCode = data.city.country;
  const fullCountryName = getFullCountryName(countryCode);
  const windKmh = (current.wind.speed * 3.6).toFixed(1);

  const temp = changeTemp(current.main.temp);
  const feels = changeTemp(current.main.feels_like);
  const min = changeTemp(current.main.temp_min);
  const max = changeTemp(current.main.temp_max);

  const unitSymbol = currentUnit === 'C' ? '°C' : '°F';

  cityName.textContent = data.city.name;
  countryName.textContent = fullCountryName;
  temperature.textContent = Math.round(temp) + unitSymbol;

  weatherCondition.textContent = current.weather[0].description
    ? current.weather[0].description
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ')
    : 'N/A';

  humidityValue.textContent = current.main.humidity
    ? current.main.humidity + '%'
    : 'N/A';

  windValue.textContent = windKmh + ' km/h';

  visibilityValue.textContent = current.visibility
    ? (current.visibility / 1000).toFixed(1) + ' km'
    : 'N/A';

  pressureValue.textContent = current.main.pressure
    ? current.main.pressure + ' hPa'
    : 'N/A';

  feelsLike.textContent = feels ? Math.round(feels) + unitSymbol : 'N/A';
  minTemp.textContent = Math.round(min) + unitSymbol;
  maxTemp.textContent = Math.round(max) + unitSymbol;
}

// Logic: Auto Refresh Timer
function autoRefresh() {
  if (!lastWeatherData) return;
  const city = lastWeatherData.city?.name;

  if (city) {
    fetchSearch(city);
  } else {
    fetchCurrentLocation();
  }
}

function startAutoRefresh() {
  stopAutoRefresh();
  secondsLeft = DEFAULT_INTERVAL;
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}

function stopAutoRefresh() {
  clearInterval(refreshTimer);
  clearInterval(countdownTimer);
  countdownTimer = null;
  refreshTimer = null;
  refreshCountdown.textContent = 'Auto-refresh paused';
}

function updateCountdown() {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  refreshCountdown.textContent =
    'Next update in: ' +
    String(mins).padStart(2, '0') +
    ':' +
    String(secs).padStart(2, '0');

  if (secondsLeft === 0) {
    autoRefresh();
    secondsLeft = DEFAULT_INTERVAL;
    return;
  }

  secondsLeft--;
}

if (autoRefreshToggle.checked) {
  startAutoRefresh();
}

// Logic: Favorites Management
function getFavs() {
  return JSON.parse(localStorage.getItem('favoriteCities')) || [];
}

function setFavs(list) {
  localStorage.setItem('favoriteCities', JSON.stringify(list));
}

function renderFavorites() {
  favorites.innerHTML = '';

  favoriteCities.forEach((city, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'inline-flex items-center gap-1';

    const cityBtn = document.createElement('button');
    cityBtn.textContent = city;
    cityBtn.className =
      'bg-slate-700 bg-opacity-30 hover:bg-opacity-50 border border-cyan-500 border-opacity-20 hover:border-opacity-50 text-cyan-300 px-3 py-1 rounded-lg text-sm transition-all duration-300 flex items-center gap-2';

    cityBtn.addEventListener('click', (e) => {
      fetchSearch(city);
    });

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove';
    removeBtn.className =
      'text-cyan-300 hover:text-white bg-red-500/20 hover:bg-red-500/60 rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all duration-200';

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const confirmDelete = confirm(`Remove ${city} from favorites?`);
      if (!confirmDelete) return;

      favoriteCities.splice(index, 1);
      setFavs(favoriteCities);
      renderFavorites();
    });

    wrapper.appendChild(cityBtn);
    cityBtn.appendChild(removeBtn);
    favorites.appendChild(wrapper);
  });
}

// Helpers: Data Formatting
function getFullCountryName(code) {
  const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
  return regionName.of(code);
}

function changeTemp(temp) {
  if (currentUnit === 'C') return temp;
  return (temp * 9) / 5 + 32;
}
