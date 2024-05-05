
const salesOrderHoldTabContent = document.getElementById('sales-hold-order');
const SalesBtnCard = document.getElementById('sales-button-card');

const holdContent = makeOrderHold();

salesOrderHoldTabContent.appendChild(holdContent);

window.onclick = function (event) {
  if (!event.target.matches(".drop-btn")) {
    let dropdowns = document.getElementsByClassName("drop-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}



function makeOrderHold () {
  const holdContent = document.createElement('div');
  holdContent.className = 'sales-container';


  holdContent.innerHTML = `<div class="sales-row">
                                    <div class="sales-col-50">
                                      <div class="sales-table-">
                                        <table>
                                          <thead>
                                            <tr>
                                              <td>Order ID</td>
                                              <td>Customer ID</td>
                                              <td>Order Date</td>
                                              <td>Total Amount</td>
                                            </tr>
                                          </thead>
                                          <tbody></tbody> 
                                        </table>
                                      </div>
                                    </div>
                                  </div>`;
  return holdContent;
}