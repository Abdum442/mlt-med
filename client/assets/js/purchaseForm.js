function showPurchaseForm(data_names) {
  // Create the form elements dynamically
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  const purchaseForm = document.createElement('form');
  purchaseForm.id = 'purchaseForm';

  const formFields = [
    { label: 'Item:', type: 'text', name: 'productId'}, 
    { label: 'Description:', type: 'text', name: 'description' },
    { label: 'Supplier:', type: 'datalist', name: 'supplierId', options: [] },
    { label: '   Enter New:', type: 'text', name: 'newSupplier' },
    { label: 'Batch Number:', type: 'text', name: 'batchNum'},
    { label: 'Expiry Date:', type: 'date', name: 'expiryDate' },
    { label: 'Unit Price:', type: 'text', name: 'unit' },
    { label: 'Quantity:', type: 'number', name: 'quantity' },
    { label: 'Invoice Number:', type: 'text', name: 'invoiceNum' },
    { label: 'Purchase Date:', type: 'date', name: 'purchaseDate' },
    { label: 'Payment Method:', type: 'text', name: 'paymentMtd' },
    { label: 'Full Amount:', type: 'text', name: 'fullAmount' },
    { label: 'Amount Paid:', type: 'text', name: 'amountPaid' },
    { label: 'Tax Withheld:', type: 'text', name: 'taxWithheld' },
    { label: 'Remark:', type: 'text', name: 'remark' },
  ];

  formFields[2].options = data_names.supplier.map(obj => [obj.name + "  " + obj.id]);
  formFields[2].options.push(['None']);



  

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
    }else if (field.name === 'remark' || field.name === 'description') {
      const textArea = document.createElement('textarea');
      textArea.id = field.name;
      textArea.name = field.name;
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
        } else{
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
  buttonContainer.appendChild(saveButton);

  const exitButton = document.createElement('button');
  exitButton.type = 'button';
  exitButton.id = 'exit_btn';
  exitButton.innerText = 'Exit';
  exitButton.addEventListener('click', exitForm);
  buttonContainer.appendChild(exitButton);

  formContainer.appendChild(purchaseForm);
  formContainer.appendChild(buttonContainer);


  const mainContainer = document.getElementById('mainContainer');

  mainContainer.innerHTML = '';

  mainContainer.appendChild(formContainer);
  purchaseForm.querySelector('#unit').setAttribute('placeholder', `* Unit Price is required`)

  const ids = [formFields[2].name];
  manageDataLists(ids);

}

function exitForm() {
  // Add logic to handle exiting the form
  document.getElementById("purchaseBtn").click();
}

function manageDataLists(ids){
  ids.forEach(function (id) {
    const autocompleteInput = document.getElementById(id + '_input');
    const optionsList = document.getElementById(id + 'OptionsList');

    const newSupplier = document.getElementById('newSupplier');

    newSupplier.parentElement.style.display = 'none';

    autocompleteInput.addEventListener('input', function () {
      const inputText = autocompleteInput.value.toLowerCase();
      const options = optionsList.querySelectorAll('option');

      options.forEach(option => {
        const optionText = option.value.toLowerCase();
        if (option.value == 'None') {
          option.style.display = 'block';
        } else {
          option.style.display = optionText.includes(inputText) ? 'block' : 'none';
        }    
      });
    });

    autocompleteInput.addEventListener('change', function() {
      const selectedOption = optionsList.querySelector(`option[value="${autocompleteInput.value}"]`);
      if (selectedOption) {
        if(selectedOption.value == 'None') {
          newSupplier.parentElement.style.display = 'flex';
          newSupplier.setAttribute('placeholder', 'Enter New Supplier');
        }
        console.log(`Selected option: ${selectedOption.value}`);
      }
    });

  });
}




const purchaseForm = {
  showPurchaseForm,
  exitForm
};

export { purchaseForm };