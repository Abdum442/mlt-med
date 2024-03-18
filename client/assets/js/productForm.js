function showProductForm(data_names) {
  // Create the form elements dynamically
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  const productForm = document.createElement('form');
  productForm.id = 'productForm';

  const formFields = [
    { label: 'Item Name:', type: 'text', name: 'productName'},
    { label: 'Description:', type: 'text', name: 'description' },
    { label: 'Supplier:', type: 'datalist', name: 'supplierId', options: [] },
    { label: 'Purchasing Price:', type: 'number', name: 'purchasePrice' },
    { label: 'Selling Price:', type: 'number', name: 'SellingPrice' },
    { label: 'Expiry Date:', type: 'date', name: 'expiryDate' },
    { label: 'Remark:', type: 'text', name: 'remark' },
  ];

  formFields[2].options = data_names.map(obj => [obj.name + "  " + obj.id]);



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

    productForm.appendChild(formRow);
  });

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.innerText = 'Save';
  saveButton.id = 'save_btn';
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

  formContainer.appendChild(productForm);

  const errorDisplayer = document.createElement('div');
  errorDisplayer.className = 'error-display';
  errorDisplayer.style.display = 'none';
  const errorList = document.createElement('ul');

  errorDisplayer.appendChild(errorList);
  formContainer.appendChild(errorDisplayer);

  formContainer.appendChild(buttonContainer);

  const mainContainer = document.getElementById('mainContainer');

  mainContainer.innerHTML = '';

  mainContainer.appendChild(formContainer);

  const ids = [formFields[2].name];
  manageDataLists(ids);


}

function exitForm() {
  // Add logic to handle exiting the form
  document.getElementById("productBtn").click();
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




const productForm = {
  showProductForm,
  exitForm
};

export { productForm };