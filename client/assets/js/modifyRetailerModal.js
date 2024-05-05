function modifyRetailer () {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'retailer-modal'

  modal.innerHTML = 
  `<div class="modal-content">
      <span onclick="document.getElementById('retailer-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
      <h2>Modify Retailer Customer Details</h2>
      <div class="form-container">
        <div class="row">
          <div class="col-50">
            <h3>Contact Details</h3>
            <label for="mod-retailer-name">Name</label>
            <input type="text" id="mod-retailer-name" name="mod-retailerName">
            <label for="m-retailer-address">Address</label>
            <input type="text" id="mod-retailer-address" name="mod-retailerAddress">
            <label for="m-retailer-phone">Phone Number</label>
            <input type="text" id="mod-retailer-phone" name="mod-retailerPhone">
          </div>
          <div class="col-50">
            <h3>Tax & Licence Info</h3>
            <label for="mod-retailer-tin">TIN Number</label>
            <input type="text" id="mod-retailer-tin" name="mod-retailerTIN">
            <label for="mod-retailer-licence">Licence Number</label>
            <input type="text" id="mod-retailer-licence" name="mod-retailerLicence">
          </div>

        </div>
        <label for="mod-retailer-remark">Remarks</label>
        <textarea name="mod-retailerRemark" id="mod-retailer-remark" style="width:100%; height:100px"></textarea>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn mod-retailer-modify">Modify</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('retailer-modal').style.display='none'"
                   class="btn mod-retailer-exit" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
    return modal;
}

const modRetailerForm = {
  modifyRetailer
};

export { modRetailerForm }