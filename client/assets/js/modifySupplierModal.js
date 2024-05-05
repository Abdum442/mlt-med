function modifySupplier () {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'supplier-modal'

  modal.innerHTML = 
  `<div class="modal-content">
      <span onclick="document.getElementById('supplier-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
      <h2>Modify Supplier Company Details</h2>
      <div class="form-container">
        <div class="row">
          <div class="col-50">
            <h3>Contact Details</h3>
            <label for="mod-supplier-name">Name</label>
            <input type="text" id="mod-supplier-name" name="mod-supplierName">
            <label for="m-supplier-address">Address</label>
            <input type="text" id="mod-supplier-address" name="mod-supplierAddress">
            <label for="m-supplier-phone">Phone Number</label>
            <input type="text" id="mod-supplier-phone" name="mod-supplierPhone">
          </div>
          <div class="col-50">
            <h3>Tax & Licence Info</h3>
            <label for="mod-supplier-tin">TIN Number</label>
            <input type="text" id="mod-supplier-tin" name="mod-supplierTIN">
            <label for="mod-supplier-licence">Licence Number</label>
            <input type="text" id="mod-supplier-licence" name="mod-supplierLicence">
          </div>

        </div>
        <label for="mod-supplier-remark">Remarks</label>
        <textarea name="mod-supplierRemark" id="mod-supplier-remark" style="width:100%; height:100px"></textarea>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn mod-supplier-modify">Modify</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('supplier-modal').style.display='none'"
                   class="btn mod-supplier-exit" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
    return modal;
}

const modSupplierForm = {
  modifySupplier
};

export { modSupplierForm }