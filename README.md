# Weather App

A sleek, real-time weather application that provides current weather conditions with automatic refresh capabilities and location-based forecasting.

## Features

### Weather Information
- Real-time weather data including temperature, humidity, wind speed, visibility, and atmospheric pressure
- Detailed weather conditions with feels-like temperature
- Min/max temperature tracking
- Location-based weather using browser geolocation
- Search weather by city name worldwide

### User Interface
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Auto-Refresh**: Automatic weather updates every 60 seconds with countdown timer
- **Favorites System**: Save up to 5 favorite cities for quick access
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Loading States**: Visual feedback during data fetching

### Additional Features
- Enter key support for quick searches
- Remove favorites with confirmation dialog
- Full country name display from country codes
- Error handling for invalid cities or network issues
- Persistent favorites storage across sessions

## Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with responsive design
- **JavaScript (ES6+)**: Vanilla JavaScript for application logic
- **OpenWeatherMap API**: Weather data provider
- **Geolocation API**: Browser-based location detection
- **LocalStorage API**: Favorites persistence

## Getting Started

### Prerequisites
- A modern web browser with JavaScript enabled
- Active internet connection for API requests
- Location permissions (optional, for geolocation feature)

### Installation

1. Clone or download the project files
2. Ensure all files are in the same directory structure
3. Open `index.html` in your web browser

### API Configuration

The application uses the OpenWeatherMap API. The API key is included in the code, but for production use, you should:
1. Register for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace the API key in the `fetchSearch` and `fetchCurrentLocation` functions

## Usage

### Searching for Weather
1. Enter a city name in the search input field
2. Click the search button or press Enter
3. View the current weather conditions for the specified city

### Using Geolocation
1. Click the location button
2. Allow location permissions when prompted
3. Weather data for your current location will be displayed

### Managing Favorites
1. After searching for a city, click "Add to Favorites"
2. Access saved cities from the favorites bar
3. Click the × button on any favorite to remove it
4. Maximum of 5 favorite cities can be saved

### Temperature Units
- Click the temperature toggle button to switch between Celsius and Fahrenheit
- The setting applies to all temperature values displayed

### Auto-Refresh
- Enable the auto-refresh toggle to automatically update weather data every 60 seconds
- View the countdown timer to see when the next update occurs
- Disable the toggle to pause automatic updates

## Data Persistence

Favorite cities are stored locally using the localStorage API and persist across browser sessions.

## Browser Compatibility

The application requires a modern browser with support for:
- ES6 JavaScript features
- Fetch API
- Geolocation API (for location-based weather)
- LocalStorage API

## Support

Ensure your browser has JavaScript enabled and that you have an active internet connection. For geolocation features, grant location permissions when prompted.

---

**Built with vanilla JavaScript • Real-time weather updates • Location-aware**
