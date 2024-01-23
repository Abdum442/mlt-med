const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const axios = require('axios');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');

  const serverUrl = 'http://localhost:3000';


  ipcMain.on('fetch-users', async (event, args) =>{
    try {
      const response = await axios.get(`${serverUrl}/users`);

      event.reply('fetch-users-response', response.data);
    } catch (error) {
      console.error(error);
    }
  });

  ipcMain.on('fetch-suppliers-data', async (event, args) => {
    try {
      const response = await axios.get(`${serverUrl}/suppliers`);

      event.reply('fetch-suppliers-data-response', response.data);
    } catch (error) {
      console.error(error);
    }
  });

  ipcMain.on('add-supplier-data', async (event, data) => {
    try {
      const response = await axios.post(`${serverUrl}/suppliers`, data);

      event.reply('add-supplier-data-response', response.data);
    } catch (error) {
      if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
        console.error('Connection error:', error.message);
      } else {
        console.error('Other error:', error);
      }
      console.error(error);
    }
  });

  ipcMain.on('modify-supplier-data', async (event, data) => {
    try {
      const response = await axios.put(`${serverUrl}/suppliers/${parseInt(data.id)}`, data);

      event.reply('modify-supplier-data-response', response.data);
    } catch (error) {
      if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
        console.error('Connection error:', error.message);
      } else {
        console.error('Other error:', error);
      }
      console.error(error);
    }
  });

  ipcMain.on('delete-supplier-data', async (event, data) => {
    try {
      const response = await axios.delete(`${serverUrl}/suppliers/${parseInt(data.id)}`, data);

      event.reply('delete-supplier-data-response', response.data);
    } catch (error) {
      if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
        console.error('Connection error:', error.message);
      } else {
        console.error('Other error:', error);
      }
      console.error(error);
    }
  });
}




app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})  