const browseBtn = document.getElementById('browseBtn');
const nextBtn = document.getElementById('nextBtn');
const cancelBtn = document.getElementById('cancelBtn');
const selectedDir = document.getElementById('selectdDirectory');
const title = document.getElementById('title');

browseBtn.addEventListener('click', async () => {
  const selectedDirectory = await window.electronAPI.fetchData('browse-clicked');
})

nextBtn.addEventListener('click', async () => {
  window.electronAPI.fetchData('next-clicked');
  
})

window.electronAPI.receiveFromMain('log-data', (event, log) => {
  const logContainer = document.getElementById('data-log');
  logContainer.innerHTML += `<p>${log}</p>`;
})

window.electronAPI.receiveFromMain('config-serverDir', (event, serverDir)=>{
  alert(`Server Directory: ${serverDir}`);
  title.textContent = 'Server Directory is: ';
  selectedDir.value = serverDir;
})
window.electronAPI.receiveFromMain('browse-serverDir', (event, serverDir)=>{
  alert(`Server Dir From Browse: ${serverDir}`)
  title.textContent = 'Server Directory is: ';
  selectedDir.value = serverDir;
})

