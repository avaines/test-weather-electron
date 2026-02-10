const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  collectData: (apiKey, location, customDataDir) => ipcRenderer.invoke('collect-data', { apiKey, location, customDataDir }),
  getDataDirectory: () => ipcRenderer.invoke('get-data-directory'),
  selectDirectory: () => ipcRenderer.invoke('select-directory')
});
