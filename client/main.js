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

  win.loadFile('index.html')
  ipcMain.on('fetch-users', async (event, args) =>{
    try {
      const response = await axios.get('http://localhost:3000/users');

      event.reply('fetch-users-response', response.data);
    } catch (error) {
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