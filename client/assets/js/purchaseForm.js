function showPurchaseForm() {
  // Create the form elements dynamically
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  const purchaseForm = document.createElement('form');
  purchaseForm.id = 'purchaseForm';

  const formFields = [
    { label: 'Purchase Item:', type: 'select', name: 'productId', options: ['Product 1', 'Product 2', 'Product 3'] }, 
    { label: 'Supplier:', type: 'select', name: 'supplierId', options: ['Supplier 1', 'Supplier 2', 'Supplier 3'] },
    { label: 'Quantity:', type: 'number', name: 'quantity' },
    { label: 'Purchasing Date:', type: 'date', name: 'purchaseDate' },
    { label: 'Payment Method:', type: 'text', name: 'paymentMtd' },
    { label: 'Amount Paid:', type: 'text', name: 'amountPaid' },
    { label: 'Tax Withheld:', type: 'text', name: 'taxWithheld' },
    { label: 'Remark:', type: 'text', name: 'remark' },
  ];

  formFields.forEach(field => {
    const formRow = document.createElement('div');
    formRow.className = 'form-row';

    const label = document.createElement('label');
    label.setAttribute('for', field.name);
    label.innerText = field.label;
    formRow.appendChild(label);

    if (field.type === 'select') {
      const select = document.createElement('select');
      select.id = field.name;
      select.name = field.name;

      field.options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText.toLowerCase().replace(' ', '_');
        option.text = optionText;
        select.add(option);
      });

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



  document.getElementById('recent_orders').appendChild(formContainer)

}

function savePurchase() {
  // Add logic to handle saving the purchase data
  alert('Purchase saved!');
}

function exitForm() {
  // Add logic to handle exiting the form
  document.body.removeChild(document.querySelector('.form-container'));
}


const purchaseForm = {
  showPurchaseForm,
  savePurchase,
  exitForm
};

export { purchaseForm };