const axios = require('axios');

/**
 * Service for interacting with the Met Office Weather DataHub API
 * to collect degree days data for energy performance monitoring
 *
 * Note: DataPoint API was decommissioned. This now uses Weather DataHub.
 * API Documentation: https://datahub.metoffice.gov.uk/
 */
class MetOfficeService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point';
    this.baselineTemp = 15.5; // Standard heating degree days baseline (°C)
  }

  /**
   * Get degree days data for a specific location
   * @param {string} coordinates - Latitude,Longitude (e.g., "51.5074,-0.1278" for London)
   * @returns {Promise<Object>} Degree days data
   */
  async getDegreeDaysData(coordinates) {
    try {
      // Parse coordinates
      const [latitude, longitude] = coordinates.split(',').map(c => parseFloat(c.trim()));

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates format. Use: latitude,longitude (e.g., 51.5074,-0.1278)');
      }

      // Get daily forecast data from Weather DataHub
      const url = `${this.baseUrl}/daily`;
      const params = {
        latitude,
        longitude,
        includeLocationName: true
      };

      const response = await axios.get(url, {
        params,
        headers: {
          'apikey': this.apiKey,
          'accept': 'application/json'
        }
      });

      const data = response.data;

      if (!data.features || data.features.length === 0) {
        throw new Error('No data available for this location');
      }

      const feature = data.features[0];
      const properties = feature.properties;
      const timeSeries = properties.timeSeries;

      if (!timeSeries || timeSeries.length === 0) {
        throw new Error('No forecast data available');
      }

      // Get today's data (first entry)
      const today = timeSeries[0];

      // Extract temperatures (Weather DataHub uses different field names)
      const maxTemp = parseFloat(today.dayMaxScreenTemperature || today.maxScreenAirTemp || 0);
      const minTemp = parseFloat(today.nightMinScreenTemperature || today.minScreenAirTemp || 0);

      // Calculate average temperature
      const avgTemp = (maxTemp + minTemp) / 2;

      // Calculate heating degree days
      // HDD = baseline - average temp (only if positive)
      const heatingDegreeDays = Math.max(0, this.baselineTemp - avgTemp);

      // Calculate cooling degree days (for completeness)
      const coolingDegreeDays = Math.max(0, avgTemp - this.baselineTemp);

      return {
        date: today.time, // ISO format timestamp
        locationId: `${latitude},${longitude}`,
        locationName: properties.location?.name || `${latitude}, ${longitude}`,
        maxTemp,
        minTemp,
        avgTemp: parseFloat(avgTemp.toFixed(2)),
        baselineTemp: this.baselineTemp,
        heatingDegreeDays: parseFloat(heatingDegreeDays.toFixed(2)),
        coolingDegreeDays: parseFloat(coolingDegreeDays.toFixed(2)),
        weatherType: today.significantWeatherCode || 'N/A',
        windSpeed: today.midday10MWindSpeed || 'N/A',
        windGust: today.midday10MWindGust || 'N/A',
        visibility: today.middayVisibility || 'N/A',
        humidity: today.middayRelativeHumidity || 'N/A',
        uvIndex: today.maxUvIndex || 'N/A',
        precipProbability: today.dayProbabilityOfPrecipitation || 'N/A'
      };
    } catch (error) {
      if (error.response) {
        // API returned an error
        if (error.response.status === 403 || error.response.status === 401) {
          throw new Error('Invalid API key. Please check your Met Office Weather DataHub API key.');
        } else if (error.response.status === 404) {
          throw new Error('Location not found. Please check the coordinates.');
        } else if (error.response.status === 400) {
          throw new Error('Invalid request. Please check coordinates format (latitude,longitude).');
        } else {
          throw new Error(`Met Office API error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        throw new Error('No response from Met Office API. Please check your internet connection.');
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    }
  }

}

// Common UK city coordinates for reference:
// London: 51.5074,-0.1278
// Manchester: 53.4808,-2.2426
// Birmingham: 52.4862,-1.8904
// Edinburgh: 55.9533,-3.1883
// Cardiff: 51.4816,-3.1791
// Belfast: 54.5973,-5.9301
// Glasgow: 55.8642,-4.2518
// Liverpool: 53.4084,-2.9916
// Bristol: 51.4545,-2.5879
// Newcastle: 54.9783,-1.6178

module.exports = MetOfficeService;
