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

fetchData('users');
fetchData('suppliers');
fetchData('retailers');
fetchData('products');
fetchData('stock');
fetchData('sales');
fetchData('purchase');

// addData('users');
addData('suppliers');
addData('retailers');
addData('products');
addData('purchase');
addData('sales');
addData('stock');

// modifyData('users');
modifyData('suppliers');
modifyData('retailers');
modifyData('products');
modifyData('stock');


// deleteData('users');
deleteData('suppliers');
deleteData('retailers');
deleteData('products');


// const fetchSupplierReply = (_event, _data) => {
//   _event.reply('fetch-suppliers-data-response', _data);
// };

// const fetchSupplierData = async (event, data) => {
//   try { 
//     const response = await axios.get(`${serverUrl}/suppliers`, data);
//     event.reply('fetch-suppliers-data-response', response.data);
//     // fetchSupplierReply(event, response.data);

//   } catch (error) {
//     if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
//       console.error('Connection error:', error.message);
//     } else {
//       console.error('Other error:', error);
//     }
//     console.error(error);
//   }
// };

// const addSupplierReply = (_event, _data) => {
//   _event.reply('add-supplier-data-response', _data);
// };

// const addSupplierData = async (event, data) => {
//   try {
//     const response = await axios.post(`${serverUrl}/suppliers`, data);
//     event.reply('add-supplier-data-response', response.data);
//     // addSupplierReply(event, response.data);

//   } catch (error) {
//     if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
//       console.error('Connection error:', error.message);
//     } else {
//       console.error('Other error:', error);
//     }
//     console.error(error);
//   }
// };

// const modifySupplierReply = (_event, _data) => {
//   _event.reply('modify-supplier-data-response', _data);
// };

// const modifySupplierData = async (event, data) => {
//   try {
//     const response = await axios.put(`${serverUrl}/suppliers/${parseInt(data.id)}`, data);
//     event.reply('modify-supplier-data-response', response.data);

//     // modifySupplierReply(event, response.data);

//   } catch (error) {
//     if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
//       console.error('Connection error:', error.message);
//     } else {
//       console.error('Other error:', error);
//     }
//     console.error(error);
//   }
// };

// const deleteSupplierReply = (_event, _data) => {
//   _event.reply('delete-supplier-data-response', _data);
// };

// const deleteSupplierData =  async (event, data) => {
//   try {
//     const response = await axios.delete(`${serverUrl}/suppliers/${parseInt(data.id)}`, data);
//     event.reply('delete-supplier-data-response', response.data);

//     // deleteSupplierReply(event, response.data);

//   } catch (error) {
//     if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
//       console.error('Connection error:', error.message);
//     } else {
//       console.error('Other error:', error);
//     }
//     console.error(error);
//   }
// };

// //---------------Retailer Data------------------------------------------

// const fetchRetailerReply = (_event, _data) => {
//   _event.reply('fetch-retailer-data-response', _data);
// };

// const fetchRetailerData = async (event, args) => {
//   try {
//     const response = await axios.get(`${serverUrl}/retailers`);

//     event.reply('fetch-retailer-data-response', response.data);
//     // fetchRetailerReply(event, response.data);

//   } catch (error) {
//     console.error(error);
//   }
// };

// const addRetailerReply = (_event, _data) => {
//   _event.reply('add-retailer-data-response', _data);
// };

// const addRetailerData = async (event, data) => {
//   try {
//     const response = await axios.post(`${serverUrl}/retailers`, data);

//     event.reply('add-retailer-data-response', response.data);

//     // addRetailerReply(event, response.data);

//   } catch (error) {
//     if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
//       console.error('Connection error:', error.message);
//     } else {
//       console.error('Other error:', error);
//     }
//     console.error(error);
//   }
// };

// const modifyRetailerReply = (_event, _data) => {
//   _event.reply('modify-retailer-data-response', _data);
// };

// const modifyRetailerData = async (event, data) => {
//   try {
//     const response = await axios.put(`${serverUrl}/retailers/${parseInt(data.id)}`, data);

//     event.reply('modify-retailer-data-response', response.data);

//     // modifyRetailerReply('modify-retailer-data-response', response.data);

//   } catch (error) {
//     if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
//       console.error('Connection error:', error.message);
//     } else {
//       console.error('Other error:', error);
//     }
//     console.error(error);
//   }
// };

// const deleteRetailerReply = (_event, _data) => {
//   _event.reply('delete-retailer-data-response', _data);
// };

// const deleteRetailerData = async (event, data) => {
//   try {
//     const response = await axios.delete(`${serverUrl}/retailers/${parseInt(data.id)}`, data);

//     event.reply('delete-retailer-data-response', response.data);



//   } catch (error) {
//     if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
//       console.error('Connection error:', error.message);
//     } else {
//       console.error('Other error:', error);
//     }
//     console.error(error);
//   }
// }



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

  // fetchData('users');

  // //--------------Suppliers Data-------------------------------

  // fetchData('suppliers');

  // addData('suppliers');

  // modifyData('suppliers');

  // deleteData('suppliers');


  // // -----------------------Retailer--------------------------
  // fetchData('retailers');

  // addData('retailers')

  // modifyData('retailers');
 
  // deleteData('retailers');
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