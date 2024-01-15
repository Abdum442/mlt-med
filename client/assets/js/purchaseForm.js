function showPurchaseForm(data_names) {
  // Create the form elements dynamically
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  const purchaseForm = document.createElement('form');
  purchaseForm.id = 'purchaseForm';

  const formFields = [
    { label: 'Purchase Item:', type: 'datalist', name: 'productId', options: [] }, 
    { label: 'Supplier:', type: 'datalist', name: 'supplierId', options: [] },
    { label: 'Quantity:', type: 'number', name: 'quantity' },
    { label: 'Purchasing Date:', type: 'date', name: 'purchaseDate' },
    { label: 'Payment Method:', type: 'text', name: 'paymentMtd' },
    { label: 'Amount Paid:', type: 'number', name: 'amountPaid' },
    { label: 'Tax Withheld:', type: 'text', name: 'taxWithheld' },
    { label: 'Remark:', type: 'text', name: 'remark' },
  ];

  formFields[0].options = data_names.products;
  formFields[1].options = data_names.status;

  

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
    }else if (field.name === 'remark') {
      const textArea = document.createElement('textarea');
      textArea.id = 'remark';
      textArea.name = 'remark';
      textArea.style = 'height:100px';
      textArea.style = 'width:100%'
      formRow.appendChild(textArea);
    }else  {
      const input = document.createElement('input');
      input.type = field.type;
      if (field.type === 'number') {
        if (field.label === 'Quantity:') {
          input.setAttribute('min', '0');
          input.setAttribute('step', 1);
        } else {
          input.setAttribute('min', '0');
          input.setAttribute('step', 'any');
        }
      }
      input.id = field.name;
      input.name = field.name;
      formRow.appendChild(input);
    }

    purchaseForm.appendChild(formRow);
  });

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.innerText = 'Save';
  saveButton.id = 'save_btn';
  saveButton.addEventListener('click', savePurchase);
  buttonContainer.appendChild(saveButton);

  const exitButton = document.createElement('button');
  exitButton.type = 'button';
  exitButton.id = 'exit_btn';
  exitButton.innerText = 'Exit';
  exitButton.addEventListener('click', exitForm);
  buttonContainer.appendChild(exitButton);

  formContainer.appendChild(purchaseForm);
  formContainer.appendChild(buttonContainer);

  document.getElementById("recent_orders").innerHTML = '<h2>Purchase Registration Form</h2>';



  document.getElementById('recent_orders').appendChild(formContainer);

  const ids = [formFields[0].name, formFields[1].name];
  manageDataLists(ids);

}

function savePurchase() {
  // Add logic to handle saving the purchase data
  alert('Purchase saved!');
}

function exitForm() {
  // Add logic to handle exiting the form
  document.querySelector('.form-container').innerHTML = '';
}

function manageDataLists(ids){
  ids.forEach(function (id) {
    const autocompleteInput = document.getElementById(id + '_input');
    const optionsList = document.getElementById(id + 'OptionsList');

    autocompleteInput.addEventListener('input', function () {
      const inputText = autocompleteInput.value.toLowerCase();
      const options = optionsList.querySelectorAll('option');

      options.forEach(option => {
        const optionText = option.value.toLowerCase();
        option.style.display = optionText.includes( inputText ) ? 'block' : 'none';
      });
    });

    autocompleteInput.addEventListener('change', function() {
      const selectedOption = optionsList.querySelector(`option[value="${autocompleteInput.value}"]`);
      if (selectedOption) {
        console.log(`Selected option: ${selectedOption.value}`);
      }
    });

  });
}




const purchaseForm = {
  showPurchaseForm,
  savePurchase,
  exitForm
};

export { purchaseForm };