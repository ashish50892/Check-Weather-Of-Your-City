const API_KEY = '8e088c4cea1b9e82d69a4c7fe836b0d7'; // ✅ Your real API key

const elements = {
  location: document.getElementById('location'),
  time: document.getElementById('time'),
  temp: document.getElementById('temp'),
  description: document.getElementById('description'),
  feels: document.getElementById('feels'),
  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  condText: document.getElementById('condText'),
  r1: document.getElementById('r1'),
  r2: document.getElementById('r2'),
  r3: document.getElementById('r3'),
};

function formatLocalTime(dtSeconds, tzOffsetSeconds) {
  const local = new Date((dtSeconds + tzOffsetSeconds) * 1000);
  return local.toLocaleString();
}

function applyTimeOfDayStyles(tzOffsetSeconds, dtSeconds) {
  const localHour = new Date((dtSeconds + tzOffsetSeconds) * 1000).getUTCHours();
  document.body.classList.remove('day', 'dusk', 'night');

  if (localHour >= 6 && localHour < 17) {
    document.body.classList.add('day');
  } else if (localHour >= 17 && localHour < 19) {
    document.body.classList.add('dusk');
  } else {
    document.body.classList.add('night');
  }
}

async function fetchWeather(query) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    query
  )}&appid=${API_KEY}&units=metric`;

  console.log('🔍 Fetching:', url); // For debugging

  const res = await fetch(url);
  const data = await res.json();
  console.log('🌤️ API response:', data); // Check what the API actually returns

  if (!res.ok || data.cod !== 200) {
    throw new Error(data.message || 'City not found');
  }

  return data;
}

function render(data) {
  const tz = data.timezone;
  const dt = data.dt;
  elements.location.textContent = `${data.name}, ${data.sys.country}`;
  elements.time.textContent = `Local time: ${formatLocalTime(dt, tz)}`;
  elements.temp.textContent = `${Math.round(data.main.temp)}°C`;
  elements.description.textContent = `${data.weather[0].main}`;
  elements.feels.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
  elements.humidity.textContent = `Humidity: ${data.main.humidity}%`;
  elements.wind.textContent = `Wind: ${Math.round(data.wind.speed)} m/s`;
  elements.condText.textContent = `Condition ID: ${data.weather[0].id}`;

  applyTimeOfDayStyles(tz, dt);

  // Rain animation control
  const id = data.weather[0].id;
  if (id >= 200 && id < 600) {
    elements.r1.style.display = 'block';
    elements.r2.style.display = 'block';
    elements.r3.style.display = 'block';
  } else {
    elements.r1.style.display = 'none';
    elements.r2.style.display = 'none';
    elements.r3.style.display = 'none';
  }
}

const input = document.getElementById('query');
const btn = document.getElementById('searchBtn');

btn.addEventListener('click', search);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') search();
});

async function search() {
  const q = input.value.trim();
  if (!q) return alert('Please enter a city name');

  try {
    const data = await fetchWeather(q);
    render(data);
  } catch (err) {
    console.error('⚠️ Error:', err);
    alert(`Error: ${err.message}. Please check spelling or try again.`);
  }
}

// Load a default city when the app starts
window.addEventListener('load', () => {
  input.value = 'London';
  search();
});
