const collectBtn = document.getElementById('collectBtn');
const apiKeyInput = document.getElementById('apiKey');
const locationInput = document.getElementById('location');
const statusDiv = document.getElementById('status');
const dataPathSpan = document.getElementById('dataPath');
const selectDirBtn = document.getElementById('selectDirBtn');
const dataDirInput = document.getElementById('dataDirectory');

let customDataDir = null;

// Load saved values from localStorage
document.addEventListener('DOMContentLoaded', async () => {
  const savedApiKey = localStorage.getItem('apiKey');
  const savedLocation = localStorage.getItem('location');
  const savedDataDir = localStorage.getItem('customDataDir');

  if (savedApiKey) apiKeyInput.value = savedApiKey;
  if (savedLocation) locationInput.value = savedLocation;
  if (savedDataDir) {
    customDataDir = savedDataDir;
    dataDirInput.value = savedDataDir;
  }

  // Get and display default data directory
  const dataDir = await window.electronAPI.getDataDirectory();
  dataPathSpan.textContent = customDataDir || dataDir;
});

// Directory picker handler
selectDirBtn.addEventListener('click', async () => {
  const selectedDir = await window.electronAPI.selectDirectory();
  if (selectedDir) {
    customDataDir = selectedDir;
    dataDirInput.value = selectedDir;
    dataPathSpan.textContent = selectedDir;
    localStorage.setItem('customDataDir', selectedDir);
    showStatus('Storage location updated', 'success');
  }
});

collectBtn.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  const location = locationInput.value.trim();

  if (!apiKey || !location) {
    showStatus('Please enter both API key and location ID', 'error');
    return;
  }

  // Save values to localStorage
  localStorage.setItem('apiKey', apiKey);
  localStorage.setItem('location', location);

  // Disable button and show loading
  collectBtn.disabled = true;
  collectBtn.textContent = 'Collecting Data...';
  statusDiv.className = 'status hidden';

  try {
    const result = await window.electronAPI.collectData(apiKey, location, customDataDir);

    if (result.success) {
      showStatus(result.message, 'success');
    } else {
      showStatus(`Error: ${result.message}`, 'error');
    }
  } catch (error) {
    showStatus(`Error: ${error.message}`, 'error');
  } finally {
    collectBtn.disabled = false;
    collectBtn.textContent = 'Collect Today\'s Data';
  }
});

function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
}
