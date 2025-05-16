        // API keys
        const WEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
        const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';
        
        // Elementos DOM
        const cityInput = document.getElementById('city-input');
        const searchBtn = document.getElementById('search-btn');
        const suggestionsContainer = document.getElementById('suggestions');
        const weatherContainer = document.getElementById('weather-container');
        const forecastContainer = document.getElementById('forecast-container');
        
        // Variables para gestionar el autocompletado
        let suggestionsVisible = false;
        let selectedIndex = -1;
        let suggestions = [];
        let debounceTimer;
        
        // Event listener para el input (para el autocompletado)
        cityInput.addEventListener('input', () => {
            const query = cityInput.value.trim();
            
            // Limpiar el timer anterior para evitar múltiples peticiones
            clearTimeout(debounceTimer);
            
            if (query.length >= 2) {
                // Establecer un debounce para no hacer peticiones en cada pulsación
                debounceTimer = setTimeout(() => {
                    fetchCitySuggestions(query);
                }, 300);
            } else {
                hideSuggestions();
            }
        });
        
        // Event listener para las teclas (navegación por las sugerencias)
        cityInput.addEventListener('keydown', (e) => {
            if (suggestionsVisible) {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        navigateSuggestions(1);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        navigateSuggestions(-1);
                        break;
                    case 'Enter':
                        if (selectedIndex >= 0) {
                            e.preventDefault();
                            selectSuggestion(selectedIndex);
                        }
                        break;
                    case 'Escape':
                        hideSuggestions();
                        break;
                }
            } else if (e.key === 'Enter') {
                const city = cityInput.value.trim();
                if (city) {
                    fetchWeatherData(city);
                    fetchForecastData(city);
                }
            }
        });
        
        // Ocultar sugerencias al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!suggestionsContainer.contains(e.target) && e.target !== cityInput) {
                hideSuggestions();
            }
        });
        
        // Event listener para el botón de búsqueda
        searchBtn.addEventListener('click', () => {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeatherData(city);
                fetchForecastData(city);
            }
        });
        
        // Función para obtener sugerencias de ciudades
        async function fetchCitySuggestions(query) {
            try {
                const response = await fetch(`${GEO_API_URL}?q=${query}&limit=5&appid=${WEATHER_API_KEY}`);
                
                if (!response.ok) {
                    throw new Error('No se pudieron obtener sugerencias');
                }
                
                suggestions = await response.json();
                displaySuggestions(suggestions);
                
            } catch (error) {
                console.error('Error al obtener sugerencias:', error);
                hideSuggestions();
            }
        }
        
        // Función para mostrar las sugerencias
        function displaySuggestions(suggestions) {
            if (suggestions.length === 0) {
                hideSuggestions();
                return;
            }
            
            suggestionsContainer.innerHTML = '';
            suggestions.forEach((city, index) => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
                
                item.addEventListener('click', () => {
                    selectSuggestion(index);
                });
                
                item.addEventListener('mouseover', () => {
                    setSelectedSuggestion(index);
                });
                
                suggestionsContainer.appendChild(item);
            });
            
            showSuggestions();
            selectedIndex = -1;
        }
        
        // Mostrar el contenedor de sugerencias
        function showSuggestions() {
            suggestionsContainer.style.display = 'block';
            suggestionsVisible = true;
        }
        
        // Ocultar el contenedor de sugerencias
        function hideSuggestions() {
            suggestionsContainer.style.display = 'none';
            suggestionsVisible = false;
            selectedIndex = -1;
        }
        
        // Función para navegar por las sugerencias con teclado
        function navigateSuggestions(step) {
            const items = suggestionsContainer.querySelectorAll('.suggestion-item');
            const maxIndex = items.length - 1;
            
            // Calcular el nuevo índice
            selectedIndex = (selectedIndex + step) % items.length;
            if (selectedIndex < 0) selectedIndex = maxIndex;
            
            // Actualizar la visualización
            setSelectedSuggestion(selectedIndex);
        }
        
        // Establecer la sugerencia seleccionada
        function setSelectedSuggestion(index) {
            const items = suggestionsContainer.querySelectorAll('.suggestion-item');
            
            // Quitar selección anterior
            items.forEach(item => item.classList.remove('selected'));
            
            // Añadir selección actual
            if (index >= 0 && index < items.length) {
                selectedIndex = index;
                items[index].classList.add('selected');
                
                // Asegurar que el elemento seleccionado esté visible
                items[index].scrollIntoView({ block: 'nearest' });
            }
        }
        
        // Seleccionar una sugerencia
        function selectSuggestion(index) {
            if (index >= 0 && index < suggestions.length) {
                const city = suggestions[index];
                cityInput.value = city.name;
                hideSuggestions();
                
                // Obtener clima para la ciudad seleccionada
                fetchWeatherData(city.name, city.lat, city.lon);
                fetchForecastData(city.name, city.lat, city.lon);
            }
        }
        
        // Función para obtener datos del clima actual
        async function fetchWeatherData(city, lat, lon) {
            try {
                // Mostrar estado de carga
                weatherContainer.innerHTML = '<div class="loading">Cargando datos del clima...</div>';
                
                let url;
                if (lat && lon) {
                    // Si tenemos coordenadas, las usamos para mayor precisión
                    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;
                } else {
                    // Si no, usamos el nombre de la ciudad
                    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;
                }
                
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error('No se pudo encontrar la ciudad');
                }
                
                const data = await response.json();
                displayWeatherData(data);
                
            } catch (error) {
                weatherContainer.innerHTML = `<div class="error">${error.message}</div>`;
            }
        }
        
        // Función para obtener datos del pronóstico
        async function fetchForecastData(city, lat, lon) {
            try {
                // Mostrar estado de carga
                forecastContainer.innerHTML = '<div class="loading">Cargando pronóstico...</div>';
                
                let url;
                if (lat && lon) {
                    // Si tenemos coordenadas, las usamos para mayor precisión
                    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;
                } else {
                    // Si no, usamos el nombre de la ciudad
                    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;
                }
                
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error('No se pudo obtener el pronóstico');
                }
                
                const data = await response.json();
                displayForecastData(data);
                
            } catch (error) {
                forecastContainer.innerHTML = `<div class="error">${error.message}</div>`;
            }
        }
        
        // Función para mostrar datos del clima actual
        function displayWeatherData(data) {
            const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            const temperature = Math.round(data.main.temp);
            const feelsLike = Math.round(data.main.feels_like);
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const windSpeed = Math.round(data.wind.speed * 3.6); // m/s a km/h
            const pressure = data.main.pressure;
            
            // Determinar clase para estilo basado en condición meteorológica
            let weatherClass = 'weather-default';
            const weatherId = data.weather[0].id;
            const isDay = data.weather[0].icon.includes('d');
            
            if (weatherId >= 200 && weatherId < 300) {
                weatherClass = 'weather-thunderstorm';
            } else if (weatherId >= 300 && weatherId < 600) {
                weatherClass = 'weather-rain';
            } else if (weatherId >= 600 && weatherId < 700) {
                weatherClass = 'weather-snow';
            } else if (weatherId >= 700 && weatherId < 800) {
                weatherClass = 'weather-mist';
            } else if (weatherId === 800) {
                weatherClass = isDay ? 'weather-clear-day' : 'weather-clear-night';
            } else if (weatherId > 800) {
                weatherClass = 'weather-clouds';
            }
            
            // Obtener fecha y hora actual
            const now = new Date();
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            const dateStr = now.toLocaleDateString('es-ES', options);
            const capitalizedDateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
            
            weatherContainer.className = weatherClass;
            weatherContainer.innerHTML = `
                <div class="weather-info">
                    <div class="city-name">${data.name}, ${data.sys.country}</div>
                    <div class="date-info">${capitalizedDateStr}</div>
                    
                    <div class="weather-main">
                        <img src="${weatherIcon}" alt="${description}" class="weather-icon">
                        <div class="temperature">${temperature}°</div>
                    </div>
                    
                    <div class="description">${description.charAt(0).toUpperCase() + description.slice(1)}</div>
                    
                    <div class="details">
                        <div>
                            <div class="label"><span class="icon">🌡️</span>Sensación</div>
                            <div class="value">${feelsLike}°C</div>
                        </div>
                        <div>
                            <div class="label"><span class="icon">💧</span>Humedad</div>
                            <div class="value">${humidity}%</div>
                        </div>
                        <div>
                            <div class="label"><span class="icon">💨</span>Viento</div>
                            <div class="value">${windSpeed} km/h</div>
                        </div>
                        <div>
                            <div class="label"><span class="icon">⏱️</span>Presión</div>
                            <div class="value">${pressure} hPa</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Función para mostrar datos del pronóstico
        function displayForecastData(data) {
            // Filtrar el pronóstico para obtener datos de cada día a las 12:00
            const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));
            
            let forecastHTML = '';
            
            forecastList.forEach(item => {
                const date = new Date(item.dt * 1000);
                const dayName = getDayName(date);
                const dayNumber = date.getDate();
                const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
                const temp = Math.round(item.main.temp);
                const description = item.weather[0].description;
                
                forecastHTML += `
                    <div class="forecast-item">
                        <div class="forecast-day">${dayName} ${dayNumber}</div>
                        <img src="${icon}" alt="${description}" class="forecast-icon">
                        <div class="forecast-temp">${temp}°C</div>
                        <div class="forecast-desc">${description.charAt(0).toUpperCase() + description.slice(1, 3)}...</div>
                    </div>
                `;
            });
            
            forecastContainer.innerHTML = forecastHTML;
        }
        
        // Función para obtener el nombre del día
        function getDayName(date) {
            const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            return days[date.getDay()];
        }
        
        // Cargar datos iniciales al cargar la página
        window.addEventListener('load', () => {
            const defaultCity = cityInput.value.trim();
            if (defaultCity) {
                fetchWeatherData(defaultCity);
                fetchForecastData(defaultCity);
            }
        });