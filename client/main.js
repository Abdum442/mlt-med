// main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  ipcMain.on('addTodo', async (event, taskText) => {
    const queryText = 'INSERT INTO todo (task) VALUES ($1)';
    const values = [taskText];

    try {
      const result = await pool.query(queryText, values);
      console.log('Todo item added successfully:', result.rows);
    } catch (error) {
      console.error('Error adding todo item:', error);
    }
  });

  // win.webContents.openDevTools(); // Remove this line for production
}



app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
