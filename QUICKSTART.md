# Quick Start Guide

## Getting Your Met Office API Key

1. Visit https://datahub.metoffice.gov.uk/
2. Click "Register" or "Login/Register"
3. Complete the registration form
4. Browse available data products
5. Subscribe to a plan (free options available)
6. Get your API key from your account dashboard
7. Copy and save your API key securely

**Note:** The old DataPoint service was decommissioned. Weather DataHub is the new API.

## Running the Application

### Development Mode
```bash
npm start
```

### Building for Distribution

#### macOS
```bash
npm run build:mac
```
The `.dmg` file will be in `dist/` folder

#### Windows
```bash
npm run build:win
```
The `.exe` installer will be in `dist/` folder

## Daily Workflow

1. **Morning Routine**: Open the app
2. **Enter Credentials**: Your API key and location (saved automatically)
3. **Click Collect**: Press "Collect Today's Data"
4. **Review**: Check the success message
5. **Monthly Export**: CSV files automatically organized by month

## Common Location Coordinates

| City | Coordinates (Lat,Lon) |
|------|----------------------|
| London | 51.5074,-0.1278 |
| Manchester | 53.4808,-2.2426 |
| Birmingham | 52.4862,-1.8904 |
| Edinburgh | 55.9533,-3.1883 |
| Cardiff | 51.4816,-3.1791 |
| Belfast | 54.5973,-5.9301 |
| Glasgow | 55.8642,-4.2518 |
| Liverpool | 53.4084,-2.9916 |
| Bristol | 51.4545,-2.5879 |
| Newcastle | 54.9783,-1.6178 |

**How to find coordinates:**
- Use Google Maps: Right-click → "What's here?"
- Use https://www.latlong.net/
- Format: latitude,longitude (e.g., 51.5074,-0.1278)

## Data Location

### macOS
```
~/Library/Application Support/degree-days-collector/data/degree_days_data.csv
```

### Windows
```
%APPDATA%\degree-days-collector\data\degree_days_data.csv
```

Each day's data is appended as a new row to this single file.

## Troubleshooting

### App won't start
- Make sure Node.js is installed
- Run `npm install` again
- Check for error messages in terminal

### Can't collect data
- Verify API key is correct (from Weather DataHub)
- Check internet connection
- Ensure coordinates are in correct format
- Check Met Office API status
- Verify you have an active subscription on Weather DataHub

### CSV not created
- Check data directory exists
- Verify write permissions
- Look for error messages in the app

## ISO50001 Best Practices

1. **Collect Daily**: Run every business day
2. **Backup Monthly**: Save CSV files to secure storage
3. **Annual Reports**: Compile yearly data for audits
4. **Correlate Energy**: Match degree days with energy bills
5. **Document Process**: Keep records of collection methodology

## Support Resources

- Met Office Weather DataHub: https://datahub.metoffice.gov.uk/
- Weather DataHub Documentation: https://datahub.metoffice.gov.uk/docs
- Weather DataHub FAQs: https://datahub.metoffice.gov.uk/support/faqs
- Find Coordinates: https://www.latlong.net/
- Electron Documentation: https://www.electronjs.org/docs

## Tips

- Schedule daily reminders to collect data
- Export CSV files monthly for backup
- Use spreadsheet software to analyze trends
- Compare degree days year-over-year
- Normalize energy consumption by degree days
