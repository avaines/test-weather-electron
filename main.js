const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const MetOfficeService = require('./src/services/metOfficeService');
const CSVService = require('./src/services/csvService');

let mainWindow;
let isHeadless = false;

// Parse command line arguments for headless mode
function parseCommandLine() {
  const args = process.argv.slice(1); // Skip electron executable
  const config = {
    headless: false,
    apiKey: null,
    coords: null,
    outputDir: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--headless' || arg === '-H') {
      config.headless = true;
    } else if (arg === '--apikey' || arg === '-k') {
      config.apiKey = args[++i];
    } else if (arg === '--coords' || arg === '-c') {
      config.coords = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      config.outputDir = args[++i];
    }
  }

  return config;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('src/renderer/index.html');
}

app.whenReady().then(async () => {
  const config = parseCommandLine();

  if (config.headless) {
    // Run in headless mode (for scheduling)
    isHeadless = true;
    await runHeadless(config);
  } else {
    // Run with GUI
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  }
});

// Headless mode execution
async function runHeadless(config) {
  console.log('Degree Days Collector - Headless Mode');
  console.log('======================================');

  // Validate required arguments
  if (!config.apiKey || !config.coords) {
    console.error('Error: Missing required arguments');
    console.error('Usage: executable --headless --apikey KEY --coords "LAT,LON" [--output DIR]');
    console.error('');
    app.exit(1);
    return;
  }

  console.log(`Location: ${config.coords}`);
  console.log(`Output: ${config.outputDir || 'default app data directory'}`);
  console.log('');

  try {
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

    app.exit(0);
  } catch (error) {
    console.error('');
    console.error('✗ Error:', error.message);
    console.error('');
    app.exit(1);
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('select-directory', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select CSV Storage Directory',
    buttonLabel: 'Select Folder'
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('collect-data', async (event, { apiKey, location, customDataDir }) => {
  try {
    const metOfficeService = new MetOfficeService(apiKey);
    const csvService = new CSVService(customDataDir);

    // Get degree days data
    const data = await metOfficeService.getDegreeDaysData(location);

    // Save to CSV
    const filePath = await csvService.saveData(data);

    return {
      success: true,
      message: `Data collected successfully and saved to ${path.basename(filePath)}`,
      filePath
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});

ipcMain.handle('get-data-directory', async () => {
  const dataDir = path.join(app.getPath('userData'), 'data');
  return dataDir;
});
