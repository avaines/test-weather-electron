#!/usr/bin/env node

/**
 * CLI tool for collecting degree days data
 * Can be run from cron or Windows Task Scheduler
 * 
 * Usage:
 *   node cli.js --apikey YOUR_API_KEY --coords "51.5074,-0.1278"
 *   node cli.js --apikey YOUR_API_KEY --coords "51.5074,-0.1278" --output /path/to/data
 */

const MetOfficeService = require('./src/services/metOfficeService');
const CSVService = require('./src/services/csvService');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    apiKey: null,
    coords: null,
    outputDir: null
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--apikey':
      case '-k':
        config.apiKey = args[++i];
        break;
      case '--coords':
      case '-c':
        config.coords = args[++i];
        break;
      case '--output':
      case '-o':
        config.outputDir = args[++i];
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
    }
  }

  return config;
}

function showHelp() {
  console.log(`
Degree Days Data Collector - CLI Mode

Usage:
  node cli.js --apikey YOUR_API_KEY --coords "LATITUDE,LONGITUDE" [options]

Required Arguments:
  --apikey, -k    Met Office Weather DataHub API key
  --coords, -c    Location coordinates (latitude,longitude)
                  Example: "51.5074,-0.1278" for London

Optional Arguments:
  --output, -o    Output directory for CSV files
                  Default: ./data
  --help, -h      Show this help message

Examples:
  # Basic usage (saves to ./data)
  node cli.js --apikey abc123 --coords "51.5074,-0.1278"

  # Custom output directory
  node cli.js --apikey abc123 --coords "51.5074,-0.1278" --output /path/to/data

  # Using short flags
  node cli.js -k abc123 -c "51.5074,-0.1278" -o ./output

Scheduling:
  # Linux/Mac (crontab -e):
  0 9 * * * cd /path/to/app && node cli.js -k YOUR_KEY -c "51.5074,-0.1278"

  # Windows Task Scheduler:
  Program: node
  Arguments: cli.js -k YOUR_KEY -c "51.5074,-0.1278"
  Start in: C:\\path\\to\\app
  `);
}

async function main() {
  const config = parseArgs();

  // Validate required arguments
  if (!config.apiKey || !config.coords) {
    console.error('Error: Missing required arguments');
    console.error('Run with --help for usage information\n');
    showHelp();
    process.exit(1);
  }

  // Set default output directory
  if (!config.outputDir) {
    config.outputDir = path.join(__dirname, 'data');
  }

  // Ensure output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  console.log('Degree Days Data Collector');
  console.log('==========================');
  console.log(`Location: ${config.coords}`);
  console.log(`Output: ${config.outputDir}`);
  console.log('');

  try {
    // Initialize services
    const metOfficeService = new MetOfficeService(config.apiKey);
    const csvService = new CSVService(config.outputDir);

    console.log('Fetching degree days data...');
    const data = await metOfficeService.getDegreeDaysData(config.coords);

    console.log('Saving to CSV...');
    const filePath = await csvService.saveData(data);

    console.log('');
    console.log('✓ Success!');
    console.log(`Date: ${data.date}`);
    console.log(`Location: ${data.locationName}`);
    console.log(`Avg Temperature: ${data.avgTemp}°C`);
    console.log(`Heating Degree Days: ${data.heatingDegreeDays}`);
    console.log(`Saved to: ${path.basename(filePath)}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('✗ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
