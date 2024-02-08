const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const axios = require('axios');

const serverUrl = 'http://localhost:3000';

const fetchSupplierReply = (_event, _data) => {
  _event.reply('fetch-suppliers-data-response', _data);
};

const fetchSupplierData = async (event, data) => {
  try {
    const response = await axios.get(`${serverUrl}/suppliers`, data);

    // event.reply('fetch-suppliers-data-response', response.data);
    fetchSupplierReply(event, response.data);

    // Remove the listener after handling the response
    ipcMain.removeListener('fetch-suppliers-data', fetchSupplierData);
    ipcMain.removeListener('fetch-suppliers-data-response', fetchSupplierReply);

  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection error:', error.message);
    } else {
      console.error('Other error:', error);
    }
    console.error(error);
  }
};

const addSupplierReply = (_event, _data) => {
  _event.reply('add-supplier-data-response', _data);
};

const addSupplierData = async (event, data) => {
  try {
    const response = await axios.post(`${serverUrl}/suppliers`, data);

    // event.reply('add-supplier-data-response', response.data);
    addSupplierReply(event, response.data);

    ipcMain.removeListener('add-supplier-data', addSupplierData);
    ipcMain.removeListener('add-supplier-data-response', addSupplierReply);
  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection error:', error.message);
    } else {
      console.error('Other error:', error);
    }
    console.error(error);
  }
};

const modifySupplierReply = (_event, _data) => {
  _event.reply('modify-supplier-data-response', _data);
};

const modifySupplierData = async (event, data) => {
  try {
    const response = await axios.put(`${serverUrl}/suppliers/${parseInt(data.id)}`, data);

    // const modifyReply = (_event, _data) => {
    //   _event.reply('modify-supplier-data-response', _data);
    // };

    modifySupplierReply(event, response.data);
    

    ipcMain.removeListener('modify-supplier-data', modifySupplierData);
    ipcMain.removeListener('modify-supplier-data-response', modifySupplierReply);
  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection error:', error.message);
    } else {
      console.error('Other error:', error);
    }
    console.error(error);
  }
};

const deleteSupplierReply = (_event, _data) => {
  _event.reply('delete-supplier-data-response', _data);
};

const deleteSupplierData =  async (event, data) => {
  try {
    const response = await axios.delete(`${serverUrl}/suppliers/${parseInt(data.id)}`, data);

    // event.reply('delete-supplier-data-response', response.data);
    deleteSupplierReply(event, response.data);

    ipcMain.removeListener('delete-supplier-data', deleteSupplierData);
    ipcMain.removeListener('delete-supplier-data-response', deleteSupplierReply);
  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection error:', error.message);
    } else {
      console.error('Other error:', error);
    }
    console.error(error);
  }
};

//---------------Retailer Data------------------------------------------

const fetchRetailerReply = (_event, _data) => {
  _event.reply('fetch-retailer-data-response', _data);
};

const fetchRetailerData = async (event, args) => {
  try {
    const response = await axios.get(`${serverUrl}/retailers`);

    event.reply('fetch-retailer-data-response', response.data);
    fetchRetailerReply(event, response.data);

    ipcMain.removeListener('fetch-retailer-data', fetchRetailerData);
    ipcMain.removeListener('fetch-retailer-data-response', fetchRetailerReply);

  } catch (error) {
    console.error(error);
  }
};

const addRetailerReply = (_event, _data) => {
  _event.reply('add-retailer-data-response', _data);
};

const addRetailerData = async (event, data) => {
  try {
    const response = await axios.post(`${serverUrl}/retailers`, data);

    // event.reply('add-retailer-data-response', response.data);
    addRetailerReply(event, response.data);

    ipcMain.removeListener('add-retailer-data', addRetailerData);
    ipcMain.removeListener('add-retailer-data-response', addRetailerReply);
  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection error:', error.message);
    } else {
      console.error('Other error:', error);
    }
    console.error(error);
  }
};

const modifyRetailerReply = (_event, _data) => {
  _event.reply('modify-retailer-data-response', _data);
};

const modifyRetailerData = async (event, data) => {
  try {
    const response = await axios.put(`${serverUrl}/retailers/${parseInt(data.id)}`, data);

    // event.reply('modify-retailer-data-response', response.data);
    modifyRetailerReply('modify-retailer-data-response', response.data);

    ipcMain.removeListener('modify-retailer-data', modifyRetailerData);
    ipcMain.removeListener('modify-retailer-data-response', modifyRetailerReply);
  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection error:', error.message);
    } else {
      console.error('Other error:', error);
    }
    console.error(error);
  }
};

const deleteRetailerReply = (_event, _data) => {
  _event.reply('delete-retailer-data-response', _data);
};

const deleteRetailerData = async (event, data) => {
  try {
    const response = await axios.delete(`${serverUrl}/retailers/${parseInt(data.id)}`, data);

    // event.reply('delete-retailer-data-response', response.data);
    deleteRetailerReply(event, response.data);

    ipcMain.removeListener('delete-retailer-data', deleteRetailerData);
    ipcMain.removeListener('delete-retailer-data-response', deleteRetailerReply);

  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection error:', error.message);
    } else {
      console.error('Other error:', error);
    }
    console.error(error);
  }
}



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

  


  ipcMain.on('fetch-users', async (event, args) =>{
    try {
      const response = await axios.get(`${serverUrl}/users`);

      event.reply('fetch-users-response', response.data);
    } catch (error) {
      console.error(error);
    }
  });

  //--------------Suppliers Data-------------------------------

  ipcMain.on('fetch-suppliers-data', fetchSupplierData);

  ipcMain.on('add-supplier-data', addSupplierData);

  ipcMain.on('modify-supplier-data', modifySupplierData);

  ipcMain.on('delete-supplier-data', deleteSupplierData);


  // -----------------------Retailer--------------------------
  ipcMain.on('fetch-retailer-data', fetchRetailerData);

  ipcMain.on('add-retailer-data', addRetailerData);

  ipcMain.on('modify-retailer-data', modifyRetailerData);

  ipcMain.on('delete-retailer-data', deleteRetailerData);
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