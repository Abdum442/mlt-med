// renderer.js
document.getElementById('todoForm').addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  const taskText = document.getElementById('textTodo').value;

  // Send the task text to the Electron backend
  window.electronAPI.sendToMain('addTodo', taskText);
});



// window.electronAPI.receiveFromMain('pythonOutput', (_event, outData) => {

// }

