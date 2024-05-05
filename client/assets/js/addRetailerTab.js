function addRetailer ()  {
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  formContainer.innerHTML =
    `<div class="row">
      <div class="col-50">
        <h3>Contact Details</h3>
        <label for="retailer-name">Name</label>
        <input type="text" id="retailer-name" name="retailerName">
        <label for="retailer-address">Address</label>
        <input type="text" id="retailer-address" name="retailerAddress">
        <label for="retailer-phone">Phone Number</label>
        <input type="text" id="retailer-phone" name="retailerPhone">
      </div>
      <div class="col-50">
        <h3>Tax & Licence Info</h3>
        <label for="retailer-tin">TIN Number</label>
        <input type="text" id="retailer-tin" name="retailerTIN">
        <label for="retailer-licence">Licence Number</label>
        <input type="text" id="retailer-licence" name="retailerLicence">
      </div>

    </div>
    <label for="retailer-remark">Remarks</label>
    <textarea name="retailerRemark" id="retailer-remark" style="width:100%; height:100px"></textarea>
    <div class="row" style="margin-top:20px">
      <div class="col-50">
        <button class="btn retailer-save">Save</button>
      </div>
    </div>`;
    return formContainer;
}

// <div class="col-50">
//  <button class="btn retailer-exit" style="background-color:red">Exit</button>
// </div>

const retailerForm = {
  addRetailer
};

export { retailerForm }