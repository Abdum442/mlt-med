function showDebitForm() {
  // Create the form elements dynamically
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  const htmlForm = document.createElement('form');
  htmlForm.id = 'debitForm';


  const formFields = [
    { label: 'Purpose:', type: 'text', name: 'purpose' },
    { label: 'Amount:', type: 'number', name: 'amount' },
    { label: 'Interest Rate:', type: 'number', name: 'interest-rate' },
    { label: 'Payment Terms:', type: 'text', name: 'payment-terms' },
    { label: 'Remark:', type: 'text', name: 'remark' },
  ];



  formFields.forEach(field => {
    const formRow = document.createElement('div');
    formRow.className = 'form-row';

    const label = document.createElement('label');
    label.setAttribute('for', field.name);
    label.innerText = field.label;
    formRow.appendChild(label);

    if (field.name === 'remark' || field.name === 'description') {
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

    htmlForm.appendChild(formRow);
  });
  const errorDisplayer = document.createElement('div');
  errorDisplayer.className = 'error-display';
  errorDisplayer.style.display = 'none';
  const errorList = document.createElement('ul');

  errorDisplayer.appendChild(errorList);

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

  formContainer.appendChild(htmlForm);
  formContainer.appendChild(errorDisplayer);
  formContainer.appendChild(buttonContainer);

  const mainContainer = document.getElementById('mainContainer');

  mainContainer.innerHTML = '';

  mainContainer.appendChild(formContainer);

}

function exitForm() {
  document.getElementById('companyDebitBtn').click();
}



const debitForm = {
  showDebitForm,
  exitForm
};

export { debitForm };