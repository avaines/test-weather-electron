const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

/**
 * Service for handling CSV export of degree days data
 * for ISO50001 energy performance monitoring
 */
class CSVService {
  constructor(customDataDir = null) {
    // Use custom directory if provided, otherwise use default app data directory
    this.dataDir = customDataDir || path.join(app.getPath('userData'), 'data');
  }

  /**
   * Ensure data directory exists
   */
  async ensureDataDirectory() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create data directory: ${error.message}`);
    }
  }

  /**
   * Save degree days data to CSV file
   * @param {Object} data - Degree days data object
   * @returns {Promise<string>} Path to saved file
   */
  async saveData(data) {
    await this.ensureDataDirectory();

    // Use single filename for all data
    const filename = 'degree_days_data.csv';
    const filePath = path.join(this.dataDir, filename);

    // Check if file exists to determine if we need headers
    let fileExists = false;
    try {
      await fs.access(filePath);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    // Prepare CSV row
    const row = this.formatDataRow(data);

    // If file doesn't exist, add headers
    let content = '';
    if (!fileExists) {
      content = this.getCSVHeaders() + '\n';
    }
    content += row + '\n';

    // Append to file
    await fs.appendFile(filePath, content, 'utf8');

    return filePath;
  }

  /**
   * Get CSV headers
   * @returns {string} CSV header row
   */
  getCSVHeaders() {
    return [
      'Date',
      'Location ID',
      'Location Name',
      'Max Temp (°C)',
      'Min Temp (°C)',
      'Avg Temp (°C)',
      'Baseline Temp (°C)',
      'Heating Degree Days',
      'Cooling Degree Days',
      'Weather Type',
      'Wind Speed',
      'Wind Gust',
      'Visibility',
      'Humidity (%)',
      'UV Index',
      'Precip Probability (%)',
      'Collected At'
    ].join(',');
  }

  /**
   * Format data object as CSV row
   * @param {Object} data - Degree days data
   * @returns {string} CSV row
   */
  formatDataRow(data) {
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    };

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    return [
      formatDate(data.date),
      escapeCSV(data.locationId),
      escapeCSV(data.locationName),
      data.maxTemp,
      data.minTemp,
      data.avgTemp,
      data.baselineTemp,
      data.heatingDegreeDays,
      data.coolingDegreeDays,
      escapeCSV(data.weatherType),
      escapeCSV(data.windSpeed),
      escapeCSV(data.windGust),
      escapeCSV(data.visibility),
      escapeCSV(data.humidity),
      escapeCSV(data.uvIndex),
      escapeCSV(data.precipProbability),
      new Date().toISOString()
    ].join(',');
  }

  /**
   * Get all CSV files in data directory
   * @returns {Promise<Array>} List of CSV files
   */
  async getCSVFiles() {
    await this.ensureDataDirectory();

    try {
      const files = await fs.readdir(this.dataDir);
      return files.filter(file => file.endsWith('.csv'));
    } catch (error) {
      throw new Error(`Failed to read data directory: ${error.message}`);
    }
  }

  /**
   * Read CSV file content
   * @param {string} filename - CSV filename
   * @returns {Promise<string>} File content
   */
  async readCSVFile(filename) {
    const filePath = path.join(this.dataDir, filename);
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read CSV file: ${error.message}`);
    }
  }
}

module.exports = CSVService;
