# Degree Days Data Collector

An Electron desktop application for collecting Met Office degree days temperature data for ISO50001 energy performance monitoring.

## What are Degree Days?

Degree days are a measure of how much the outside temperature deviates from a baseline temperature (typically 15.5°C for heating). This metric is essential for:

- **ISO50001 Energy Management** - Tracking energy performance
- **Heating/Cooling Analysis** - Understanding energy consumption patterns
- **Energy Performance Indicators (EnPIs)** - Normalizing energy use against weather conditions

### Calculation

- **Heating Degree Days (HDD)** = Baseline Temperature - Average Daily Temperature (when positive)
- **Average Daily Temperature** = (Max Temperature + Min Temperature) / 2

## Features

- ✅ Daily data collection from Met Office Weather DataHub API
- ✅ Automatic CSV export to single continuously updated file
- ✅ Simple, user-friendly interface
- ✅ Command-line interface for automated/scheduled collection
- ✅ Data persistence and storage
- ✅ ISO50001 compliance ready
- ✅ Cross-platform (macOS, Windows, Linux)

## Prerequisites

1. **Met Office API Key**
   - Register for an API key at [Met Office Weather DataHub](https://datahub.metoffice.gov.uk/)
   - Sign up for a free account and subscribe to the appropriate plan
   - Note: DataPoint API was decommissioned - Weather DataHub is the replacement

2. **Location Coordinates**
   - Enter latitude and longitude for your location
   - Common UK locations:
     - London: 51.5074,-0.1278
     - Manchester: 53.4808,-2.2426
     - Birmingham: 52.4862,-1.8904
     - Edinburgh: 55.9533,-3.1883
     - Cardiff: 51.4816,-3.1791
     - Belfast: 54.5973,-5.9301

## Installation

### Option 1: Download Pre-built Executable

1. Download the latest release for your platform:
   - **macOS**: `Degree-Days-Collector-1.0.0.dmg`
   - **Windows**: `Degree-Days-Collector-Setup-1.0.0.exe`

2. Install and run the application

### Option 2: Build from Source

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

4. **Build executable:**
   ```bash
   # For macOS
   npm run build:mac
   
   # For Windows
   npm run build:win
   
   # For both
   npm run build
   ```

The built executables will be in the `dist/` folder.

## CLI Mode for Automation

### Option 1: Built Executable (No Node.js Required)

The built Windows/Mac executable can run in headless mode - perfect for scheduling!

**Windows:**
```cmd
"Degree Days Collector.exe" --headless --apikey YOUR_KEY --coords "51.5074,-0.1278" --output C:\Data
```

**macOS:**
```bash
"/Applications/Degree Days Collector.app/Contents/MacOS/Degree Days Collector" --headless --apikey YOUR_KEY --coords "51.5074,-0.1278"
```

**Included Scripts:**
- `schedule-windows.bat` - Simple Windows batch script
- `schedule-windows.ps1` - PowerShell with logging
- `schedule-unix.sh` - macOS/Linux shell script

Just edit the config variables and set up a scheduled task!

### Option 2: Node.js CLI (Development)

If you have Node.js installed:

```bash
# Basic usage
node cli.js --apikey YOUR_KEY --coords "51.5074,-0.1278"

# Custom output directory
node cli.js -k YOUR_KEY -c "51.5074,-0.1278" -o /path/to/data
```

**See [SCHEDULING.md](SCHEDULING.md) for complete automation setup with Task Scheduler, cron, and included scripts.**

## Usage

1. **Launch the application**

2. **Enter your Met Office API Key**
   - The app will remember your key for future use
   - Your key is stored securely in local storage

3. **Enter your Location Coordinates**
   - Use latitude,longitude format (e.g., 51.5074,-0.1278)
   - Find coordinates using Google Maps or similar services
   - The app will remember your location

4. **Click "Collect Today's Data"**
   - The app fetches current degree days data
   - Data is automatically saved to CSV file

5. **Find your data**
   - CSV file: `degree_days_data.csv`
   - Each day's data is appended as a new row
   - File location is shown in the app
   - Default locations:
     - **macOS**: `~/Library/Application Support/degree-days-collector/data/`
     - **Windows**: `%APPDATA%/degree-days-collector/data/`

## CSV Data Format

The exported CSV includes the following columns:

| Column | Description |
|--------|-------------|
| Date | Date of measurement (YYYY-MM-DD) |
| Location ID | Met Office location identifier |
| Location Name | Name of the location |
| Max Temp (°C) | Maximum temperature for the day |
| Min Temp (°C) | Minimum temperature for the day |
| Avg Temp (°C) | Average temperature (Max + Min) / 2 |
| Baseline Temp (°C) | Baseline temperature (15.5°C) |
| Heating Degree Days | HDD calculation |
| Cooling Degree Days | CDD calculation |
| Weather Type | Weather condition code |
| Wind Speed | Wind speed |
| Wind Gust | Wind gust speed |
| Visibility | Visibility conditions |
| Humidity (%) | Relative humidity |
| UV Index | UV index |
| Precip Probability (%) | Precipitation probability |
| Collected At | Timestamp of data collection |

## ISO50001 Compliance

This tool supports ISO50001 energy management requirements by:

- Providing consistent degree days data for energy performance tracking
- Creating auditable CSV records with timestamps
- Enabling normalization of energy consumption against weather conditions
- Supporting EnPI (Energy Performance Indicator) calculations

### Recommended Usage for ISO50001

1. **Daily Collection**: Run the app daily or use CLI mode with cron/Task Scheduler (see [SCHEDULING.md](SCHEDULING.md))
2. **Monthly Review**: Review CSV data during energy reviews
3. **Annual Analysis**: Use full year data for annual energy performance reports
4. **Energy Correlation**: Use degree days data to correlate with energy consumption
5. **Data Backup**: Regularly backup the `degree_days_data.csv` file

## Troubleshooting

### "Invalid API key" error
- Verify your Met Office Weather DataHub API key is correct
- Ensure you're subscribed to the appropriate plan on Weather DataHub
- Check that your API key is active and within request limits

### "Location not found" error
- Verify coordinates are in correct format: latitude,longitude
- Ensure coordinates are valid (latitude: -90 to 90, longitude: -180 to 180)
- Use decimal degrees (not degrees/minutes/seconds)

### No data appears
- Check your internet connection
- Verify the Met Office API is accessible
- Check the console for detailed error messages

## Development

### Project Structure

```
degree-days-collector/
├── main.js                          # Electron main process
├── preload.js                       # Preload script for IPC
├── package.json                     # Dependencies and build config
├── src/
│   ├── renderer/                    # Frontend UI
│   │   ├── index.html              # Main UI
│   │   ├── styles.css              # Styles
│   │   └── renderer.js             # UI logic
│   └── services/                    # Business logic
│       ├── metOfficeService.js     # Met Office API integration
│       └── csvService.js           # CSV export functionality
└── data/                           # CSV data files (generated)
```

### Technologies Used

- **Electron** - Desktop application framework
- **Axios** - HTTP client for API requests
- **Node.js** - Runtime environment
- **electron-builder** - Packaging and distribution

## License

MIT

## Support

For issues or questions:
1. Check the [Met Office Weather DataHub documentation](https://datahub.metoffice.gov.uk/docs)
2. Verify your API key and coordinates format
3. Check CSV files are being created in the data directory
4. Visit [Weather DataHub FAQs](https://datahub.metoffice.gov.uk/support/faqs)

## Version History

- **1.0.0** - Initial release
  - Met Office API integration
  - CSV export functionality
  - Basic UI
  - Cross-platform support
