const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  sendToMain: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receiveFromMain: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  }, 
  fetchData: (channel, data = null) => {
    return ipcRenderer.invoke(channel, data) 
  }
})