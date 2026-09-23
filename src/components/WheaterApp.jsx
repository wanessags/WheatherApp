import sunny from '../assets/images/sunny.png'
import { useState } from 'react'

const WheatherApp = () => {
  // GERENCIAMENTO E CONTROLE DE DADOS E AÇÕES

  const [location, setLocation] = useState('')

  const [weatherData, setWeatherData] = useState({
    city: 'London',
    country: '',
    temperature: 28,
    humidity: 35,
    wind: 3,
    weatherCode: 0,
    date: new Date()
  })

  // CAMPOS QUE VAMOS BUSCAR NA OPEN-METEO
  const currentFields =
    'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code'

  // CÓDIGOS DO CLIMA
  const weatherCodes = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Cloudy',
    45: 'Fog',
    48: 'Fog',
    51: 'Drizzle',
    53: 'Drizzle',
    55: 'Drizzle',
    61: 'Rain',
    63: 'Rain',
    65: 'Rain',
    71: 'Snow',
    73: 'Snow',
    75: 'Snow',
    77: 'Snow',
    80: 'Rain Showers',
    81: 'Rain Showers',
    82: 'Rain Showers',
    85: 'Snow Showers',
    86: 'Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Thunderstorm'
  }

  // BUSCAR COORDENADAS DA CIDADE
  const getCoordinates = async (cityName) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityName
    )}&count=1&language=pt&format=json`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Erro ao buscar cidade!')
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      throw new Error('Cidade não encontrada!')
    }

    const city = data.results[0]

    return {
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      country: city.country
    }
  }

  // ALTERAÇÃO DO INPUT
  const handleInputChanges = (e) => {
    setLocation(e.target.value)
  }

  // PESQUISAR AO APERTAR ENTER
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(location)
    }
  }

  // FORMATAR A DATA
  const formatDate = (date) => {
    const newDate = new Date(date)

    return newDate.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    })
  }

  // PESQUISAR CLIMA
  const search = async (cityName) => {
    try {
      if (!cityName.trim()) {
        return
      }

      // BUSCAR COORDENADAS
      const coordinates = await getCoordinates(cityName)

      // PEGAR LATITUDE E LONGITUDE
      const { latitude, longitude } = coordinates

      // URL DA API DE CLIMA
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentFields}&timezone=auto`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }

      // TRANSFORMAR RESPOSTA EM JSON
      const data = await response.json()

      console.log(data)

      // ATUALIZAR DADOS NA TELA
      setWeatherData({
        city: coordinates.name,
        country: coordinates.country,
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        wind: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        date: data.current.time
      })

    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  // ELEMENTOS QUE SERÃO RENDERIZADOS
  return (
    <div className="container">

      <div className="weather-app">

        {/* PESQUISA */}
        <div className="search">

          <div className="search-top">

            <i className="fa-solid fa-location-dot"></i>

            <div className="location">
              {weatherData.city}

              {weatherData.country &&
                `, ${weatherData.country}`}
            </div>

          </div>

          <div className="search-bar">

            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChanges}
              onKeyDown={handleKeyDown}
            />

            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => search(location)}
            ></i>

          </div>

        </div>

        {/* CLIMA */}
        <div className="weather">

          <img
            src={sunny}
            alt={weatherCodes[weatherData.weatherCode]}
          />

          <div className="weather-type">
            {weatherCodes[weatherData.weatherCode]}
          </div>

          <div className="temp">
            {Math.round(weatherData.temperature)}°
          </div>

        </div>

        {/* DATA */}
        <div className="weather-date">

          <p>
            {formatDate(weatherData.date)}
          </p>

        </div>

        {/* DADOS DO CLIMA */}
        <div className="weather-data">

          <div className="humidity">

            <div className="data-name">
              Humidity
            </div>

            <i className="fa-solid fa-droplet"></i>

            <div className="data">
              {weatherData.humidity}%
            </div>

          </div>

          <div className="wind">

            <div className="data-name">
              Wind
            </div>

            <i className="fa-solid fa-wind"></i>

            <div className="data">
              {weatherData.wind} km/h
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default WheatherApp