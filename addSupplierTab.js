function addSupplier ()  {
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  formContainer.innerHTML =
    `<div class="row">
      <div class="col-50">
        <h3>Contact Details</h3>
        <label for="supplier-name">Name</label>
        <input type="text" id="supplier-name" name="supplierName">
        <label for="supplier-address">Address</label>
        <input type="text" id="supplier-address" name="supplierAddress">
        <label for="supplier-phone">Phone Number</label>
        <input type="text" id="supplier-phone" name="supplierPhone">
      </div>
      <div class="col-50">
        <h3>Tax & Licence Info</h3>
        <label for="supplier-tin">TIN Number</label>
        <input type="text" id="supplier-tin" name="supplierTIN">
        <label for="supplier-licence">Licence Number</label>
        <input type="text" id="supplier-licence" name="supplierLicence">
      </div>

    </div>
    <label for="supplier-remark">Remarks</label>
    <textarea name="supplierRemark" id="supplier-remark" style="width:100%; height:100px"></textarea>
    <div class="row" style="margin-top:20px">
      <div class="col-50">
        <button class="btn">Save</button>
      </div>
      <div class="col-50">
        <button class="btn" style="background-color:red">Exit</button>
      </div>
    </div>`;

    return formContainer;
}

const supplierForm = {
  addSupplier
};

export { supplierForm }