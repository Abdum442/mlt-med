const { contextBridge, ipcRenderer } = require('electron')
// const Chart = require('chart.js/auto');  // Import using require

// window.Chart = Chart;  // Make Chart.js globally available in renderer process

// console.log('Chart imported in preload:', Chart);

contextBridge.exposeInMainWorld('electronAPI', {
  sendToMain: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receiveFromMain: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  }, 
  fetchData: (channel, data = null) => {
    return ipcRenderer.invoke(channel, data) 
  },
  sendQuery: (channel, queryType, query, data=null) => {
    return ipcRenderer.invoke(channel, queryType, query, data);
  }
})