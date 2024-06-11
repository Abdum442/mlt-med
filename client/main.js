const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const axios = require('axios');

const serverUrl = 'http://localhost:3000';


const fetchData = (urlRout) => {
  const channel = 'fetch-'+urlRout+'-data';
  ipcMain.handle(channel, async (event, data) => {
    try {
      const response = await axios.get(`${serverUrl}/${urlRout}`, data);
      return JSON.stringify(response.data);
    } catch (err) {
      if (err.code === 'ECONNRESET' || err.code === 'ECONNABORTED') {
        console.error('Connection error:', err.message);
      } else {
        console.error('Other error:', err);
      }
    }
  });
};

const modifyData = (urlRout) => {
  const channel = 'modify-' + urlRout + '-data';
  ipcMain.handle(channel, async (event, data) => {
    try {
      const response = await axios.put(`${serverUrl}/${urlRout}/${parseInt(data.id)}`, data);
      return JSON.stringify(response.data);
    } catch (err) {
      if (err.code === 'ECONNRESET' || err.code === 'ECONNABORTED') {
        console.error('Connection error:', err.message);
      } else {
        console.error('Other error:', err);
      }
    }
  });
};

const deleteData = (urlRout) => {
  const channel = 'delete-' + urlRout + '-data';
  ipcMain.handle(channel, async (event, data) => {
    try {
      const response = await axios.delete(`${serverUrl}/${urlRout}/${parseInt(data.id)}`, data);
      return JSON.stringify(response.data);
    } catch (err) {
      if (err.code === 'ECONNRESET' || err.code === 'ECONNABORTED') {
        console.error('Connection error:', err.message);
      } else {
        console.error('Other error:', err);
      }
    }
  });
};

const addData = (urlRout) => {
  const channel = 'add-' + urlRout + '-data';
  ipcMain.handle(channel, async (event, data) => {
    try {
      const response = await axios.post(`${serverUrl}/${urlRout}`, data);
      return JSON.stringify(response.data);
    } catch (err) {
      if (err.code === 'ECONNRESET' || err.code === 'ECONNABORTED') {
        console.error('Connection error:', err.message);
      } else {
        console.error('Other error:', err);
      }
    }
  });
};

const salesReportWindow = () => {
  ipcMain.handle('open-sales-window', (event, data) => {
    const salesWin = new BrowserWindow({
      width: 1200,
      height: 2000,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
      },
    });
    salesWin.maximize();

    salesWin.loadFile(data.file);
  })
}

fetchData('users');
fetchData('suppliers');
fetchData('retailers');
fetchData('products');
fetchData('stock');
fetchData('sales');
fetchData('purchase');
fetchData('expenses');
fetchData('loans');
fetchData('debit');
fetchData('banks');

fetchData('orders');


// addData('users');
addData('suppliers');
addData('retailers');
addData('products');
addData('purchase');
addData('sales');
addData('stock');
addData('expenses');
addData('loans');
addData('debit');
addData('banks');

addData('orders');

// modifyData('users');
modifyData('suppliers');
modifyData('retailers');
modifyData('products');
modifyData('stock');


// deleteData('users');
deleteData('suppliers');
deleteData('retailers');
deleteData('products');
deleteData('sales');

deleteData('orders');

salesReportWindow();




const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });
  win.maximize()

  win.loadFile('index.html');

  
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