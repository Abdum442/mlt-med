const { app, BrowserWindow, contextBridge, ipcMain } = require('electron')
const path = require('node:path')
const axios = require('axios');
const Chart = require('chart.js');

const { execSync, spawn } = require('child_process');
const { dialog } = require('electron');
const { shell } = require('electron');
// const electron = require('electron');

const userDataPath = app.getPath('userData');
const configFilePath = path.join(userDataPath, 'config.json');

const { exec } = require('child_process');

const fs = require('fs');

const serverUrl = 'http://localhost:3000';

async function checkServerURL() {
  try {
    // Try to make a GET request to the server URL
    const response = await axios.get(serverUrl);

    if (response.status === 200) {
      console.log('Server is up and running at:', serverUrl);
      return true;  // Server is up
    }
  } catch (error) {
    console.error('Failed to connect to server at:', serverUrl, '\nError:', error.message);
    return false;  // Server is down or unreachable
  }
}

async function checkDockerInstallation() {
  try {
    // Try running a simple Docker command
    execSync('docker --version', { stdio: 'ignore' });
    return true; // Docker is installed
  } catch (error) {
    // Docker not found, show a dialog box
    dialog.showMessageBox({
      type: 'warning',
      buttons: ['Automatic (need admin Privileges)', 'Manual (Recommended)'],
      defaultId: 0,
      message: 'Docker is not installed. How would you like to install it?',
    }).then(result => {
      if (result.response === 0) {
        installDockerAutomatically();
      } else {
        openDockerInstallationPage();
      }
    });
    return false;
  }
}

async function installDockerAutomatically() {
  // Run the process to install Docker automatically (Windows-specific logic here)
}

async function openDockerInstallationPage() {
  shell.openExternal('https://docs.docker.com/get-docker/');
  app.quit();
}

async function checkDockerService() {
  try {
    // Check if Docker is running by listing containers
    execSync('docker info', { stdio: 'ignore' });
    console.log('checkDockerService is running...')
    return true;
  } catch (error) {
    // Start Docker if it's not running
    execSync('net start com.docker.service', { stdio: 'ignore' });
  }
}
function createInstallWindow() {
  const instWin = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  });

  instWin.loadFile('installation/install_server.html');

  // Optional: Handle window close event
  instWin.on('closed', () => {
    console.log('Installation window closed');
  });

  return instWin;
}

function checkServerDirectory(installWin) {
  let config;

  let serDir;

  // Check if config file exists
  if (fs.existsSync(configFilePath)) {
    // console.log('config.json exists: ', configFilePath);
    config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    if (fs.existsSync(config.serverDirectory)) {
      console.log("saved server directory: ", config.serverDirectory);
      serDir = config.serverDirectory; // Directory already set, return it
      installWin.webContents.send('config-serverDir', serDir);
    }
  }
  

  if (serDir) {
    // Save config with server directory path
    config = { serverDirectory: serDir };
    fs.writeFileSync(configFilePath, JSON.stringify(config));

    return serDir;
  } else {
    return null;
  }
}

function runDockerCompose(serverDir, installWindow) {

  ipcMain.handle('next-clicked', async (event, selectedDir) => {
    // Copy docker-compose.yml if it doesn’t exist
    console.log("Next click is received");
    const dockerComposePath = path.join(serverDir, 'docker-compose.yml');
    if (!fs.existsSync(dockerComposePath)) {
      fs.copyFileSync(path.join(__dirname, 'docker-compose.yml'), dockerComposePath);
    }

    // Save config with server directory path
    config = { serverDirectory: serverDir };
    fs.writeFileSync(configFilePath, JSON.stringify(config));

    const composeProcess = spawn('docker-compose', ['up', '-d'], { cwd: serverDir, stdio: 'pipe' });


    composeProcess.stderr.on('data', data => {
      const message = data.toString();
      installWindow.webContents.send('log-data', message);
    });


    composeProcess.on('close', code => {
      if (code === 0) {
        installWindow.webContents.send('log-data', '\nServer started successfully.');
        // console.log("\n Server Started successfully")
      } else {
        installWindow.webContents.send('log-data', '\nFailed to start server.');
        // console.log("Failed to start server");
      }
    });

    createWindow();
  })
  
}


const handleQuery = (url_route) => {
  ipcMain.handle(url_route, async (event, queryType, query, data) => {
    try {
      const response = await axios.post(`${serverUrl}/${url_route}`, {queryType, query, data});
      return JSON.stringify(response.data);
    } catch (err) {
      if (err.code === 'ECONNRESET' || err.code === 'ECONNABORTED') {
        console.error('Connection error:', err.message);
      } else {
        console.error('Other error:', err);
      }
    }
  })
}


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

handleQuery('general-query');

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
    icon: path.join(__dirname, '/assets/icons/payment.icns') // Path to your icon
  });
  win.maximize()

  win.loadFile('index.html');
  // win.webContents.on('did-finish-load', () => {
  //   dialog.showOpenDialog({
  //     defaultPath:app.getPath('desktop'),
  //     buttonLabel: 'select any file'

  //   });
  // })
  
}




app.whenReady().then(async () => {

  // Check Docker Installation
  const isDockerInstalled = await checkDockerInstallation();

  if (!isDockerInstalled) {
    // Show dialog for automatic or manual installation
    const installChoice = await promptDockerInstallationOption();
    if (installChoice === 'automatic') {
      await installDockerAutomatically();
      await checkDockerService();
    } else if (installChoice === 'manual') {
      shell.openExternal('https://docs.docker.com/get-docker/');
      app.quit();
    }
  } else {
    // Docker is installed, proceed to check if Docker service is running
    await checkDockerService();
  }

  // Check if the server (URL) is already running
  const isServerRunning = await checkServerURL();

  console.log('Status of server: ', isServerRunning);

  if (!isServerRunning){
    const installationWindow = createInstallWindow();

    const serverDirFromConfig = checkServerDirectory(installationWindow); // This will handle both first-time and subsequent starts
    console.log("Server Dir From main: ", serverDirFromConfig);
    if (serverDirFromConfig) {
      runDockerCompose(serverDirFromConfig, installationWindow);
    } else {
      ipcMain.handle('browse-clicked', async (event, data) => {
        try {

          const result = await dialog.showOpenDialog({
            properties: ['openDirectory'],
            title: 'Select a directory for server-node',
          });

          if (!result.canceled && result.filePaths.length > 0) {
            const selectedDir = result.filePaths[0];  // Return the selected directory path
            const nodeServerDir = path.join(selectedDir, 'node-server');

            // Check if node-server exists, if not, create it
            if (!fs.existsSync(nodeServerDir)) {
              fs.mkdirSync(nodeServerDir);
            }

            installWin.webContents.send('browse-serverDir', nodeServerDir);
            runDockerCompose(nodeServerDir, installationWindow);
          }
        } catch (error) {
          console.error('Error in browse-clicked handler:', error);
        }
      })

    }
    
  } else {
    createWindow();
  } 
  


  

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

// app.on('before-quit', () => {
//   stopPostgres();
// });

