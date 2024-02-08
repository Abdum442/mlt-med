function showRetailerForm() {
  // Create the form elements dynamically
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  const retailerForm = document.createElement('form');
  retailerForm.id = 'retailerForm';

  retailerForm.innerHTML = '';

  const formFields = [
    { label: 'Retailer Name:', type: 'text', name: 'retailerName' },
    { label: 'Contact Info:', type: 'text', name: 'contactInfo' },
    { label: 'Address:', type: 'text', name: 'address' },
    { label: 'Remark:', type: 'text', name: 'remark' },
  ];



  formFields.forEach(field => {
    const formRow = document.createElement('div');
    formRow.className = 'form-row';

    const label = document.createElement('label');
    label.setAttribute('for', field.name);
    label.innerText = field.label;
    formRow.appendChild(label);

    if (field.type === 'datalist') {
      const input = document.createElement('input');
      input.type = "text";
      input.id = field.name + '_input';
      // input.list = field.name + 'OptionsList';
      input.setAttribute('list', field.name + 'OptionsList');
      const select = document.createElement('datalist');
      select.id = field.name + 'OptionsList';
      // select.name = field.name;

      field.options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.text = optionText;
        // select.add(option);
        select.appendChild(option);
      });
      formRow.appendChild(input);
      formRow.appendChild(select);
    } else if (field.name === 'remark' || field.name === 'description') {
      const textArea = document.createElement('textarea');
      textArea.id = field.name;
      textArea.name = field.name;
      textArea.style = 'height:100px';
      textArea.style = 'width:100%'
      formRow.appendChild(textArea);
    } else {
      const input = document.createElement('input');
      input.type = field.type;
      if (field.type === 'number') {
        input.setAttribute('min', '0');
        input.setAttribute('step', 'any');
      }
      input.id = field.name;
      input.name = field.name;
      formRow.appendChild(input);
    }

    retailerForm.appendChild(formRow);
  });

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.innerText = 'Save';
  saveButton.id = 'save_btn';
  saveButton.addEventListener('click', saveData);
  buttonContainer.appendChild(saveButton);

  const modifyButton = document.createElement('button');
  modifyButton.type = 'button';
  modifyButton.id = 'modify_btn';
  modifyButton.innerText = 'Modify';
  buttonContainer.appendChild(modifyButton);

  const exitButton = document.createElement('button');
  exitButton.type = 'button';
  exitButton.id = 'exit_btn';
  exitButton.innerText = 'Exit';
  exitButton.addEventListener('click', exitForm);
  buttonContainer.appendChild(exitButton);



  formContainer.appendChild(retailerForm);
  formContainer.appendChild(buttonContainer);

  const mainContainer = document.getElementById('mainContainer');

  mainContainer.innerHTML = '';

  mainContainer.appendChild(formContainer);

  // const ids = [formFields[2].name];
  // manageDataLists(ids);

}

function saveData() {
  const formData = new FormData(document.getElementById('retailerForm'));

  // Convert form data to a plain JavaScript object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;

  });
  window.electronAPI.sendToMain('add-retailer-data', formDataObject);

  window.electronAPI.receiveFromMain('add-retailer-data-response', (event, responseData) => {

    console.log('Retailer added: ', responseData);
  });
  document.getElementById("viewRetailer").click();
}

function exitForm() {
  document.getElementById("viewRetailer").click();
}

function manageDataLists(ids) {
  ids.forEach(function (id) {
    const autocompleteInput = document.getElementById(id + '_input');
    const optionsList = document.getElementById(id + 'OptionsList');

    autocompleteInput.addEventListener('input', function () {
      const inputText = autocompleteInput.value.toLowerCase();
      const options = optionsList.querySelectorAll('option');

      options.forEach(option => {
        const optionText = option.value.toLowerCase();
        option.style.display = optionText.includes(inputText) ? 'block' : 'none';
      });
    });

    autocompleteInput.addEventListener('change', function () {
      const selectedOption = optionsList.querySelector(`option[value="${autocompleteInput.value}"]`);
      if (selectedOption) {
        console.log(`Selected option: ${selectedOption.value}`);
      }
    });

  });
}




const retailerForm = {
  showRetailerForm
};

export { retailerForm };