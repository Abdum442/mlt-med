function showExpenseForm() {
  // Create the form elements dynamically
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  const expenseForm = document.createElement('form');
  expenseForm.id = 'expenseForm';


  const formFields = [
    { label: 'Purpose:', type: 'text', name: 'description' },
    { label: 'Amount:', type: 'number', name: 'amount' },
    { label: 'Expense Date:', type: 'date', name: 'expense_date' },
    { label: 'Payment Method:', type: 'text', name: 'payment-method' },
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

    expenseForm.appendChild(formRow);
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

  formContainer.appendChild(expenseForm);
  formContainer.appendChild(errorDisplayer);
  formContainer.appendChild(buttonContainer);

  const mainContainer = document.getElementById('mainContainer');

  mainContainer.innerHTML = '';

  mainContainer.appendChild(formContainer);

}

function exitForm() {
  // Add logic to handle exiting the form
  document.getElementById('expensesBtn').click();
  // document.querySelector('.form-container').innerHTML = '';
}



const expenseForm = {
  showExpenseForm,
  exitForm
};

export { expenseForm };