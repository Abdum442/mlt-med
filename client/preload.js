const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  sendToMain: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receiveFromMain: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  }
  // ,
  // selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory')
});